"use client";

import React,{useState, useEffect} from "react";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { useNotifications } from "@/lib/notification-context";
import { publicKeyApi } from "@/lib/api/PublicKeyApi";

type KeySize = 1024 | 2048 | 4096;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode.apply(null, Array.from(chunk) as unknown as number[]);
	}
	return typeof window !== "undefined"
		? window.btoa(binary)
		: Buffer.from(binary, "binary").toString("base64");
}

function formatAsPem(base64: string, header: string, footer: string): string {
	const lines: string[] = [];
	for (let i = 0; i < base64.length; i += 64) {
		lines.push(base64.slice(i, i + 64));
	}
	return `-----BEGIN ${header}-----\n${lines.join("\n")}\n-----END ${footer}-----`;
}

async function exportPublicKeyPem(publicKey: CryptoKey): Promise<string> {
	const spki = await crypto.subtle.exportKey("spki", publicKey);
	const base64 = arrayBufferToBase64(spki);
	return formatAsPem(base64, "PUBLIC KEY", "PUBLIC KEY");
}

async function exportPrivateKeyPem(privateKey: CryptoKey): Promise<string> {
	const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey);
	const base64 = arrayBufferToBase64(pkcs8);
	return formatAsPem(base64, "PRIVATE KEY", "PRIVATE KEY");
}

async function generateRsaKeyPair(modulusLength: KeySize) {
	return crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: "SHA-256",
		},
		true,
		["encrypt", "decrypt"]
	);
}

