"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { countries, getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { v4 } from "uuid";
import { ethers } from "ethers";
import { createPublicClient, hexToString, http } from "viem";
import { celoAlfajores } from "viem/chains";
import ProofOfHuman from "../src/lib/ProofOfHumanAbi";
import { randomBytes } from "crypto";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/mock")
  }, [])



  return (
    <div>loading...</div>
  );
}
