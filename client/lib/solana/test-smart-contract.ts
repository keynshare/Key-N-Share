// Test file for smart contract integration
// This file can be used to test the smart contract functionality

import { validateDatasetMetadata, DatasetMetadata } from './DatasetSmartContractHelper';

// Test validation function
export function testValidation() {
  console.log("Testing dataset metadata validation...");
  
  // Valid metadata
  const validMetadata: DatasetMetadata = {
    title: "Test Dataset",
    price: 0.1,
    dataCid: "QmTestCID123",
    originalContentHash: "abc123hash",
    description: "This is a test dataset",
    fileSize: 1024
  };
  
  const validErrors = validateDatasetMetadata(validMetadata);
  console.log("Valid metadata errors:", validErrors);
  
  // Invalid metadata
  const invalidMetadata: DatasetMetadata = {
    title: "",
    price: -1,
    dataCid: "",
    originalContentHash: "",
    description: "",
    fileSize: 0
  };
  
  const invalidErrors = validateDatasetMetadata(invalidMetadata);
  console.log("Invalid metadata errors:", invalidErrors);
}

// Test data for development
export const testDatasetMetadata: DatasetMetadata = {
  title: "Sample AI Training Dataset",
  price: 0.05, // 0.05 SOL
  dataCid: "QmSampleCID123456789",
  originalContentHash: "sha256:abcdef123456789",
  description: "A comprehensive dataset for machine learning training with labeled examples",
  fileSize: 1048576 // 1MB
};

console.log("Smart contract test utilities loaded");
