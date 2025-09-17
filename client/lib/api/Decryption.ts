"use client";

import { datasetApi } from "./DatasetApi";

export type AesKey = CryptoKey;

function base64ToBytes(b64: string): Uint8Array {
	if (typeof window !== "undefined" && typeof (window as unknown as { atob?: (s: string) => string }).atob === "function") {
		const binary = atob(b64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
		return bytes;
	}
	const buf = Buffer.from(b64, "base64");
	return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

function pemToBinary(pem: string): ArrayBuffer {
	const clean = pem
		.replace(/-----BEGIN [^-]+-----/g, "")
		.replace(/-----END [^-]+-----/g, "")
		.replace(/\s+/g, "");
	const bytes = base64ToBytes(clean);
	// Ensure we return a standalone ArrayBuffer, not a view into a larger buffer
	const sliced = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
	// Force ArrayBuffer type (exclude SharedArrayBuffer)
	return new Uint8Array(sliced).buffer as ArrayBuffer;
}

export async function importRsaPrivateKeyFromPem(pem: string): Promise<CryptoKey> {
	const pkcs8 = pemToBinary(pem);
	return crypto.subtle.importKey(
		"pkcs8",
		pkcs8,
		{ name: "RSA-OAEP", hash: "SHA-256" },
		false,
		["decrypt"]
	);
}

export async function decryptWrappedAesKey(
	encryptedKeyBase64: string,
	privateKeyPem: string
): Promise<AesKey> {
	const rsaPrivate = await importRsaPrivateKeyFromPem(privateKeyPem);
	const encryptedKeyBytes = base64ToBytes(encryptedKeyBase64);
	// Ensure we provide an ArrayBuffer (not ArrayBufferLike) to WebCrypto
	const encryptedKeyArrayBuffer = encryptedKeyBytes.buffer.slice(
		encryptedKeyBytes.byteOffset,
		encryptedKeyBytes.byteOffset + encryptedKeyBytes.byteLength
	) as ArrayBuffer;
	const rawAesKey = await crypto.subtle.decrypt(
		{ name: "RSA-OAEP" },
		rsaPrivate,
		encryptedKeyArrayBuffer
	);
	return crypto.subtle.importKey(
		"raw",
		rawAesKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["decrypt"]
	);
}

export async function decryptDatasetBytes(
	encrypted: ArrayBuffer,
	aesKey: AesKey
): Promise<ArrayBuffer> {
	const cipherBytes = new Uint8Array(encrypted);

	// Try layout 1: [12-byte IV][ciphertext]
	if (cipherBytes.byteLength > 12) {
		const iv1 = cipherBytes.subarray(0, 12);
		const ct1 = cipherBytes.subarray(12);
		try {
			return await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv1 }, aesKey, ct1);
		} catch (_) {
			// fallthrough, try layout 2
		}
	}

	// Try layout 2: [16-byte salt][12-byte IV][ciphertext]
	if (cipherBytes.byteLength > 28) {
		const iv2 = cipherBytes.subarray(16, 28);
		const ct2 = cipherBytes.subarray(28);
		return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv2 }, aesKey, ct2);
	}

	throw new Error("Unsupported ciphertext format. Expected IV+ciphertext or salt+IV+ciphertext.");
}

export interface DecryptAndDownloadParams {
	cid: string;
	filename?: string;
	encryptedAesKeyBase64: string; // RSA-OAEP wrapped AES key
	privateKeyPem: string; // user's RSA private key
	token?: string; // optional auth
	preserveOriginalFormat?: boolean; // if true, use original filename and MIME type
}

export async function decryptDatasetByCidAndDownload(params: DecryptAndDownloadParams): Promise<void> {
	const { cid, filename, encryptedAesKeyBase64, privateKeyPem, token, preserveOriginalFormat = true } = params;

	// 1) Resolve dataset URLs from backend using existing helper
	const data = await datasetApi.getDatasetByCID(cid, token);
	const url: string = data?.data?.directDownload || data?.data?.downloadUrls?.primary;
	if (!url) throw new Error("Download URL not found for CID");

	// 2) Fetch encrypted dataset bytes
	const resp = await fetch(url);
	if (!resp.ok) throw new Error("Failed to fetch dataset from gateway");
	const encryptedBytes = await resp.arrayBuffer();

	// 3) Decrypt wrapped AES key using user's private RSA key
	const aesKey = await decryptWrappedAesKey(encryptedAesKeyBase64, privateKeyPem);

	// 4) Decrypt dataset bytes
	const plainBytes = await decryptDatasetBytes(encryptedBytes, aesKey);

	// 5) Determine filename and MIME type
	let dlName: string;
	let mimeType: string = "application/octet-stream";

	if (preserveOriginalFormat && data?.data) {
		// Use original filename and MIME type from dataset metadata
		const originalFilename = data.data.filename;
		const originalMimeType = data.data.mimetype;
		
		if (originalFilename) {
			// Remove .enc extension if present and use original name
			dlName = originalFilename.endsWith('.enc') 
				? originalFilename.slice(0, -4) 
				: originalFilename;
		} else {
			dlName = filename || `${cid}.decrypted`;
		}
		
		if (originalMimeType) {
			mimeType = originalMimeType;
		}
	} else {
		dlName = filename || `${cid}.decrypted`;
	}

	// 6) Trigger download with proper MIME type
	const blob = new Blob([plainBytes], { type: mimeType });
	const urlObject = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = urlObject;
	a.download = dlName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(urlObject);
}


