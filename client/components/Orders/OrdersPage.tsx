"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '@/components/SharedComponents/Breadcrumb/Breadcrumb'
import OrderDetailCard from '@/components/Orders/OrderDetailCard'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { userOrdersApi, UserOrder } from '@/lib/api/UserOrdersApi'

type OrderStatus = 'processing' | 'delivered' | 'disputed'

type UIOrder = {
  id: string
  Title?: string
  Description?: string
  Price?: number | string
  Type?: string
  Image?: string
  Tags?: string[]
  status: OrderStatus
  orderedAt: string
  txnSign?: string
  sellerUserId?: string
}

function OrdersPage() {
  const { userId, token } = useAuth()
  const breadcrumbItems = [
    { label: "Previous Orders", isActive: true }
  ]

  const [orders, setOrders] = useState<UIOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return
      try {
        setIsLoading(true)
        setError(null)
        const res = await userOrdersApi.listOrders({ userId, page: 1, limit: 20 }, token || undefined)
        const mapped: UIOrder[] = (res.orders || []).map((o: UserOrder) => ({
          id: o.datasetId,
          Title: o.dataset?.title,
          Description: o.dataset?.description,
          Price: o.dataset?.price,
          Type: o.dataset?.extension,
          Image: o.dataset?.coverImageUrl,
          Tags: o.dataset?.tags,
          status: 'delivered',
          orderedAt: o.createdAt,
          txnSign: o.txnSign,
          sellerUserId: o.dataset?.userId,
        }))
        setOrders(mapped)
      } catch (e: unknown) {
        setError('Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [userId, token])

  const [selectedId, setSelectedId] = useState<number | string | null>(null)
  useEffect(() => {
    if (orders.length && !selectedId) setSelectedId(orders[0]?.id)
  }, [orders, selectedId])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedId) ?? null, [orders, selectedId])

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'disputed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })


  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 pb-8">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Previous Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">View your purchased datasets and their delivery status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orders</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isLoading ? 'Loading…' : `${orders.length} total`}</p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {error && (
                  <div className="p-4 text-sm text-red-600">{error}</div>
                )}
                {!error && !isLoading && orders.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No orders yet.</div>
                )}
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id)
                      setIsDialogOpen(true)
                    }}
                    className={clsx(
                      'w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                      selectedId === order.id && 'bg-orange-50 dark:bg-orange-900/20'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{order.Title || 'Dataset'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{order.Type || '—'}</p>
                      </div>
                      <div className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', getStatusColor(order.status))}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{order.Price ?? '—'} Solana</span>
                      <span className="text-gray-500 dark:text-gray-400">{formatDate(order.orderedAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 hidden lg:block">
            {selectedOrder ? (
              <div className="bg-white dark:bg-[#131313] rounded-xl border h-fit max-w-full border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <OrderDetailCard
                  id={selectedOrder.id}
                  Title={selectedOrder.Title}
                  Description={selectedOrder.Description}
                  Price={selectedOrder.Price}
                  Type={selectedOrder.Type}
                  Image={selectedOrder.Image}
                  Tags={selectedOrder.Tags}
                  status={selectedOrder.status}
                  orderedAt={selectedOrder.orderedAt}
                  txHash={selectedOrder.txnSign}
                  sellerUserId={selectedOrder.sellerUserId}
                  onDownload={() => {}}
                  onRaiseDispute={() => {}}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select an Order</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose an order from the list to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed lg:hidden w-full h-screen top-0 left-0 inset-0 bg-black/50 flex justify-center p-2 overflow-y-auto z-[999999999999999]">
          <div className="bg-white dark:bg-[#131313] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-2 w-full h-fit max-w-full my-6">
            {selectedOrder && (
              <>
                <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold">Order Details</h4>
                  <button className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800" onClick={() => setIsDialogOpen(false)}>Close</button>
                </div>
                <div className="p-2">
                  <OrderDetailCard
                    id={selectedOrder.id}
                    Title={selectedOrder.Title}
                    Description={selectedOrder.Description}
                    Price={selectedOrder.Price}
                    Type={selectedOrder.Type}
                    Image={selectedOrder.Image}
                    Tags={selectedOrder.Tags}
                    status={selectedOrder.status}
                    orderedAt={selectedOrder.orderedAt}
                    txHash={selectedOrder.txnSign}
                    sellerUserId={selectedOrder.sellerUserId}
                    onDownload={() => {}}
                    onRaiseDispute={() => {}}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage


