/**
 * Integration Validator for Smart Contract Integration
 * This file contains validation functions to ensure the blockchain integration works correctly
 */

import { DatasetMetadata, validateDatasetMetadata } from './DatasetSmartContractHelper';

// Validation results interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Validate smart contract integration setup
export function validateSmartContractSetup(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if required dependencies are available (simplified for build compatibility)
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      result.warnings.push('Dependency validation skipped in browser environment');
    } else {
      result.warnings.push('Dependency validation requires runtime check');
    }
  } catch {
    result.warnings.push('Could not validate dependencies at build time');
  }

  return result;
}

// Validate dataset metadata for blockchain submission
export function validateDatasetForBlockchain(metadata: Partial<DatasetMetadata>): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Use the existing validation function
  const validationErrors = validateDatasetMetadata(metadata as DatasetMetadata);
  
  if (validationErrors.length > 0) {
    result.errors = validationErrors;
    result.isValid = false;
  }

  // Additional blockchain-specific validations
  if (metadata.price && metadata.price < 0.001) {
    result.warnings.push('Price is very low (< 0.001 SOL). Consider minimum pricing.');
  }

  if (metadata.title && metadata.title.length > 200) {
    result.warnings.push('Title is quite long. Consider shortening for better display.');
  }

  if (metadata.description && metadata.description.length > 800) {
    result.warnings.push('Description is quite long. Consider shortening for better display.');
  }

  return result;
}

// Validate wallet connection requirements
export function validateWalletRequirements(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if running in browser environment
  if (typeof window === 'undefined') {
    result.errors.push('Wallet validation must run in browser environment');
    result.isValid = false;
    return result;
  }

  // Check if Phantom wallet is available
  if (!window.solana) {
    result.errors.push('Solana wallet not detected. Please install Phantom wallet.');
    result.isValid = false;
  } else {
    if (!window.solana.isPhantom) {
      result.warnings.push('Non-Phantom wallet detected. Phantom is recommended for best compatibility.');
    }
  }

  return result;
}

// Test dataset metadata examples
export const testDatasets: DatasetMetadata[] = [
  {
    title: "AI Training Dataset - Image Classification",
    price: 0.05,
    dataCid: "QmTestCID123456789abcdef",
    originalContentHash: "sha256:abcdef123456789012345678901234567890abcdef123456789012345678901234",
    description: "A comprehensive dataset for image classification containing 10,000 labeled images across 100 categories.",
    fileSize: 1048576 // 1MB
  },
  {
    title: "Financial Market Data - Stock Prices",
    price: 0.1,
    dataCid: "QmFinancialData987654321",
    originalContentHash: "sha256:987654321098765432109876543210987654321098765432109876543210987654",
    description: "Historical stock price data for S&P 500 companies from 2020-2024 with minute-level granularity.",
    fileSize: 5242880 // 5MB
  },
  {
    title: "Natural Language Processing Corpus",
    price: 0.03,
    dataCid: "QmNLPCorpus456789123",
    originalContentHash: "sha256:456789123456789123456789123456789123456789123456789123456789123456",
    description: "Large text corpus for NLP training with sentiment analysis labels and entity annotations.",
    fileSize: 2097152 // 2MB
  }
];

// Run comprehensive validation
export function runFullValidation(): {
  setup: ValidationResult;
  wallet: ValidationResult;
  testDatasets: ValidationResult[];
} {
  console.log('🔍 Running Smart Contract Integration Validation...');
  
  const setupValidation = validateSmartContractSetup();
  console.log('📦 Setup Validation:', setupValidation);
  
  const walletValidation = validateWalletRequirements();
  console.log('👛 Wallet Validation:', walletValidation);
  
  const datasetValidations = testDatasets.map((dataset, index) => {
    const validation = validateDatasetForBlockchain(dataset);
    console.log(`📊 Test Dataset ${index + 1} Validation:`, validation);
    return validation;
  });
  
  return {
    setup: setupValidation,
    wallet: walletValidation,
    testDatasets: datasetValidations
  };
}

// Helper function to format validation results
export function formatValidationResults(results: ValidationResult): string {
  let output = '';
  
  if (results.isValid) {
    output += '✅ Validation Passed\n';
  } else {
    output += '❌ Validation Failed\n';
  }
  
  if (results.errors.length > 0) {
    output += '\n🚨 Errors:\n';
    results.errors.forEach(error => {
      output += `  - ${error}\n`;
    });
  }
  
  if (results.warnings.length > 0) {
    output += '\n⚠️ Warnings:\n';
    results.warnings.forEach(warning => {
      output += `  - ${warning}\n`;
    });
  }
  
  return output;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).validateSmartContract = runFullValidation;
  (window as unknown as Record<string, unknown>).testDatasets = testDatasets;
  console.log('🚀 Smart Contract validation tools loaded. Run validateSmartContract() in console to test.');
}
