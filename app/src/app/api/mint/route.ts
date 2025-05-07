import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import { createMint, mintTo } from '@lightprotocol/compressed-token';
import { connection } from '@/lib/lightConnection';
import bs58 from 'bs58';
import { NFTData } from '@/lib/types';
import { createV1, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { percentAmount, keypairIdentity, publicKey, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// Load your backend keypair securely (for demo, generate a new one each time)
// In production, load from env or secure storage
const payerSecretKey = process.env.PAYER_SECRET_KEY;

if (!payerSecretKey) {
    throw new Error('PAYER_SECRET_KEY is not set');
}
const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKey));

// Setup Umi
const umi = createUmi(connection).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(payer.secretKey);
const umiSigner = createSignerFromKeypair(umi, umiKeypair);
umi.use(keypairIdentity(umiSigner));

export async function POST(req: NextRequest) {
    console.log('POST /api/mint called');
    try {
        const body = await req.json();

        const { metadata } = body as { recipient: string; metadata: NFTData };
        console.log('Request body metadata:', metadata);
        if (!metadata) {
            console.error('Missing metadata');
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }
        const recipientPubkey = payer.publicKey;
        console.log('Recipient PublicKey:', recipientPubkey.toBase58());

        // Create compressed token mint
        const { mint, transactionSignature } = await createMint(
            connection,
            payer,
            payer.publicKey, // mint authority
            9
        );
        console.log('Created mint:', mint.toBase58(), 'Transaction signature:', transactionSignature);

        // Mint tokens to recipient
        const mintToResult = await mintTo(connection, payer, mint, recipientPubkey, payer, 1e9);
        console.log('Minted tokens to recipient. Result:', mintToResult);

        const { name, symbol, image, link } = metadata;
        // For demo, use image as uri. In production, upload metadata to Arweave/IPFS and use that uri.
        const uri = image || link;

        const createV1Ix = createV1(umi, {
            mint: publicKey(mint.toBase58()),
            authority: umiSigner,
            name: name,
            symbol: symbol,
            uri: uri,
            sellerFeeBasisPoints: percentAmount(0),
            tokenStandard: TokenStandard.Fungible,
        });
        console.log('Create V1 instruction:', createV1Ix);

        const nftResult = await createV1Ix.sendAndConfirm(umi);

        console.log('NFT created:', nftResult);

        return NextResponse.json({
            mintAddress: mint.toBase58(),
            tx: transactionSignature,
            metadataAddress: nftResult.result.value,
        });
    } catch (e: unknown) {
        let errorMessage = 'Unknown error';
        if (e instanceof Error) {
            errorMessage = e.message;
        } else if (typeof e === 'string') {
            errorMessage = e;
        }
        console.error('Error in /api/mint:', e);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}