# Dataset Payment Helper

A comprehensive helper function for buying datasets with SOL payments using Phantom wallet integration. This helper handles the complete flow from payment to order creation.

## Features

- ✅ **SOL Payment Processing**: Send SOL payments via Phantom wallet
- ✅ **Transaction Confirmation**: Check transaction status and confirmation
- ✅ **Order Creation**: Automatically create orders after successful payment
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **TypeScript Support**: Full TypeScript interfaces and type safety
- ✅ **React Hook**: Easy-to-use React hook for component integration
- ✅ **Wallet Integration**: Seamless integration with Solana wallet adapters

## Files

- `DatasetPaymentHelper.ts` - Main helper functions and React hook
- `DatasetPurchaseButton.tsx` - Ready-to-use React component
- `README.md` - This documentation

## Quick Start

### 1. Basic Usage with React Hook

```tsx
import { useDatasetPurchase } from '@/lib/solana/DatasetPaymentHelper';

function MyComponent() {
  const { purchaseDataset, isProcessing, lastResult, isWalletConnected } = useDatasetPurchase();

  const handleBuy = async () => {
    const result = await purchaseDataset({
      datasetId: "dataset123",
      sellerAddress: "seller_wallet_address",
      price: 0.5, // 0.5 SOL
      buyerId: "user123",
      token: "auth_token"
    });

    if (result.success) {
      console.log("Purchase successful!", result);
    } else {
      console.error("Purchase failed:", result.error);
    }
  };

  return (
    <button onClick={handleBuy} disabled={isProcessing || !isWalletConnected}>
      {isProcessing ? "Processing..." : "Buy Dataset"}
    </button>
  );
}
```

### 2. Using the Ready-to-Use Component

```tsx
import DatasetPurchaseButton from '@/components/DatasetPurchase/DatasetPurchaseButton';

function DatasetCard({ dataset }) {
  return (
    <div className="dataset-card">
      <h3>{dataset.title}</h3>
      <p>{dataset.description}</p>
      
      <DatasetPurchaseButton
        datasetId={dataset._id}
        sellerAddress={dataset.sellerAddress}
        price={dataset.price}
        datasetTitle={dataset.title}
        onPurchaseSuccess={(result) => {
          // Handle success - redirect to orders, show toast, etc.
          router.push('/orders');
        }}
        onPurchaseError={(error) => {
          // Handle error - show error toast, etc.
          toast.error(error);
        }}
      />
    </div>
  );
}
```

## API Reference

### `useDatasetPurchase()` Hook

Returns an object with the following properties:

```typescript
{
  purchaseDataset: (params: Omit<DatasetPurchaseParams, 'buyerAddress'>) => Promise<PaymentResult>;
  isProcessing: boolean;
  lastResult: PaymentResult | null;
  isWalletConnected: boolean;
  walletAddress: string | null;
}
```

### `DatasetPurchaseParams` Interface

```typescript
interface DatasetPurchaseParams {
  datasetId: string;        // ID of the dataset to purchase
  sellerAddress: string;    // Solana address of the seller
  price: number;           // Price in SOL
  buyerId: string;         // User ID of the buyer
  buyerAddress: string;    // Solana address of the buyer (auto-filled by hook)
  token?: string;          // Authentication token for API calls
}
```

### `PaymentResult` Interface

```typescript
interface PaymentResult {
  success: boolean;
  signature?: string;           // Transaction signature
  order?: any;                 // Created order object
  error?: string;              // Error message if failed
  confirmationStatus?: string; // Transaction confirmation status
}
```

## Core Functions

### `buyDatasetWithSOL(params: DatasetPurchaseParams): Promise<PaymentResult>`

The main function that handles the complete purchase flow:

1. **Payment**: Sends SOL to the seller's address
2. **Confirmation**: Waits for transaction confirmation
3. **Order Creation**: Creates an order in the system
4. **Result**: Returns success/failure with details

### `sendSolWithPhantom({ toAddress, amountSol }): Promise<{ signature, confirmation }>`

Handles SOL payment via Phantom wallet:

```typescript
const { signature, confirmation } = await sendSolWithPhantom({
  toAddress: "seller_wallet_address",
  amountSol: 0.5
});
```

### `checkTxStatus(signature: string): Promise<string | null>`

