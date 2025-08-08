import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { FiArrowRight, FiChevronDown, FiX } from 'react-icons/fi';
import WalletLabel from './WalletLabel';

const CryptoNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConnected, setShowConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const account = useAccount();
  const { connectors, connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (account.status === 'connected') {
      setShowConnected(true);
    }
    
    if (connectError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [account.status, connectError]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-medium text-beigeBrown-700 flex items-center">
          <WalletLabel className="mr-2 w-5 h-5 text-beigeBrown-500" />
          Криптокошелек
        </label>
        
        {account.status !== 'connected' && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-beigeBrown-500 hover:text-beigeBrown-700 transition-all flex items-center text-sm group"
          >
            {isExpanded ? 'Свернуть' : 'Выбрать кошелек'}
            <FiChevronDown 
              className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} 
            />
          </button>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => {
                connect({ connector });
                setIsExpanded(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-beigeBrown-50 border border-beigeBrown-200 rounded-xl hover:bg-beigeBrown-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center">
                {connector.icon && (
                  <img 
                    src={connector.icon} 
                    alt={connector.name} 
                    className="w-6 h-6 mr-3 rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <span className="text-beigeBrown-800 font-medium">{connector.name}</span>
              </div>
              <FiArrowRight className="text-beigeBrown-500 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {account.status === 'connected' && (
        <div className={`mt-3 p-3 bg-gradient-to-r from-beigeBrown-50 to-beigeBrown-100 rounded-xl text-beigeBrown-700 border border-beigeBrown-200 shadow-sm transition-all duration-500 ${showConnected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="flex justify-between items-center">
            <div className="overflow-hidden">
              <p className="font-medium flex items-center">
                <WalletLabel className="mr-2 w-4 h-4 text-beigeBrown-600 transition-transform duration-500 hover:rotate-12" />
                Подключен кошелек
              </p>
              <p className="text-xs truncate mt-1 text-beigeBrown-500 animate-pulse-slow">{account.address}</p>
            </div>
            <button 
              type="button"
              onClick={() => {
                setShowConnected(false);
                setTimeout(() => disconnect(), 300);
              }}
              className="text-sm px-3 py-1 bg-white border border-beigeBrown-300 rounded-lg text-beigeBrown-700 hover:bg-beigeBrown-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
            >
              Отключить
            </button>
          </div>
        </div>
      )}
      
      {connectError && (
        <div className={`mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 transition-all duration-500 ${showError ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Ошибка подключения</p>
              <p className="text-xs mt-1">{connectError.message}</p>
            </div>
            <button 
              onClick={() => setShowError(false)}
              className="text-red-500 hover:text-red-700 transition-colors ml-2 mt-0.5"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoNavbar;