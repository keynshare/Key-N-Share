# KeyNShare Client

<div align="center">
  <img src="./public/DarkLogo.svg" alt="KeyNShare Logo" width="200" />
  <h3>Secure Dataset Marketplace with Blockchain Integration</h3>
</div>

## Overview

KeyNShare is a secure dataset marketplace platform that leverages blockchain technology for transparent and secure data transactions. This client application is built with Next.js and provides a comprehensive interface for users to buy, sell, and manage datasets.

## Features

- **User Authentication** - Secure login and registration system
- **Dataset Marketplace** - Browse, search, and purchase datasets
- **Dataset Upload** - Upload and sell your own datasets
- **Encryption/Decryption** - Secure dataset access with encryption
- **Blockchain Integration** - Solana-based transactions for dataset purchases
- **User Profiles** - Manage your profile, datasets, and transactions
- **Cart System** - Add datasets to cart before purchase
- **Favorites** - Save datasets for later viewing
- **Order Management** - Track your purchases and sales
- **KNS Ledger** - View your transaction history on the blockchain
- **Nexus** - Community and networking features

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context API
- **Authentication**: JWT-based authentication
- **Blockchain**: Solana integration

## Project Structure

```
client/
├── app/                  # Next.js App Router pages
│   ├── about/            # About page
│   ├── authentication/   # Login/Register pages
│   ├── cart/             # Shopping cart
│   ├── catalogue/        # Dataset browsing
│   ├── dashboard/        # User dashboard
│   ├── decrypt-dataset/  # Dataset decryption
│   ├── favourite-datasets/ # Saved datasets
│   ├── generate-key/     # Encryption key generation
│   ├── kns-ledger/       # Blockchain transaction history
│   ├── nexus/            # Community features
│   ├── orders/           # Order management
│   ├── profile/          # User profiles
│   ├── purchase-requests/ # Purchase request management
│   ├── specific-dataset/ # Dataset details
│   └── upload-dataset/   # Dataset upload
├── components/           # Reusable UI components
├── lib/                  # Utility functions and hooks
│   ├── Authentication/   # Auth-related utilities
│   ├── api/              # API client functions
│   ├── solana/           # Blockchain integration
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- Solana CLI tools (for blockchain features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/KeyNShare.git
   cd KeyNShare/client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the client directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

### Code Structure

- **Pages**: Located in the `app` directory following Next.js App Router conventions
- **Components**: Reusable UI components in the `components` directory
- **API Integration**: API calls are centralized in `lib/api`
- **Authentication**: Auth logic is in `lib/Authentication`
- **Blockchain**: Solana integration is in `lib/solana`

### Key Workflows

1. **Dataset Purchase Flow**:
   - Browse catalogue → View dataset details → Add to cart → Checkout → Process payment → Access dataset

2. **Dataset Upload Flow**:
   - Create dataset → Upload files → Set metadata → Encrypt → Publish to marketplace

3. **Authentication Flow**:
   - Register/Login → JWT stored → Protected routes accessible

## API Integration

The client communicates with the server API for all data operations. See the [API Documentation](../server/API_DOCUMENTATION.md) for details on available endpoints.

## Deployment

The application can be deployed using Vercel:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

For production deployment:

1. Push to your GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Solana Documentation](https://docs.solana.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
