import { createRpc } from "@lightprotocol/stateless.js";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_HELIUS_RPC_URL!;
const PHOTON_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = RPC_ENDPOINT;

export const connection = createRpc(RPC_ENDPOINT, PHOTON_ENDPOINT, PROVER_ENDPOINT); 