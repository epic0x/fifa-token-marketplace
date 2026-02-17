use anchor_lang::prelude::*;

#[account]
pub struct TokenAccount {
    pub team_name: String,
    pub symbol: String,
    pub total_supply: u64,
    pub circulating_supply: u64,
    pub creator: Pubkey,
    pub created_at: i64,
    pub price_in_lamports: u64,
    pub trading_enabled: bool,
    pub trading_volume_24h: u64,
}

impl TokenAccount {
    pub const SPACE: usize = 8 + // discriminator
        32 + // creator pubkey
        8 +  // timestamps
        8 +  // supply values (2x)
        8 +  // price
        8 +  // volume
        1 +  // bool
        (4 + 50) + // team name (string)
        (4 + 10);  // symbol (string)
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct TokenMetadata {
    pub team_name: String,
    pub symbol: String,
    pub description: String,
    pub image_uri: String,
}
