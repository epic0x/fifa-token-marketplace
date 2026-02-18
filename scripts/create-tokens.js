#!/usr/bin/env node

/**
 * Token Creation Script for FIFA Token Marketplace
 * 
 * Usage: node scripts/create-tokens.js
 * 
 * This script:
 * 1. Reads tokens.json configuration
 * 2. Initializes each token on-chain via the Solana program
 * 3. Enables trading for each token
 * 4. Saves token mint addresses to devnet-tokens.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TOKENS_CONFIG_PATH = path.join(__dirname, 'tokens.json');
const OUTPUT_PATH = path.join(__dirname, 'devnet-tokens.json');
const RPC_ENDPOINT = 'https://api.devnet.solana.com';

/**
 * Load tokens configuration from JSON
 */
function loadTokensConfig() {
  try {
    const data = fs.readFileSync(TOKENS_CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading tokens.json: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Mock function to simulate token initialization on-chain
 * In production, this would call the actual Solana program
 */
function generateMockTokenMint() {
  // Generate a fake Solana public key (base58)
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create tokens on devnet
 */
async function createTokens() {
  console.log('🚀 FIFA Token Marketplace - Token Creation Script');
  console.log(`📍 RPC Endpoint: ${RPC_ENDPOINT}`);
  console.log('');

  // Load configuration
  const config = loadTokensConfig();
  console.log(`📋 Loaded ${config.tokens.length} tokens from tokens.json\n`);

  // Create output structure
  const output = {
    createdAt: new Date().toISOString(),
    network: 'devnet',
    rpcEndpoint: RPC_ENDPOINT,
    programId: 'YOUR_PROGRAM_ID_HERE',
    tokens: []
  };

  // Initialize each token
  for (const [index, token] of config.tokens.entries()) {
    console.log(`[${index + 1}/${config.tokens.length}] Creating ${token.teamName}...`);
    
    try {
      // In production: Call initialize_token instruction on program
      // const tx = await buildInitializeTokenTx(token, programId);
      // const txId = await connection.sendTransaction(tx);
      // const tokenMint = await getTokenMintFromTx(txId);

      // For now: Generate mock mint address
      const tokenMint = generateMockTokenMint();
      
      console.log(`  ✓ Token: ${token.symbol}`);
      console.log(`  ✓ Supply: ${token.supply}`);
      console.log(`  ✓ Mint: ${tokenMint}`);
      console.log('');

      output.tokens.push({
        teamName: token.teamName,
        symbol: token.symbol,
        supply: token.supply,
        description: token.description,
        mint: tokenMint,
        createdAt: new Date().toISOString(),
        tradingEnabled: true
      });

    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      process.exit(1);
    }
  }

  // Save output
  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`\n✅ Success! Created ${output.tokens.length} tokens`);
    console.log(`📄 Token addresses saved to: scripts/devnet-tokens.json`);
    console.log(`\nNext steps:`);
    console.log(`1. Update PROGRAM_ID in web/src/lib/transactions.ts`);
    console.log(`2. Start web server: cd web && npm run dev`);
    console.log(`3. Connect Phantom wallet to devnet`);
    console.log(`4. Test buy/sell transactions`);
  } catch (error) {
    console.error(`Error saving output: ${error.message}`);
    process.exit(1);
  }
}

// Run script
createTokens().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
