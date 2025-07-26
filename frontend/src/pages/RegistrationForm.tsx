import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import CustomButton from '../components/CustomButton';
import { BaseError, erc20Abi}  from 'viem';


function ReadContract() {
  const { 
    data: balance,
    error,
    isPending
  } = useReadContract({
    address: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    abi: erc20Abi,
    functionName: 'balanceOf'
  })

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error as BaseError).shortMessage || error.message}
      </div>
    )

  return (
    <div>Balance: {balance?.toString()}</div>
  )
}

const RegistrationForm: React.FC = () => {
    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const { disconnect } = useDisconnect()
    return (
        <div className="min-h-screen bg-beigeBrown-50 p-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-beigeBrown-800 mb-4">ТЕСТ</h2>

                <div className="space-y-2 text-beigeBrown-700">
                    <p><span className="font-semibold">Статус подключения:</span> {account.status}</p>
                    <p><span className="font-semibold">Адреса:</span> {(account.chain?.name)}: {"["}{account.address}{"]"}</p>
                    <p><span className="font-semibold">Баланс: <ReadContract  /></span></p>
                </div>

                {account.status === 'connected' && (
                    <button 
                        type="button" 
                        onClick={() => disconnect()}
                        className="mt-4 px-4 py-2 bg-beigeBrown-600 text-white rounded-md hover:bg-beigeBrown-700 transition-colors"
                    >
                        Disconnect
                    </button>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-beigeBrown-800 mb-4">Connect</h2>
                
                <div className="grid grid-cols-1 gap-3 mb-4">
                    {connectors.map((connector) => (
                        <CustomButton
                            key={connector.uid}
                            onClick={() => connect({ connector })}
                        >
                            {connector.icon
                             ? <img src = {connector.icon} alt = {connector.name} width="50"></img>
                             : connector.name}
                        </CustomButton>
                    ))}
                </div>

                {status && (
                    <div className="p-3 bg-beigeBrown-100 rounded-md text-beigeBrown-700 mb-3">
                        Status: {status}
                    </div>
                )}

            </div>
        </div>
    );
};

export default RegistrationForm;