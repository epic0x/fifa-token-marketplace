import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from "@solana/web3.js";

export interface BuyTokenTxParams {
  tokenMint: string;
  amount: number; // in smallest unit (lamports equivalent)
  slippagePercent: number; // default 2
}

export interface SellTokenTxParams {
  tokenMint: string;
  amount: number;
  slippagePercent: number;
}

// Placeholder program ID (would be replaced with real deployed program)
const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

/**
 * Derives a PDA for a token account
 * Format: [token_mint, user_wallet, "token_account"]
 */
function deriveTokenAccountPDA(
  tokenMint: PublicKey,
  userWallet: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [tokenMint.toBuffer(), userWallet.toBuffer(), Buffer.from("token_account")],
    PROGRAM_ID
  );
}

/**
 * Derives a PDA for token metadata
 * Format: [token_mint, "metadata"]
 */
function deriveMetadataPDA(tokenMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [tokenMint.toBuffer(), Buffer.from("metadata")],
    PROGRAM_ID
  );
}

/**
 * Constructs a buy transaction instruction
 * 
 * Accounts needed:
 * - user (signer): the user initiating the buy
 * - user_token_account: destination token account
 * - token_metadata: token info PDA
 * - program: our Solana program
 * - system_program: for account creation if needed
 */
export async function buildBuyTransaction(
  connection: Connection,
  wallet: any, // { publicKey: PublicKey }
  params: BuyTokenTxParams
): Promise<Transaction | null> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    const userWallet = wallet.publicKey;
    const tokenMint = new PublicKey(params.tokenMint);
    const amount = BigInt(params.amount);
    const slippage = Math.floor(params.slippagePercent * 100); // Convert to basis points

    // Derive PDAs
    const [tokenAccountPDA] = deriveTokenAccountPDA(tokenMint, userWallet);
    const [metadataPDA] = deriveMetadataPDA(tokenMint);

    // Construct instruction data
    // Layout: [instruction_type (1), amount (8), slippage (4)]
    const instructionData = Buffer.alloc(1 + 8 + 4);
    instructionData.writeUInt8(0, 0); // 0 = BUY instruction
    instructionData.writeBigUInt64LE(amount, 1); // amount in LE
    instructionData.writeUInt32LE(slippage, 9); // slippage in basis points

    // Create instruction
    const buyInstruction = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: userWallet, isSigner: true, isWritable: true },
        { pubkey: tokenAccountPDA, isSigner: false, isWritable: true },
        { pubkey: metadataPDA, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    // Create transaction
    const tx = new Transaction();
    tx.add(buyInstruction);

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userWallet;

    console.log(`Built BUY transaction for token: ${params.tokenMint}, amount: ${params.amount}`);
    return tx;
  } catch (error) {
    console.error("Error building buy transaction:", error);
    throw error;
  }
}

/**
 * Constructs a sell transaction instruction
 * Similar structure to buy, but with instruction type 1 for SELL
 */
export async function buildSellTransaction(
  connection: Connection,
  wallet: any,
  params: SellTokenTxParams
): Promise<Transaction | null> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    const userWallet = wallet.publicKey;
    const tokenMint = new PublicKey(params.tokenMint);
    const amount = BigInt(params.amount);
    const slippage = Math.floor(params.slippagePercent * 100);

    // Derive PDAs
    const [tokenAccountPDA] = deriveTokenAccountPDA(tokenMint, userWallet);
    const [metadataPDA] = deriveMetadataPDA(tokenMint);

    // Construct instruction data
    // Layout: [instruction_type (1), amount (8), slippage (4)]
    const instructionData = Buffer.alloc(1 + 8 + 4);
    instructionData.writeUInt8(1, 0); // 1 = SELL instruction
    instructionData.writeBigUInt64LE(amount, 1);
    instructionData.writeUInt32LE(slippage, 9);

    // Create instruction
    const sellInstruction = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: userWallet, isSigner: true, isWritable: true },
        { pubkey: tokenAccountPDA, isSigner: false, isWritable: true },
        { pubkey: metadataPDA, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    // Create transaction
    const tx = new Transaction();
    tx.add(sellInstruction);

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userWallet;

    console.log(`Built SELL transaction for token: ${params.tokenMint}, amount: ${params.amount}`);
    return tx;
  } catch (error) {
    console.error("Error building sell transaction:", error);
    throw error;
  }
}

/**
 * Submits a signed transaction to the blockchain
 */
export async function submitTransaction(
  connection: Connection,
  signedTx: Transaction
): Promise<string> {
  try {
    const rawTx = signedTx.serialize();
    const txId = await connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: "processed",
    });
    console.log(`Transaction submitted: ${txId}`);
    return txId;
  } catch (error) {
    console.error("Transaction submission error:", error);
    throw error;
  }
}
