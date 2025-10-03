"use client";

import React,{useEffect} from "react";
import { useWalletConnection } from "@/lib/Authentication/walletConnection";
import { useAuth } from "@/lib/Authentication/AuthContext";
// import { datasetApi } from "@/lib/api/DatasetApi";
import { publicKeyApi } from "@/lib/api/PublicKeyApi";

export interface DeliveryFormValues {
	datasetId: string;
	buyerAddress: string;
	buyerId: string;
	BuyerName:string;
	buyerPublicKey: string;
	privateKeyPem: string;
	filename: string;
}

interface Props {
	values: DeliveryFormValues;
	onChange: (values: DeliveryFormValues) => void;
	onSubmit: () => void;
	busy?: boolean;
	datasetInfo?: {
		title?: string;
		extension?: string;
	} | null;
}

export default function DeliveryForm({ values, onChange, onSubmit, busy, datasetInfo }: Props) {
    const { address } = useWalletConnection();
    const { userId, token, PublicKeyRSA } = useAuth();
	
	const set = (key: keyof DeliveryFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		onChange({ ...values, [key]: e.target.value });

    // Auto-populate buyer address from wallet connection
	useEffect(() => {
		if (address && !values.buyerAddress) {
			onChange({ ...values, buyerAddress: address });
		}
	}, [address, values.buyerAddress, onChange, values]);

    // Auto-populate buyer ID from auth context
    useEffect(() => {
        if (userId && !values.buyerId) {
            onChange({ ...values, buyerId: userId });
        }
    }, [userId, values.buyerId, onChange, values]);

    // Auto-populate buyer public key from backend or auth context
    useEffect(() => {
        const fetchPublicKey = async () => {
            if (!token || values.buyerPublicKey) return;

            try {
                // First try to fetch from backend
                const response = await publicKeyApi.getPublicKey(token);
                if (response.publicKeyPEM) {
                    onChange({ ...values, buyerPublicKey: response.publicKeyPEM });
                    return;
                }
            } catch (error) {
                console.log("Could not fetch public key from backend, trying auth context");
            }

            // Fallback to PublicKeyRSA from auth context
            if (PublicKeyRSA && !values.buyerPublicKey) {
                onChange({ ...values, buyerPublicKey: PublicKeyRSA });
            }
        };

        fetchPublicKey();
    }, [token, PublicKeyRSA, values.buyerPublicKey, onChange, values]);

	return (
		<div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">Dataset Title</label>
					<input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" value={datasetInfo?.title || "Loading..."} onChange={set("datasetId")} disabled placeholder="68c9a8..." />
					{values.buyerAddress === address && values.datasetId ? (
						<p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Auto-filled from orders</p>
					) : !values.datasetId && (
						<p className="text-xs text-red-600 dark:text-red-400 mt-1">✗ Not auto-filled please come through orders</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Buyer Address</label>
					<input 
						className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" 
						value={values.buyerAddress} 
						onChange={set("buyerAddress")} 
						placeholder={address ? "Auto-filled from wallet" : "Connect wallet or enter manually"} 
						disabled={!!address && values.buyerAddress === address}
					/>
					{address && values.buyerAddress === address && (
						<p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Auto-filled from connected wallet</p>
					)}
				</div>
                <div>
                    <label className="block text-sm font-medium mb-1">Buyer Name</label>
                    <input 
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" 
                        value={values.BuyerName} 
                        onChange={set("buyerId")} 
                        placeholder={userId ? "Auto-filled from account" : "Login required"}
                        disabled={!!userId && values.buyerId === userId}
                    />
                    {userId && values.buyerId === userId || values.BuyerName && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Auto-filled from orders</p>
                    )}
                </div>
				{/* <div>
					<label className="block text-sm font-medium mb-1">Download filename</label>
					<input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" value={values.filename} onChange={set("filename")} placeholder="dataset.csv" />
                </div> */}
                <div>
                    <label className="block text-sm font-medium mb-1">Download filename</label>
                    <input 
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" 
                        value={values.filename}
                        onChange={() => {}}
                        placeholder={values.datasetId ? "Auto-fetched from dataset" : "Enter dataset ID to fetch"}
                        disabled
                    />
                    {values.filename && datasetInfo ? (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            ✓ Using original filename: {datasetInfo.title} ({datasetInfo.extension || 'bin'})
                        </p>
                    ) : values.filename ? (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Using generated filename</p>
                    ) : null}
                </div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">Buyer Public Key (PEM)</label>
					<textarea 
						className="w-full h-40 font-mono text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" 
						value={values.buyerPublicKey} 
						onChange={set("buyerPublicKey")} 
						placeholder={"-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"} 
					/>
					{values.buyerPublicKey && (
						<p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Public key auto-filled from your account</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Your Private Key (PEM)</label>
					<textarea className="w-full h-40 font-mono text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" value={values.privateKeyPem} onChange={set("privateKeyPem")} placeholder={"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"} />
				</div>
			</div>

			<div className="flex justify-end">
				<button onClick={onSubmit} disabled={busy} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 font-medium shadow">
					{busy ? "Processing..." : "Deliver, decrypt & download"}
				</button>
			</div>
		</div>
	);
}