Checks the status of a transaction:

```typescript
const status = await checkTxStatus("transaction_signature");
// Returns: 'processed' | 'confirmed' | 'finalized' | null
```

## Utility Functions

### `formatSOL(lamports: number): string`
Converts lamports to SOL with proper formatting.

### `solToLamports(sol: number): number`
Converts SOL to lamports.

### `isValidSolanaAddress(address: string): boolean`
Validates if a string is a valid Solana address.

## Error Handling

The helper includes comprehensive error handling for:

- **Wallet Connection Issues**: Missing or disconnected wallet
- **Payment Failures**: Insufficient funds, network issues
- **Transaction Failures**: Failed confirmations, invalid transactions
- **API Errors**: Order creation failures, authentication issues

## Integration Examples

### 1. Dataset Card Integration

```tsx
function DatasetCard({ dataset }) {
  const { purchaseDataset, isProcessing } = useDatasetPurchase();
  const { userId, token } = useAuth();

  const handlePurchase = async () => {
    if (!userId || !token) {
      toast.error("Please log in to purchase datasets");
      return;
    }

    const result = await purchaseDataset({
      datasetId: dataset._id,
      sellerAddress: dataset.sellerAddress,
      price: dataset.price,
      buyerId: userId,
      token
    });

    if (result.success) {
      toast.success("Dataset purchased successfully!");
      // Refresh dataset list or redirect
    }
  };

  return (
    <div className="dataset-card">
      <h3>{dataset.title}</h3>
      <p>Price: {dataset.price} SOL</p>
      <button onClick={handlePurchase} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
```

### 2. Dataset Detail Page Integration

```tsx
function DatasetDetailPage({ dataset }) {
  const router = useRouter();
  const { userId, token } = useAuth();

  const handlePurchaseSuccess = (result) => {
    toast.success("Purchase successful!");
    router.push(`/orders/${result.order._id}`);
  };

  const handlePurchaseError = (error) => {
    toast.error(`Purchase failed: ${error}`);
  };

  return (
    <div className="dataset-detail">
      <h1>{dataset.title}</h1>
      <p>{dataset.description}</p>
      
      <div className="purchase-section">
        <DatasetPurchaseButton
          datasetId={dataset._id}
          sellerAddress={dataset.sellerAddress}
          price={dataset.price}
          datasetTitle={dataset.title}
          onPurchaseSuccess={handlePurchaseSuccess}
          onPurchaseError={handlePurchaseError}
          className="mt-6"
        />
      </div>
    </div>
  );
}
```

## Requirements

### Dependencies

Make sure you have these packages installed:

```json
{
  "@solana/web3.js": "^1.87.6",
  "@solana/wallet-adapter-react": "^0.15.35",
  "@solana/wallet-adapter-wallets": "^0.19.32"
}
```

### Environment Setup

The helper uses the Solana devnet by default. To change the network, modify the `clusterApiUrl` calls in the helper functions.

### Wallet Provider Setup

Ensure your app is wrapped with the Solana wallet providers:

```tsx
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

function App() {
  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## Security Considerations

1. **Transaction Validation**: Always verify transaction signatures and confirmations
2. **Address Validation**: Use `isValidSolanaAddress()` to validate addresses
3. **Authentication**: Ensure proper authentication tokens are used
4. **Error Handling**: Never expose sensitive error details to users
5. **Network Security**: Use HTTPS in production environments

## Troubleshooting

### Common Issues

1. **"Phantom wallet not found"**
   - Ensure Phantom wallet is installed
   - Check if the wallet is properly connected

2. **"Insufficient funds"**
   - Check wallet balance
   - Ensure enough SOL for transaction fees

3. **"Transaction failed"**
   - Check network connectivity
   - Verify recipient address is valid
   - Check if transaction was rejected by user

4. **"Order creation failed"**
   - Verify authentication token
   - Check API endpoint availability
   - Ensure dataset ID exists

### Debug Mode

Enable debug logging by adding console.log statements in the helper functions or check the browser's developer console for detailed error messages.

## Contributing

When extending this helper:

1. Maintain TypeScript type safety
2. Add comprehensive error handling
3. Include proper documentation
4. Test with different wallet types
5. Ensure backward compatibility

## License

This helper is part of the KeyNShare project and follows the same licensing terms.
