"use client";

import React from "react";
import DeliveryForm, { DeliveryFormValues } from "@/components/Delivery/DeliveryForm";
import { deliverDecryptAndDownload } from "@/lib/api/DeliveryApi";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { datasetApi } from "@/lib/api/DatasetApi";

export default function DeliveryPage() {
    const { token } = useAuth();
    const [values, setValues] = React.useState<DeliveryFormValues>({
        datasetId: "",
        buyerAddress: "",
        buyerId: "",
        buyerPublicKey: "",
        privateKeyPem: "",
        filename: "dataset.csv",
    });
    const [busy, setBusy] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);

    // Auto-fetch original filename when datasetId changes
    React.useEffect(() => {
        const fetchName = async () => {
            if (!values.datasetId) return;
            try {
                const info = await datasetApi.getDatasetByCID(values.datasetId, token || undefined);
                const original = info?.data?.filename;
                if (original && values.filename !== (original.endsWith('.enc') ? original.slice(0, -4) : original)) {
                    setValues(v => ({ ...v, filename: original.endsWith('.enc') ? original.slice(0, -4) : original }));
                }
            } catch (e) {
                // ignore
            }
        };
        fetchName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.datasetId, token]);

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
                token: token || undefined,
                preserveOriginalFormat: true,
            });
            setMessage("Download started.");
		} catch (e: unknown) {
			console.error(e);
			const msg = e instanceof Error ? e.message : "Delivery or decryption failed.";
			setMessage(msg);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">Deliver and Decrypt Dataset</h1>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <DeliveryForm values={values} onChange={setValues} onSubmit={onSubmit} busy={busy} />
                {message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
            </div>
        </div>
    );
}


