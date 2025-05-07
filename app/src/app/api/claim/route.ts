// src/app/api/claim/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Keypair, PublicKey } from '@solana/web3.js';
import { transfer } from '@lightprotocol/compressed-token';
import { connection } from '@/lib/lightConnection';
import bs58 from 'bs58';
import { getMint } from '@solana/spl-token';
const payerSecretKey = process.env.PAYER_SECRET_KEY;
if (!payerSecretKey) throw new Error('PAYER_SECRET_KEY is not set');
const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKey));

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request to /api/claim');
    const { mintAddress, recipient } = await req.json();
    console.log('Parsed body:', { mintAddress, recipient });
    if (!mintAddress || !recipient) {
      console.error('Missing mintAddress or recipient', { mintAddress, recipient });
      return NextResponse.json({ error: 'Missing mintAddress or recipient' }, { status: 400 });
    }
    const mint = new PublicKey(mintAddress);
    const recipientPubkey = new PublicKey(recipient);
    console.log('Mint PublicKey:', mint.toBase58());
    console.log('Recipient PublicKey:', recipientPubkey.toBase58());

    // Fetch mint info to get decimals
    const mintInfo = await getMint(connection, mint);
    const decimals = mintInfo.decimals;
    console.log('Mint decimals:', decimals);

    // Transfer exactly 1 token (using correct decimals)
    const amount = 1 * 10 ** decimals;
    console.log('Initiating transfer of', amount, 'base units' , 'from', payer.publicKey.toBase58(), 'to', recipientPubkey.toBase58());
    const txId = await transfer(
      connection,
      payer,
      mint,
      amount,
      payer,
      recipientPubkey
    );
    console.log('Transfer successful, txId:', txId);

    return NextResponse.json({ tx: txId });
  } catch (e: any) {
    console.error('Error in /api/claim POST:', e);
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
}