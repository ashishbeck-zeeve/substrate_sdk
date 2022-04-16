import { WsProvider, ApiPromise } from "@axia-js/api";
import { subscribeMessage, getNetworkConst, getNetworkProperties } from "./service/setting";
import basic from "./service/basic";

// console.log will send message to MsgChannel to App
function send(path: string, data: any) {
  console.log(JSON.stringify({ path, data }));
}
send("log", "main js loaded");
(<any>window).send = send;

/**
 * connect to a specific node.
 *
 * @param {string} nodeEndpoint
 */
async function connect(nodes: string[]) {
  return new Promise(async (resolve, reject) => {
    const wsProvider = new WsProvider(nodes);
    try {
      const res = await ApiPromise.create({
        provider: wsProvider,
      });
      (<any>window).api = res;
      const url = nodes[(<any>res)._options.provider.__private_9_endpointIndex];
      send("log", `${url} wss connected success`);
      resolve(url);
    } catch (err) {
      send("log", `connect failed`);
      wsProvider.disconnect();
      resolve(null);
    }
  });
}

const test = async () => {
  // const props = await api.rpc.system.properties();
  // send("log", props);
};

const settings = {
  test,
  connect,
  subscribeMessage,
  getNetworkConst,
  getNetworkProperties,
  // generate external links to axiascan/subscan/axiassembly...
  // genLinks,
};

(<any>window).settings = settings;
(<any>window).basic = basic;

// walletConnect supporting is not ready.
// (<any>window).walletConnect = wc;

export default settings;
