"use server"

import { GenerateLoginPayloadParams, VerifyLoginPayloadParams } from "thirdweb/auth";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import { createAuth } from 'thirdweb/auth';
import { client } from '../client';
import { generateAccount, privateKeyToAccount } from "thirdweb/wallets";

const privateKey = process.env.PRIVATE_KEY!;
// const account =  generateAccount({ client });

 const auth = createAuth({
  domain: process.env.AUTH_DOMAIN || 'localhost:3000',
  client,
  jwt: {
    expirationTimeSeconds: 60 * 60 * 24 * 7,
  },
  login: {
    statement: `Welcome to ${process.env.AUTH_DOMAIN || 'localhost:3000'}!, Sign the message to login.`,

  },
   adminAccount: privateKeyToAccount({ client, privateKey })
    
}) 


export async function generatePayload(options: GenerateLoginPayloadParams) {
  return auth.generatePayload(options);
}

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await auth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await auth.generateJWT({
      payload: verifiedPayload.payload,
    });
     cookies().set("jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
     });
  }
}

export async function isLoggedIn(address: string) {
  try{
  // if no address is passed then return false
  if (!address) {
    return false;
  }
  const jwt =  cookies().get("jwt");
  // if no jwt is found then return false
  if (!jwt?.value) {
    return false;
  }

  const authResult = await auth.verifyJWT({ jwt: jwt.value });
  // if the JWT is not valid then return false
  if (!authResult.valid) {
    return false;
  }
  // if the address in the JWT does not match the address we are checking for then return false
  if (getAddress(authResult.parsedJWT.sub) !== getAddress(address)) {
    return false;
  }
  // we are logged in
  return true;
}catch(error) {
  console.error(error)
}
}

export async function getAuthResult(jwtValue: string) {
  try{
  const authResult = await auth.verifyJWT({ jwt: jwtValue });
  if (!authResult.valid) {
    return {
      valid: false,
      parsedJWT: null
    }
  }
  return authResult;
} catch(error){
  console.error(error)
  return {
    valid: false,
    parsedJWT: null
  }
}
}