function download(filename: string, text: string) {
	const blob = new Blob([text], { type: "application/x-pem-file" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export default function RSAKeyGenPage() {
	const [keySize, setKeySize] = useState<KeySize>(2048);
	const [privatePem, setPrivatePem] = useState("");
	const [publicPem, setPublicPem] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [isStoring, setIsStoring] = useState(false);
	const [hasExistingKey, setHasExistingKey] = useState(false);
	const [forceNewKey, setForceNewKey] = useState(false);

	const { userId, token } = useAuth();
	const { notify } = useNotifications();

	// Check for existing public key on component mount
	useEffect(() => {
		const checkExistingKey = async () => {
			if (!userId || !token) return;
			
			try {
				const response = await publicKeyApi.getPublicKey(token);
				if (response.publicKeyPEM) {
					setHasExistingKey(true);
					setPublicPem(response.publicKeyPEM);
					notify({
						message: "You already have a public key stored. Using your existing key pair.",
						type: "info",
						title: "Existing Key Found"
					});
				}
			} catch {
				// No existing key found, which is fine
				console.log("No existing public key found");
			}
		};

		checkExistingKey();
	}, [userId, token, notify]);

	const storePublicKey = async (publicKey: string) => {
		if (!userId || !token) {
			notify({
				message: "Authentication required to store public key",
				type: "error",
				title: "Authentication Error"
			});
			return false;
		}

		setIsStoring(true);
		try {
			await publicKeyApi.addPublicKey({
				userId,
				publicKey
			}, token);
			
			notify({
				message: hasExistingKey ? "Public key updated successfully! Your new key pair is ready to use." : "Public key stored successfully! You can now use this key pair for encryption.",
				type: "success",
				title: hasExistingKey ? "Key Updated" : "Key Stored"
			});
			return true;
		} catch (error: unknown) {
			console.error("Error storing public key:", error);
			const errorMessage = error && typeof error === 'object' && 'response' in error 
				? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
				: "Failed to store public key. Please try again.";
			notify({
				message: errorMessage || "Failed to store public key. Please try again.",
				type: "error",
				title: "Storage Error"
			});
			return false;
		} finally {
			setIsStoring(false);
		}
	};

	const onGenerate = async () => {
		// If user already has a key and hasn't forced a new key, don't generate a new one
		if (hasExistingKey && !forceNewKey) {
			notify({
				message: "You already have a public key stored. Please use your existing key pair.",
				type: "warning",
				title: "Key Already Exists"
			});
			return;
		}

		setIsGenerating(true);
		setMessage("Generating key pair... This may take a moment.");
		try {
			const keyPair = (await generateRsaKeyPair(keySize)) as CryptoKeyPair;
			const [priv, pub] = await Promise.all([
				exportPrivateKeyPem(keyPair.privateKey),
				exportPublicKeyPem(keyPair.publicKey),
			]);
			setPrivatePem(priv);
			setPublicPem(pub);
			setMessage("Key pair generated successfully.");
			
			// Automatically store the public key
			const stored = await storePublicKey(pub);
			if (stored) {
				setHasExistingKey(true);
				setForceNewKey(false);
			}
		} catch (err) {
			console.error(err);
			setMessage("Failed to generate keys. Your browser must support WebCrypto.");
		} finally {
			setIsGenerating(false);
		}
	};

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setMessage("Copied to clipboard.");
		} catch {
			setMessage("Copy failed. You can select and copy manually.");
		}
	};

	return (
		<div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="mb-8 text-center">
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">RSA Key Generator</h1>
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
					Generate RSA public/private key pairs in your browser. Nothing leaves your device.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6">
				<div className="col-span-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
					<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
						<div className="flex-1">
							<label className="block text-sm font-medium mb-2">Key Length</label>
							<select
								className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								value={keySize}
								onChange={(e) => setKeySize(parseInt(e.target.value, 10) as KeySize)}
							>
								
								<option value={2048}>2048</option>
								<option value={4096}>4096</option>
							</select>
							<p className="mt-2 text-xs text-gray-500">Larger keys increase security and generation time.</p>
						</div>
						<div className="flex flex-col md:flex-row gap-3">
							<button
								onClick={onGenerate}
								disabled={isGenerating || isStoring || (hasExistingKey && !forceNewKey)}
								className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 font-medium shadow"
							>
								{isGenerating ? "Generating..." : isStoring ? "Storing..." : hasExistingKey && !forceNewKey ? "Key Already Exists" : "Generate key pair"}
							</button>
							{hasExistingKey && !forceNewKey && (
								<button
									onClick={() => setForceNewKey(true)}
									className="inline-flex items-center justify-center rounded-lg border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-4 py-2 font-medium"
								>
									Generate New Key
								</button>
							)}
							<button
								onClick={() => {
									if (privatePem) download(`private_${keySize}.pem`, privatePem);
									if (publicPem) download(`public_${keySize}.pem`, publicPem);
								}}
								disabled={!privatePem}
								className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Download keys
							</button>
						</div>
					</div>

					{message && (
						<p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
					)}
					{hasExistingKey && !forceNewKey && (
						<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
							<p className="text-sm text-blue-800 dark:text-blue-200">
								✓ You already have a public key stored. Your existing key pair is displayed below. &#40;private key should be stored securely by you&#41;
							</p>
						</div>
					)}
					{forceNewKey && (
						<div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
							<p className="text-sm text-orange-800 dark:text-orange-200">
								⚠️ You are generating a new key pair. This will replace your existing public key.
							</p>
						</div>
					)}
				</div>

				<div className="col-span-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur p-4 sm:p-4">
					<div className="flex flex-col xl:flex-row  items-center gap-4 justify-between mb-3">
						<div className="flex flex-col gap-4"><h2 className="text-lg font-semibold">Private key</h2>
						<div className="flex gap-2">
							<button
								onClick={() => copy(privatePem)}
								disabled={!privatePem}
								className="text-xs rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Copy
							</button>
							<button
								onClick={() => privatePem && download("private.pem", privatePem)}
								disabled={!privatePem}
								className="text-xs rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Download
							</button>
						</div>
						</div>
					<textarea
						className="w-full h-80  text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3"
						value={privatePem}
						onChange={(e) => setPrivatePem(e.target.value)}
						placeholder={"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"}
					/>
				</div>
				</div>

				<div className="col-span-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/40 backdrop-blur p-4 sm:p-4">
					<div className="flex flex-col xl:flex-row items-center w-full gap-4 justify-between mb-3">
						<div className="flex flex-col gap-4">
						<h2 className="text-lg font-semibold">Public key</h2>
						<div className="flex gap-2">
							<button
								onClick={() => copy(publicPem)}
								disabled={!publicPem}
								className="text-xs rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Copy
							</button>
							<button
								onClick={() => publicPem && download("public.pem", publicPem)}
								disabled={!publicPem}
								className="text-xs rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Download
							</button>
						</div>
						</div>
					<textarea
						className="w-full h-80  text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3"
						value={publicPem}
						onChange={(e) => setPublicPem(e.target.value)}
						placeholder={"-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"}
					/>
				</div>
			</div>
			

			<div className="col-span-full justify-items-center mt-8 text-xs text-gray-500 dark:text-gray-400">
				<p className="text-center">
					This page uses the WebCrypto API (RSA-OAEP, SHA-256) for in-browser key generation. For a CLI alternative, see
					 <a className="text-indigo-600 hover:underline" href="https://cryptotools.net/rsagen" target="_blank" rel="noreferrer"> CryptoTools RSA generator</a>.
				</p>
			</div>
		
		</div>
		</div>
	);
}


