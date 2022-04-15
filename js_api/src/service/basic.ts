import { Keyring, ApiPromise } from "@axia-js/api";
import { construct, decode, deriveAddress, methods, getRegistry } from '@axia-core/txwrapper-axia';
import { rpcToLocalNode, signWith } from './util';
import { u8aToHex } from '@axia-js/util';
import metaDataMap from '../constants/networkMetadata';

async function getWallet(mnemonic: String) {
  const ss58 = 0;
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.createFromUri(mnemonic);
  const address = deriveAddress(alice.publicKey, ss58);
  const publicKey = u8aToHex(alice.publicKey);
  // console.log(deriveAddress(alice.publicKey, ss58));
  // console.log(u8aToHex(alice.publicKey));
  const wallet = {
    "address": address,
    "pubKey": publicKey
  };
  console.log("wqallet is");
  console.log(wallet);
  return wallet;
}

async function newTest() {
  // const keyring = new Keyring({ type: 'sr25519' });
  // const alice = keyring.createFromUri("earn opinion sketch humble turn unaware keep defy what clay tip tribe");
  // const txHash = await api.tx.balances
  //   .transfer("13KVzBiWfQz6NdB5QwUBNfqijsahgoWR3BzUEYGDRoaGbrjY", 2500000000)
  //   .signAndSend(alice);

  // // Show the hash
  // console.log(`Submitted with hash ${txHash}`);

  // const { block } = await rpcToLocalNode('chain_getBlock');
  // console.log(`\nblock: ${parseInt(block.header.number,16)}`);
  // const  ablock  = await rpcToLocalNode('chain_getBlock');
  // console.log(`\nblock: ${JSON.stringify(ablock)}`);
}

async function signTransaction(mnemonic: string, dest: string, amount: string, submit: Boolean, unit: string,) {
  // console.log(`begin signing`);
  const ss58 = 0;
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.createFromUri(mnemonic);
  // const keypair = importPrivateKey(mnemonic, ss58);
  const address = deriveAddress(alice.publicKey, ss58);
  console.log(`\naddress: ${address}`);
  console.log(`\ndestination: ${dest}`);
  const metadataRpc = metaDataMap[unit];
  // const metadataRpc = await rpcToLocalNode('state_getMetadata', unit);
  console.log(`\nmetadatarpc: ${metadataRpc}`);
  const { block } = await rpcToLocalNode('chain_getBlock', unit);
  console.log(`\nblock: ${block}`);
  const blockHash = await rpcToLocalNode('chain_getBlockHash', unit);
  console.log(`\nblock hash: ${blockHash}`);
  const genesisHash = await rpcToLocalNode('chain_getBlockHash', unit, [0]);
  console.log(`\ngenesis hash: ${genesisHash}`);
  const nonce = await rpcToLocalNode('system_accountNextIndex', unit, [address]);
  console.log(`\nnonce: ${nonce}`);
  const { specVersion, transactionVersion, specName } = await rpcToLocalNode(
    'state_getRuntimeVersion', unit
  );
  const registry = getRegistry({
    chainName: 'AXIA TestNet',
    specName,
    specVersion,
    metadataRpc,
  });

  const unsigned = methods.balances.transferKeepAlive(
    {
      dest: dest,
      value: amount,
    },
    {
      address: address,
      blockHash,
      blockNumber: registry
        .createType('BlockNumber', block.header.number)
        .toNumber(),
      genesisHash,
      metadataRpc, // must import from client RPC call state_getMetadata
      nonce: nonce,
      specVersion,
      tip: 0,
      eraPeriod: 64, // number of blocks from checkpoint that transaction is valid
      transactionVersion,
    },
    {
      metadataRpc,
      registry, // Type registry
    }
  );

  const signingPayload = construct.signingPayload(unsigned, { registry });
  console.log(`\nPayload to Sign: ${signingPayload}`);

  // Decode the information from a signing payload.
  // const payloadInfo = decode(signingPayload, {
  // 	metadataRpc,
  // 	registry,
  // });
  // console.log(
  // 	`\nDecoded Transaction\n  To: ${
  // 		(payloadInfo.method.args.dest as { id: string })?.id
  // 	}\n` + `  Amount: ${payloadInfo.method.args.value}`
  // );

  const signature = signWith(alice, signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(`\nSignature: ${signature}`);

  // Serialize a signed transaction.
  const tx = construct.signedTx(unsigned, signature, {
    metadataRpc,
    registry,
  });
  console.log(`\nTransaction to Submit: ${tx}`);
  // const txHash = getTxHash(tx);
  // console.log(`\ntxHash: ${txHash}`);


  // Derive the tx hash of a signed transaction offline.
  // const expectedTxHash = construct.txHash(tx);
  // console.log(`\nExpected Tx Hash: ${expectedTxHash}`);

  // Decode a signed payload.
  // const txInfo = decode(tx, {
  // 	metadataRpc,
  // 	registry,
  // });
  // console.log(
  // 	`\nDecoded Transaction\n  To: ${
  // 		(txInfo.method.args.dest as { id: string })?.id
  // 	}\n` + `  Amount: ${txInfo.method.args.value}\n`
  // );

  // Send the tx to the node. Again, since `txwrapper` is offline-only, this
  // operation should be handled externally. Here, we just send a JSONRPC
  // request directly to the node.
  if (submit) {
    const actualTxHash = await rpcToLocalNode('author_submitExtrinsic', unit, [tx]);
    console.log(`Actual Tx Hash: ${actualTxHash}`);
    // console.log(`Actual ACTUAL Tx Hash: ${actualTxHash.toHex()}`);
    return { "txHash": actualTxHash };
  }
  return { "signedTX": tx };
}

export default {
  getWallet,
  signTransaction,
  newTest,
};

//sign.signTransaction("earn opinion sketch humble turn unaware keep defy what clay tip tribe", "13KVzBiWfQz6NdB5QwUBNfqijsahgoWR3BzUEYGDRoaGbrjY", "2500000000", true)
//sign.getWallet("earn opinion sketch humble turn unaware keep defy what clay tip tribe")
//0x3fc5913d3261b53014a4d7f5727b29135d54f7ffb45190b928e1c4ebaeab33e1
