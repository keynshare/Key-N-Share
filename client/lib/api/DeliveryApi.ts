"use client";

import axios from "axios";
import { decryptDatasetByCidAndDownload } from "./Decryption";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/";

function normalizePublicKeyPem(pem: string): string {
	if (!pem) return pem;
	// Remove headers/footers and all whitespace to get pure base64
	const base64 = pem
		.replace(/-----BEGIN [^-]+-----/g, "")
		.replace(/-----END [^-]+-----/g, "")
		.replace(/\s+/g, "")
		.trim();
	// Rewrap with single newlines after header and before footer
	return `-----BEGIN PUBLIC KEY-----\n${base64}\n-----END PUBLIC KEY-----`;
}

export interface DeliverDatasetRequest {
	datasetId: string;
	buyerAddress: string;
	buyerId: string;
	buyerPublicKey: string; // PEM
}

export interface DeliverDatasetResponse {
	success?: boolean;
	message?: string;
	data?: {
		cid: string;
		encryptedSymmetricKey: string; // base64 (RSA-OAEP wrapped AES key)
	};
	// Some endpoints may return the fields at the root level
	cid?: string;
	encryptedSymmetricKey?: string;
}

export async function requestDelivery(
	body: DeliverDatasetRequest,
	token?: string
): Promise<DeliverDatasetResponse> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
    const payload: DeliverDatasetRequest = {
        ...body,
        buyerPublicKey: normalizePublicKeyPem(body.buyerPublicKey),
    };
    const { data } = await axios.post(`${API_URL}delivery/deliver-dataset`, payload, { headers });
	return data;
}

export interface DeliverAndDownloadParams extends DeliverDatasetRequest {
	privateKeyPem: string; // User-provided RSA private key (PEM)
	filename?: string;
	token?: string;
	preserveOriginalFormat?: boolean; // if true, use original filename and MIME type
}

export async function deliverDecryptAndDownload(params: DeliverAndDownloadParams): Promise<void> {
	const { privateKeyPem, filename, token, preserveOriginalFormat, ...body } = params;
	const res = await requestDelivery(body, token);
	const cid = res?.data?.cid || (res as any)?.cid;
	const encryptedKey = res?.data?.encryptedSymmetricKey || (res as any)?.encryptedSymmetricKey;
	if (!cid || !encryptedKey) throw new Error("Delivery response missing cid or encryptedSymmetricKey");

	await decryptDatasetByCidAndDownload({
		cid,
		filename,
		encryptedAesKeyBase64: encryptedKey,
		privateKeyPem,
		token,
		preserveOriginalFormat,
	});
}


