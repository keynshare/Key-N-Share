import React, { useState } from 'react'
import { datasetApi } from '@/lib/api/DatasetApi'
import { checkHashIntegrity } from '@/lib/api/DeliveryApi'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { useNotifications } from '@/lib/notification-context'

interface IntegrityPopupProps {
	isOpen: boolean
	datasetId: string | number
	onClose: () => void
}

function IntegrityPopup({ isOpen, datasetId, onClose }: IntegrityPopupProps) {
	const { token } = useAuth()
	const { notify } = useNotifications()
	const [file, setFile] = useState<File | null>(null)
	const [isVerifying, setIsVerifying] = useState(false)
	const [result, setResult] = useState<null | { valid: boolean; hash: string }>(null)

	if (!isOpen) return null

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setResult(null)
		const f = e.target.files?.[0] || null
		setFile(f)
	}

	const handleVerify = async () => {
		if (!file) {
			notify({ type: 'error', message: 'Please select a file to verify' })
			return
		}
		try {
			setIsVerifying(true)
			// If watermark exists in text content, remove it temporarily before hashing
			let hashFile: File = file
			try {
				const fileText = await file.text()
				const watermarkRegex = /\n--watermark:(.*?)--\n/
				const match = fileText.match(watermarkRegex)
				if (match && match[1]) {
					const cleanedText = fileText.replace(watermarkRegex, '')
					const cleanedBlob = new Blob([cleanedText], { type: file.type || 'text/plain' })
					hashFile = new File([cleanedBlob], file.name, { type: file.type || 'text/plain' })
				}
			} catch (_) {
				// If reading as text fails (binary file), fall back to original file
			}
			// Generate SHA-256 for possibly cleaned file
			const hash = await datasetApi.generateSHA256(hashFile)
			// Call server to verify
			const response = await checkHashIntegrity({ datasetId: String(datasetId), dataHash: hash }, token || undefined)
			setResult({ valid: response.valid, hash })
			if (response.valid) {
				notify({ type: 'success', message: 'Integrity verified. File matches original File.' })
			} else {
				notify({ type: 'error', message: 'Integrity failed. File hash does not match.' })
			}
		} catch (e) {
			console.error(e)
			notify({ type: 'error', message: 'Failed to verify integrity' })
		} finally {
			setIsVerifying(false)
		}
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />
			<div className='relative z-10 w-full max-w-md rounded-xl bg-white dark:bg-[#0b0b0b] border border-gray-200 dark:border-gray-700 p-5 shadow-xl'>
				<h3 className='text-lg font-semibold mb-3'>Check Integrity</h3>
				<p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>Select the original dataset file you received to verify its integrity.</p>
				<input 
					type='file' 
					className='w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-md   file:bg-[#101010] file:dark:bg-[#242424] file:hover:bg-[#313131] file:dark:hover:bg-[#313131] file:text-white file:border-none '
					onChange={onFileChange}
				/>
				{result && (
					<div className='mt-4 rounded-md border border-gray-200 dark:border-gray-700 p-3'>
						<div className={`text-sm font-medium ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
							{result.valid ? 'Integrity OK :Data is intact' : 'Warning: Data may be altered'}
						</div>
						<div className='mt-1 break-all text-xs text-gray-600 dark:text-gray-300'>Hash: {result.hash}</div>
					</div>
				)}
				<div className='mt-5 flex justify-end gap-2'>
					<button onClick={onClose} className='px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700'>Cancel</button>
					<button onClick={handleVerify} disabled={isVerifying || !file} className='px-4 py-2 text-sm rounded-md bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white'>
						{isVerifying ? 'Verifying…' : 'Verify'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default IntegrityPopup
