Write-Host "Installing Blockchain Integration Dependencies..." -ForegroundColor Green
Write-Host ""

Set-Location client

Write-Host "Installing Anchor dependency..." -ForegroundColor Yellow
pnpm install @coral-xyz/anchor@^0.30.1

Write-Host ""
Write-Host "Checking if all Solana dependencies are installed..." -ForegroundColor Yellow
pnpm list @solana/web3.js
pnpm list @solana/wallet-adapter-react
pnpm list @solana/wallet-adapter-react-ui
pnpm list @solana/wallet-adapter-wallets

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure you have Phantom wallet installed" -ForegroundColor White
Write-Host "2. Get devnet SOL from https://faucet.solana.com/" -ForegroundColor White
Write-Host "3. Test the integration by uploading a dataset" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
