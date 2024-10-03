import * as anchor from "@coral-xyz/anchor";
import { BN } from "bn.js";

export const ZERO_BN = new anchor.BN(0);

export const ONE_SOL = 1000000000;

export const MAX_U64 = new BN(new anchor.BN(2).pow(new anchor.BN(64)).sub(new anchor.BN(1)).toString());

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));