"use client"
import React from 'react'
import Solana from '@/components/assets/Solana'
import SecondaryBtn from '@/components/SharedComponents/Btns/SecondaryBtn'
import { Calendar, Hash, Download, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

type OrderStatus = 'processing' | 'delivered' | 'disputed'

export interface OrderDetailProps {
  id: number | string
  Title?: string
  Description?: string
  Price?: number | string
  Type?: string
  Image?: string
  Tags?: string[]
  status: OrderStatus
  orderedAt: string
  txHash?: string
  onRaiseDispute?: (id: number | string) => void
  onDownload?: (id: number | string) => void
}

function OrderDetailCard({
  id,
  Title,
  Description,
  Price,
  Type,
  Image,
  Tags = [],
  status,
  orderedAt,
  txHash,
  onRaiseDispute,
  onDownload
}: OrderDetailProps) {
  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
      case 'disputed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    }
  }

  const formattedDate = new Date(orderedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="w-full">
      <div className="flex flex-col  gap-4">
        <div className="w-full ">
          {Image ? (
            <img
              src={Image}
              alt={Title || 'Dataset preview'}
              className="object-cover border max-h-[400px]  border-gray-100 dark:border-gray-700 rounded-lg w-full aspect-video"
            />
          ) : (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg w-full aspect-video flex items-center justify-center text-gray-500">
              No Preview
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold line-clamp-1 text-gray-900 dark:text-white truncate">{Title}</h2>
              {Type && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">File type: {Type}</p>
              )}
            </div>
            <span className={clsx('shrink-0 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium', getStatusColor(status))}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {Description && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{Description}</p>
          )}

          {!!Tags.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Tags.slice(0, 6).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col justify-center gap-2">
                   <div className="text-xs text-gray-500 dark:text-gray-400">Price</div>
              <div title='Price in Solana' className='flex gap-2 items-center'>
                <Solana size={24} />
                <div className="text-2xl font-semibold">{Price}</div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-2">
               <div className="text-xs text-gray-500 dark:text-gray-400">Ordered</div>
              <div className='flex gap-2 items-center'>
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="font-medium">{formattedDate}</div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-2">
              
                <div className="text-xs text-gray-500 dark:text-gray-400">Transaction</div>

              <div className="flex gap-2 items-center">
                <Hash className="w-5 h-5 text-gray-500" />
                <div className="font-medium truncate">{txHash || '—'}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <SecondaryBtn
              className="bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90"
              Href={`/decrypt-dataset/${id}`}
            >
              <Download className="w-4 h-4" /> Download Dataset
            </SecondaryBtn>
            <SecondaryBtn
              className="bg-red-600 dark:bg-red-600 hover:bg-[#fd5959] dark:hover:bg-[#fd5959] text-white"
              onClick={() => onRaiseDispute?.(id)}
            >
              <AlertTriangle className="w-4 h-4" /> Raise Dispute
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailCard


