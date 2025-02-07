'use server'
import {cookies} from "next/headers";
import {decodeJWT} from "thirdweb/utils";

export default async function authAddress() {
    const cookie = cookies();
    const jwt = cookie.get('jwt')?.value;

    if(!jwt) {
        return null
    }

    const { payload } = decodeJWT(jwt);

    const {sub: authAddress} = payload;
    
    return authAddress
}