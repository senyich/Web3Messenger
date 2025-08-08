import { http, createConfig } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, } from 'wagmi/chains'
import { walletConnect, metaMask, baseAccount,} from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const rainbowConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '41f192fac82827b3a5bfabefa6ac19fe',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, 
});

export const config = createConfig({
  chains: [arbitrum, base, mainnet, optimism, polygon],
  connectors: [
    walletConnect({ projectId: '41f192fac82827b3a5bfabefa6ac19fe' }),
    metaMask(),
    baseAccount(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http()
  },
})
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
