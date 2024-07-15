import "../styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import '../styles/taiko.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  baseSepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { DataProvider } from "../components/DataContext"

const queryClient = new QueryClient()

const Chain = {
  id: 167000,
  name: 'Taiko Mainnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/31525.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.taiko.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Taiko Explorer', url: 'https://taikoscan.io' },
  },
};


const config = getDefaultConfig({
  appName: 'Raffle',
  projectId: '6748d532ac67647cd2eec1b96272ba77',
  chains: [Chain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});



function MyApp({ Component, pageProps }) {

  return (

    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#F0148C',
            accentColorForeground: 'white',
          })}>

          <DataProvider>

            <Component {...pageProps} />

          </DataProvider>

        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>

  );
}

export default MyApp;
