use anchor_lang::prelude::*;

declare_id!("DPLTAXALPu5PRrWbwB3fYmPjq4o3vBYHm1vRRVJZY7rw");

#[program]
pub mod dataset_catalogue {
    use super::*;

    // This is the primary function your Node.js server will call to add a new dataset.
    pub fn add_dataset(
        ctx: Context<AddDataset>,
        title: String,
        price: u64, // Corresponds to 'price' in your schema
        data_cid: String, // Corresponds to 'dataCID'
        original_content_hash: String, // Corresponds to 'originalContentHash'
        description: String, // Corresponds to 'description'
        file_size: String, // Corresponds to 'fileSize'
    ) -> Result<()> {
        // Get a mutable reference to the newly created dataset account
        let dataset_account = &mut ctx.accounts.dataset;

        // --- Assigning data to the on-chain account ---
        // The 'authority' is the public key of the account that signed the transaction.
        // This corresponds to 'sellerAddress' in your schema.
        dataset_account.authority = *ctx.accounts.authority.key;
        dataset_account.title = title;
        // We store price in lamports. Your backend should convert the price to lamports before sending.
        dataset_account.price = price;
        dataset_account.data_cid = data_cid;
        dataset_account.original_content_hash = original_content_hash;
        dataset_account.description = description;
        dataset_account.file_size = file_size;
        // Add a timestamp for when the data was written to the blockchain.
        dataset_account.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

// This defines the structure of the data that will be stored on the blockchain.
// It's the on-chain equivalent of your Mongoose schema.
#[account]
pub struct Dataset {
    // --- On-Chain Fields ---
    pub authority: Pubkey,               // The seller's wallet address.
    pub timestamp: i64,                  // Unix timestamp of when the dataset was added.
    pub title: String,
    pub price: u64,                      // Price in lamports (the smallest unit of SOL).
    pub data_cid: String,
    pub original_content_hash: String,
    pub description: String,
    pub file_size: String,                  // File size in bytes.
}

// This struct defines all the accounts that are required by our `add_dataset` function.
// Anchor uses this to ensure the transaction is secure and has all the necessary inputs.
#[derive(Accounts)]
pub struct AddDataset<'info> {
    // This instruction will initialize a new account, owned by the program.
    #[account(
        init,
        payer = authority, // The 'authority' account will pay for the account's creation.
        space = 8 + 32 + 8 + (4 + 256) + 8 + (4 + 256) + (4 + 256) + (4 + 1024) + 8
    )]
    pub dataset: Account<'info, Dataset>,

    // The user who is creating the dataset. They must sign the transaction.
    #[account(mut)]
    pub authority: Signer<'info>,

    // The Solana System Program, required by Anchor to create new accounts.
    pub system_program: Program<'info, System>,
}