"use client";

import React from "react";
import DeliveryForm, { DeliveryFormValues } from "@/components/Delivery/DeliveryForm";
import { deliverDecryptAndDownload, checkDeliveryExists, checkAndDownloadExistingDelivery } from "@/lib/api/DeliveryApi";
import { useAuth } from "@/lib/Authentication/AuthContext";

export default function DeliveryPage({ Id }: { Id: string | number | undefined | null}) {
	const { token } = useAuth();
	const [values, setValues] = React.useState<DeliveryFormValues>({
		datasetId: Id ? Id.toString() : "",
		buyerAddress: "",
		buyerId: "",
		buyerPublicKey: "",
		privateKeyPem: "",
		filename: "dataset.bin",
	});
	const [busy, setBusy] = React.useState(false);
	const [message, setMessage] = React.useState<string | null>(null);
	const [deliveryExists, setDeliveryExists] = React.useState<boolean | null>(null);
	const [existingDeliveryData, setExistingDeliveryData] = React.useState<any>(null);
	const [checkingDelivery, setCheckingDelivery] = React.useState(false);

	// Check if delivery already exists when datasetId and buyerId are available
	React.useEffect(() => {
		const checkExistingDelivery = async () => {
			if (!values.datasetId || !values.buyerId) {
				setDeliveryExists(null);
				setExistingDeliveryData(null);
				setCheckingDelivery(false);
				return;
			}

			setCheckingDelivery(true);
			try {
				const result = await checkDeliveryExists(
					{ datasetId: values.datasetId, buyerId: values.buyerId },
					token || undefined
				);
				
				// Handle server error response
				if (result.message && result.message === "Server error") {
					console.error('Server error checking delivery existence:', result);
					console.error('Request params:', { datasetId: values.datasetId, buyerId: values.buyerId });
					setDeliveryExists(false);
					setExistingDeliveryData(null);
				} else {
					setDeliveryExists(result.exists);
					setExistingDeliveryData(result.exists ? result : null);
				}
			} catch (error) {
				console.error('Error checking delivery existence:', error);
				setDeliveryExists(false);
				setExistingDeliveryData(null);
			} finally {
				setCheckingDelivery(false);
			}
		};

		checkExistingDelivery();
	}, [values.datasetId, values.buyerId, token]);

	const onSubmit = async () => {
		setBusy(true);
		setMessage("Processing...");

		try {
			// First check if delivery already exists
			if (deliveryExists && existingDeliveryData && values.privateKeyPem) {
				setMessage("Found existing delivery, downloading directly...");
				await checkAndDownloadExistingDelivery({
					datasetId: values.datasetId,
					buyerId: values.buyerId,
					privateKeyPem: values.privateKeyPem,
					filename: values.filename,
					preserveOriginalFormat: true,
				}, token || undefined);
				setMessage("Download started from existing delivery.");
			} else {
				// Create new delivery
				setMessage("Creating new delivery and decrypting...");
				await deliverDecryptAndDownload({
					buyerAddress: values.buyerAddress,
					buyerId: values.buyerId,
					buyerPublicKey: values.buyerPublicKey,
					datasetId: values.datasetId,
					filename: values.filename,
					privateKeyPem: values.privateKeyPem,
					token: token || undefined,
					preserveOriginalFormat: true,
				});
				setMessage("Download started from new delivery.");
			}
		} catch (e: unknown) {
			console.error(e);
			const message = e instanceof Error ? e.message : "Delivery or decryption failed.";
			setMessage(message);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">Decrypt and Download Dataset</h1>
			<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
				<DeliveryForm values={values} onChange={setValues} onSubmit={onSubmit} busy={busy} />
				
				{/* Delivery Status Indicator */}
				{values.datasetId && values.buyerId && (
					<div className="mt-4 p-3 rounded-lg border">
						{checkingDelivery ? (
							<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
								Checking for existing delivery...
							</div>
						) : deliveryExists ? (
							<div className="flex items-center text-sm text-green-600 dark:text-green-400">
								<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								✓ Encrypted dataset already exists for this user
								{existingDeliveryData?.createdAt && (
									<span className="ml-2 text-xs text-gray-500">
										(Created: {new Date(existingDeliveryData.createdAt).toLocaleDateString()})
									</span>
								)}
							</div>
						) : (
							<div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
								<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								⚠ No existing delivery found - will create new one, enter private key
							</div>
						)}
					</div>
				)}

				{message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
			</div>
		</div>
	);
}


