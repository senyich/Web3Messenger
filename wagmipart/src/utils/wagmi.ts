import { http, createConfig } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, sepolia, tron } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const rainbowConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '41f192fac82827b3a5bfabefa6ac19fe',
  chains: [mainnet, polygon, optimism, arbitrum, base, tron],
  ssr: true, 
});
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
