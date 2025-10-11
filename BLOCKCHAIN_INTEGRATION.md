# Blockchain Integration for Dataset Metadata

This document describes the integration of smart contract functionality for storing dataset metadata on the Solana blockchain.

## Overview

The system now integrates with a Solana smart contract to store dataset metadata on-chain while maintaining off-chain data in MongoDB for search and display purposes.

## Architecture

### Smart Contract (Rust/Anchor)
- **Location**: `dataset_metadata/programs/dataset_metadata/src/lib.rs`
- **Program ID**: `DPLTAXALPu5PRrWbwB3fYmPjq4o3vBYHm1vRRVJZY7rw`
- **Network**: Solana Devnet

### Frontend Integration
- **Helper**: `client/lib/solana/DatasetSmartContractHelper.ts`
- **IDL**: `client/lib/solana/dataset_catalogue_idl.json`
- **Upload Component**: `client/components/DatasetUploadPage/UploadDataset.tsx`

### Backend Updates
- **Model**: `server/src/models/DatasetCatalogue.js` - Added blockchain fields
- **Controller**: `server/src/controllers/datasetCatalgoueController.js` - Handles blockchain data

## Upload Flow

The dataset upload process now includes blockchain integration:

1. **Encrypt File** - File is encrypted with AES-256
2. **Generate Hash** - SHA-256 hash of original file
3. **Upload to IPFS** - Encrypted file uploaded to IPFS
4. **Add to Blockchain** ⭐ **NEW** - Metadata stored on Solana
5. **Add to Catalogue** - Full dataset info stored in MongoDB

## Smart Contract Data Structure

```rust
pub struct Dataset {
    pub authority: Pubkey,               // Seller's wallet address
    pub timestamp: i64,                  // Unix timestamp
    pub title: String,                   // Dataset title (max 256 chars)
    pub price: u64,                      // Price in lamports
    pub data_cid: String,               // IPFS CID (max 256 chars)
    pub original_content_hash: String,   // SHA-256 hash (max 256 chars)
    pub description: String,             // Description (max 1024 chars)
    pub file_size: String,                 // File size in bytes
}
```

## Database Schema Updates

Added blockchain fields to MongoDB:

```javascript
// New fields in DatasetCatalogue schema
blockchainTxSignature: {
    type: String,
    trim: true
},
blockchainAccount: {
    type: String,
    trim: true
}
```

## Frontend Integration

### Smart Contract Hook

```typescript
const { addDataset: addToBlockchain, isWalletConnected } = useDatasetSmartContract();
```

### Usage in Upload Component

```typescript
// Validate metadata
const validationErrors = validateDatasetMetadata(blockchainMetadata);

// Add to blockchain
const blockchainResult = await addToBlockchain(blockchainMetadata);

// Include blockchain data in catalogue
const catalogueData = {
    // ... other fields
    blockchainTxSignature: blockchainResult.signature,
    blockchainAccount: blockchainResult.datasetAccount?.toString()
};
```

## Dependencies

### Frontend
- `@coral-xyz/anchor`: ^0.30.1 (Solana program interaction)
- `@solana/web3.js`: ^1.98.4 (Solana blockchain interaction)
- `@solana/wallet-adapter-react`: ^0.15.39 (Wallet integration)

### Smart Contract
- `anchor-lang`: Latest (Solana program framework)

## Setup Instructions

### 1. Install Dependencies

```bash
cd client
pnpm install @coral-xyz/anchor@^0.30.1
```

### 2. Build Smart Contract (if needed)

```bash
cd dataset_metadata
anchor build
```

### 3. Deploy Smart Contract (if needed)

```bash
anchor deploy --provider.cluster devnet
```

### 4. Update Program ID

If you deploy a new contract, update the program ID in:
- `client/lib/solana/DatasetSmartContractHelper.ts`
- `client/lib/solana/dataset_catalogue_idl.json`

## Error Handling

The integration includes comprehensive error handling:

1. **Wallet Connection**: Validates wallet is connected
2. **Metadata Validation**: Validates all required fields and constraints
3. **Blockchain Errors**: Catches and reports smart contract errors
4. **Fallback**: If blockchain fails, the upload process stops (no partial uploads)

## Testing

### Validation Testing

```typescript
import { testValidation } from './lib/solana/test-smart-contract';
testValidation(); // Run validation tests
```

### Manual Testing

1. Connect Solana wallet (Phantom recommended)
2. Ensure wallet has devnet SOL
3. Upload a dataset through the UI
4. Verify blockchain transaction on Solana Explorer
5. Check MongoDB for blockchain fields

## Security Considerations

1. **Wallet Security**: Users must approve all transactions
2. **Data Validation**: All metadata is validated before blockchain submission
3. **Error Recovery**: Failed blockchain transactions don't create partial database entries
4. **Network**: Currently uses Solana Devnet (not mainnet)

## Troubleshooting

### Common Issues

1. **Wallet Not Connected**: Ensure Phantom wallet is installed and connected
2. **Insufficient SOL**: Ensure wallet has devnet SOL for transaction fees
3. **Network Issues**: Check Solana devnet status
4. **Validation Errors**: Check console for specific validation failures

### Debug Mode

Enable debug logging in browser console to see detailed blockchain interaction logs.

## Future Enhancements

1. **Mainnet Deployment**: Move to Solana mainnet for production
2. **Additional Metadata**: Store more dataset attributes on-chain
3. **Query Functions**: Add smart contract functions to query datasets
4. **Batch Operations**: Support bulk dataset operations
5. **Governance**: Add DAO governance for dataset validation

## Support

For issues related to blockchain integration:
1. Check browser console for error messages
2. Verify wallet connection and SOL balance
3. Test on Solana devnet explorer
4. Review smart contract logs
