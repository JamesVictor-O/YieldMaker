import { createPublicClient, http, getAddress, keccak256, toHex, zeroHash, pad } from "viem";
import { celoAlfajores } from "viem/chains";

const ADDRESS = getAddress(process.env.CONTRACT || "0x6574F3dea1EB56b9F2e752cB93b7Cc8739176cd5");

const abi = [
  { name: "verificationConfigId", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "bytes32" }] },
  { name: "scope", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getConfigId", type: "function", stateMutability: "view", inputs: [
      { name: "_destinationChainId", type: "bytes32" },
      { name: "_userIdentifier", type: "bytes32" },
      { name: "_userDefinedData", type: "bytes" },
    ], outputs: [{ type: "bytes32" }] },
];

const client = createPublicClient({ chain: celoAlfajores, transport: http() });

const expectedConfig = "0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61";
const expectedScopeBytes32 = keccak256(toHex("YieldMaker"));
const expectedScopeUint = BigInt(expectedScopeBytes32);

const read = (fn, args=[]) => client.readContract({ address: ADDRESS, abi, functionName: fn, args });

const main = async () => {
  try {
    const configId = await read("verificationConfigId");
    console.log("configId:", configId);
    console.log("config_ok:", configId.toLowerCase() === expectedConfig.toLowerCase());
  } catch (e) {
    console.log("configId read failed:", e?.shortMessage || e?.message);
  }
  try {
    const derived = await read("getConfigId", [zeroHash, zeroHash, "0x"]);
    console.log("getConfigId(zeros):", derived);
  } catch (e) {
    console.log("getConfigId read failed:", e?.shortMessage || e?.message);
  }
  try {
    const scope = await read("scope");
    console.log("scope:", scope.toString());
    console.log("expectedScopeUint:", expectedScopeUint.toString());
    console.log("scope_ok:", scope === expectedScopeUint);
  } catch (e) {
    console.log("scope read failed:", e?.shortMessage || e?.message);
  }
};

main().catch((e) => { console.error(e); process.exit(1); });
