"use client";

import React from "react";
import DeliveryForm, { DeliveryFormValues } from "@/components/Delivery/DeliveryForm";
import { deliverDecryptAndDownload } from "@/lib/api/DeliveryApi";

export default function DeliveryPage() {
	const [values, setValues] = React.useState<DeliveryFormValues>({
		datasetId: "",
		buyerAddress: "",
		buyerId: "",
		buyerPublicKey: "",
		privateKeyPem: "",
		filename: "dataset.bin",
	});
	const [busy, setBusy] = React.useState(false);
	const [message, setMessage] = React.useState<string | null>(null);

	const onSubmit = async () => {
		setBusy(true);
		setMessage("Contacting delivery service and decrypting...");
		try {
			await deliverDecryptAndDownload({
				buyerAddress: values.buyerAddress,
				buyerId: values.buyerId,
				buyerPublicKey: values.buyerPublicKey,
				datasetId: values.datasetId,
				filename: values.filename,
				privateKeyPem: values.privateKeyPem,
			});
			setMessage("Download started.");
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
				{message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
			</div>
		</div>
	);
}


