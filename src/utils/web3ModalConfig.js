// web3modalConfig.js
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

const projectId = '51579e0bfc307e47bf2c53f47a6a394c';



const coston = {
  chainId: 16,
  name: 'Coston',
  currency: 'CFLR',
  explorerUrl: 'https://coston-explorer.flare.network/',
  rpcUrl: 'https://songbird-testnet-coston.rpc.thirdweb.com',
};

const localhost = {
  chainId: 31337,
  name: 'Localhost',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'http://localhost:8545',
};

const songbird = {
  name: "Songbird",
  currency: "SGB",
  explorerUrl: "https://explorer-api.songbird.network",
  rpcUrl: "https://songbird-api.flare.network/ext/bc/C/rpc",
  chainId: 19
};

const flare = {
  name: "Flare",
  currency: "FLR",
  explorerUrl: "https://explorer-api.flare.network",
  rpcUrl: "https://flare.rpc.thirdweb.com",
  chainId: 14
};

const metadata = {
  name: 'Flare Bear',
  description: 'Flare Bear is a decentralized application that allows users to mint NFTs and create their own meme tokens.',
  url: 'https://flarebear.vercel.app/',
  icons: ['https://flarebear.vercel.app/static/media/flarelogo.f2fe3b67958e385fa34d.png'],
};

const Web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [songbird, coston, flare, localhost],
  projectId,
  enableAnalytics: true,
  enableEmail: true,
  enableOnramp: true, // Optional - false as default

  themeMode: 'dark', // Override theme mode here
  themeVariables: {
    '--w3m-font-family': 'Arial, sans-serif',
    '--w3m-accent': 'black', 
    '--w3m-color-mix-strength': 40,
    '--w3m-font-size-master': '12px',
    '--w3m-border-radius-master': '10px',
    '--w3m-z-index': 1000,
  },
  chainImages: {
    1: 'https://png.pngtree.com/png-vector/20210427/ourmid/pngtree-ethereum-cryptocurrency-coin-icon-png-image_3246438.jpg',
   14: 'https://flarebear.vercel.app/static/media/flarelogo.f2fe3b67958e385fa34d.png',
    16: 'https://flarebear.vercel.app/static/media/flarelogo.f2fe3b67958e385fa34d.png',

    4: 'https://image.pngaaa.com/929/3148929-middle.png',
    137: 'https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo.webp',
    19: 'https://www.tbstat.com/wp/uploads/2023/10/SGB_512x512.png',
    80001: 'https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo.webp',
    31337: 'https://cdn.iconscout.com/icon/free/png-256/ethereum-1-283135.png',
  }
  
  
});

export default Web3Modal;
