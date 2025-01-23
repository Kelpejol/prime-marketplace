import { defineChain } from "thirdweb"


export const contractAddress = "0xa87dC5f619b2DD0Ba5C141Cf3BC755A401A49DFC"
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const chain = defineChain({
    id: 80002,
    rpc: "https://polygon-amoy.g.alchemy.com/v2/kV6-8vz7b-UQ6napo-ITIVWb5KfmRE-s",
    nativeCurrency: {
        name: "Polygon Amoy",
        symbol: "POL",
        decimals: 18,
    },
})