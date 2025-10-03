@echo off
echo Installing Blockchain Integration Dependencies...
echo.

cd client
echo Installing Anchor dependency...
pnpm install @coral-xyz/anchor@^0.30.1

echo.
echo Checking if all Solana dependencies are installed...
pnpm list @solana/web3.js
pnpm list @solana/wallet-adapter-react
pnpm list @solana/wallet-adapter-react-ui
pnpm list @solana/wallet-adapter-wallets

echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Ensure you have Phantom wallet installed
echo 2. Get devnet SOL from https://faucet.solana.com/
echo 3. Test the integration by uploading a dataset
echo.
pause
