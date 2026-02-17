use anchor_lang::prelude::*;

mod state;
mod instructions;

pub use state::*;
pub use instructions::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod fifa_token {
    use super::*;

    pub fn initialize_token(
        ctx: Context<InitializeToken>,
        metadata: TokenMetadata,
        supply: u64,
    ) -> Result<()> {
        instructions::initialize_token(ctx, metadata, supply)
    }

    pub fn enable_trading(ctx: Context<EnableTrading>) -> Result<()> {
        instructions::enable_trading(ctx)
    }

    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        instructions::buy_token(ctx, amount)
    }

    pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
        instructions::sell_token(ctx, amount)
    }
}
