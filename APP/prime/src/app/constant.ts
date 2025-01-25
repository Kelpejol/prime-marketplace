import { polygonAmoy, defineChain } from "thirdweb/chains"


export const contractAddress = "0xa87dC5f619b2DD0Ba5C141Cf3BC755A401A49DFC"
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const chain = defineChain({
    id: 80002,
    rpc: "https://80002.rpc.thirdweb.com/58a7d62bc7f887ff410f6767efc912a1"
});