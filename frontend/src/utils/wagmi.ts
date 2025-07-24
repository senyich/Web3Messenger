import { http, createConfig, useReadContract } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, sepolia, tron } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, metaMask, baseAccount, mock, injected} from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const rainbowConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '41f192fac82827b3a5bfabefa6ac19fe',
  chains: [mainnet, polygon, optimism, arbitrum, base, tron],
  ssr: true, 
});

export const config = createConfig({
  chains: [arbitrum,/*sepolia, base, mainnet,*/ optimism, polygon, tron],
  connectors: [
    coinbaseWallet(),
    walletConnect({ projectId: '41f192fac82827b3a5bfabefa6ac19fe' }),
    metaMask(),
    baseAccount(),
    injected()
  ],
  transports: {
    // [mainnet.id]: http(),
    // [sepolia.id]: http(),
    // [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [tron.id]: http()
  },
})
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
