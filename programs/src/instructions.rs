use anchor_lang::prelude::*;
use crate::state::{TokenAccount, TokenMetadata};

pub fn initialize_token(
    ctx: Context<InitializeToken>,
    metadata: TokenMetadata,
    supply: u64,
) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    token_account.team_name = metadata.team_name;
    token_account.symbol = metadata.symbol;
    token_account.total_supply = supply;
    token_account.circulating_supply = 0;
    token_account.creator = ctx.accounts.user.key();
    token_account.created_at = Clock::get()?.unix_timestamp;
    token_account.price_in_lamports = 1000; // 0.00001 SOL default
    token_account.trading_enabled = false;
    token_account.trading_volume_24h = 0;
    Ok(())
}

pub fn enable_trading(ctx: Context<EnableTrading>) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    require!(
        token_account.creator == ctx.accounts.creator.key(),
        TokenError::Unauthorized
    );
    token_account.trading_enabled = true;
    Ok(())
}

pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    require!(token_account.trading_enabled, TokenError::TradingDisabled);
    
    // Update supply and volume
    token_account.circulating_supply = token_account
        .circulating_supply
        .checked_add(amount)
        .ok_or(TokenError::Overflow)?;
    token_account.trading_volume_24h = token_account
        .trading_volume_24h
        .checked_add(amount)
        .ok_or(TokenError::Overflow)?;
    
    Ok(())
}

pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    require!(token_account.trading_enabled, TokenError::TradingDisabled);
    
    // Update supply
    token_account.circulating_supply = token_account
        .circulating_supply
        .checked_sub(amount)
        .ok_or(TokenError::Overflow)?;
    
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(init, payer = user, space = TokenAccount::SPACE)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EnableTrading<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct SellToken<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
}

#[error_code]
pub enum TokenError {
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Trading is disabled for this token")]
    TradingDisabled,
    #[msg("Arithmetic overflow")]
    Overflow,
}
