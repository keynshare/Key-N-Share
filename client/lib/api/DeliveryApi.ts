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
	orderId?: string | number | null | undefined; 
}

export async function deliverDecryptAndDownload(params: DeliverAndDownloadParams): Promise<void> {
	const { privateKeyPem, filename, token, preserveOriginalFormat, ...body } = params;
	const res = await requestDelivery(body, token);
	// Some backends return fields at the root; normalize safely without using 'any'
	const maybeRoot = res as unknown as Partial<{ cid: string; encryptedSymmetricKey: string }>;
	const cid = res?.data?.cid || maybeRoot?.cid;
	const encryptedKey = res?.data?.encryptedSymmetricKey || maybeRoot?.encryptedSymmetricKey;
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

export interface CheckDeliveryExistsRequest {
	datasetId: string;
	buyerId: string;
}

export interface CheckDeliveryExistsResponse {
	exists: boolean;
	cid?: string;
	encryptedSymmetricKey?: string;
	createdAt?: string;
	updatedAt?: string;
	message?: string;
}

export async function checkDeliveryExists(
	body: CheckDeliveryExistsRequest,
	token?: string
): Promise<CheckDeliveryExistsResponse> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	
	const { data } = await axios.get(`${API_URL}delivery/delivery-exists`, { 
		headers,
		params: body
	});
	return data;
}

/**
 * Utility function to check if delivery exists and optionally download it directly
 * @param params - Parameters for checking delivery existence
 * @param token - Optional authentication token
 * @returns Promise with delivery status and data if exists
 */
export async function checkAndDownloadExistingDelivery(
	params: CheckDeliveryExistsRequest & { 
		privateKeyPem?: string; 
		filename?: string; 
		preserveOriginalFormat?: boolean;
	},
	token?: string
): Promise<{ exists: boolean; downloaded?: boolean; data?: CheckDeliveryExistsResponse }> {
	try {
		const deliveryStatus = await checkDeliveryExists(params, token);
		
		if (deliveryStatus.exists && params.privateKeyPem && deliveryStatus.cid && deliveryStatus.encryptedSymmetricKey) {
			// Download the existing delivery
			await decryptDatasetByCidAndDownload({
				cid: deliveryStatus.cid,
				filename: params.filename,
				encryptedAesKeyBase64: deliveryStatus.encryptedSymmetricKey,
				privateKeyPem: params.privateKeyPem,
				token,
				preserveOriginalFormat: params.preserveOriginalFormat,
			});
			
			return { 
				exists: true, 
				downloaded: true, 
				data: deliveryStatus 
			};
		}
		
		return { 
			exists: deliveryStatus.exists, 
			downloaded: false, 
			data: deliveryStatus 
		};
	} catch (error) {
		console.error('Error checking delivery existence:', error);
		return { exists: false, downloaded: false };
	}
}