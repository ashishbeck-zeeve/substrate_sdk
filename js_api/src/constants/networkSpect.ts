import { allNetworks } from "@axia-js/networks";
import { assert } from "@axia-js/util";

const colors = {
  background: {
    app: "#151515",
    button: "C0C0C0",
    card: "#262626",
    os: "#000000",
  },
  border: {
    dark: "#000000",
    light: "#666666",
    signal: "#8E1F40",
  },
  signal: {
    error: "#D73400",
    main: "#FF4077",
  },
  text: {
    faded: "#9A9A9A",
    main: "#C0C0C0",
  },
};

export const unknownNetworkPathId = "";

export const NetworkProtocols = Object.freeze({
  ETHEREUM: "ethereum",
  SUBSTRATE: "substrate",
  UNKNOWN: "unknown",
});

// accounts for which the network couldn't be found (failed migration, removed network)
export const UnknownNetworkKeys = Object.freeze({
  UNKNOWN: "unknown",
});

/* eslint-enable sort-keys */

// genesisHash is used as Network key for Substrate networks
export const SubstrateNetworkKeys = Object.freeze({
  AXIALUNAR: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe", // https://axiascan.io/pre/axialunar-cc3/block/0
  AXIA: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
});

const unknownNetworkBase = {
  [UnknownNetworkKeys.UNKNOWN]: {
    color: colors.signal.error,
    order: 99,
    pathId: unknownNetworkPathId,
    prefix: 2,
    protocol: NetworkProtocols.UNKNOWN,
    secondaryColor: colors.background.card,
    title: "Unknown network",
  },
};

const substrateNetworkBase = {
  [SubstrateNetworkKeys.AXIALUNAR]: {
    color: "#000",
    decimals: 12,
    genesisHash: SubstrateNetworkKeys.AXIALUNAR,
    order: 2,
    pathId: "axialunar",
    prefix: 2,
    title: "AXIALunar",
    unit: "KSM",
  },
  [SubstrateNetworkKeys.AXIA]: {
    color: "#E6027A",
    decimals: 12,
    genesisHash: null,
    order: 1,
    pathId: "axia",
    prefix: 0,
    title: "AXIA",
    unit: "DOT",
  },
};

const substrateDefaultValues = {
  color: "#4C4646",
  protocol: NetworkProtocols.SUBSTRATE,
  secondaryColor: colors.background.card,
};

function setDefault(networkBase, defaultProps) {
  return Object.keys(networkBase).reduce((acc, networkKey) => {
    return {
      ...acc,
      [networkKey]: {
        ...defaultProps,
        ...networkBase[networkKey],
      },
    };
  }, {});
}

export const SUBSTRATE_NETWORK_LIST = Object.freeze(setDefault(substrateNetworkBase, substrateDefaultValues));
export const UNKNOWN_NETWORK = Object.freeze(unknownNetworkBase);

const substrateNetworkMetas = Object.values({
  ...SUBSTRATE_NETWORK_LIST,
  ...UNKNOWN_NETWORK,
});
export const PATH_IDS_LIST = substrateNetworkMetas.map((meta: any) => meta.pathId);

export const NETWORK_LIST = Object.freeze(Object.assign({}, SUBSTRATE_NETWORK_LIST, [], UNKNOWN_NETWORK));

export const defaultNetworkKey = SubstrateNetworkKeys.AXIALUNAR;

function getGenesis(name: string): string {
  const network = allNetworks.find(({ network }) => network === name);
  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);
  return network.genesisHash[0];
}
export const AXIALUNAR_GENESIS = getGenesis("axialunar");
export const AXIA_GENESIS = getGenesis("axia");
