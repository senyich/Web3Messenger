import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiSearch } from 'react-icons/fi';
import { getUserInfo, findUser } from '../utils/axios_requests';
import { storeToIPFS, getFromIPFS } from '../utils/ipfs';
import { getMessages, addMessage } from '../utils/axios_requests';
import type { UserInfoResponse } from '../interfaces/user_interfaces';
import type { Message, MessageContent } from '../interfaces/message_interface';
import { useNavigate } from 'react-router-dom';

interface LocalMessage extends Message {
  content: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [usernameSearch, setUsernameSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfoResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Пользователь не авторизован');
        }
        const userInfo: UserInfoResponse = await getUserInfo(token);
        setUserAddress(userInfo.address);
        setIsLoading(false);
      } catch (err) {
        localStorage.removeItem('authToken');
        setUserError(err instanceof Error ? err.message : 'Ошибка загрузки информации');
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedAddress || !userAddress) return;
      
      setIsLoadingMessages(true);
      setMessagesError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Пользователь не авторизован');
        }
        const currentUserMessages = await getMessages(token, userAddress);
        
        const selectedUserMessages = selectedAddress !== userAddress 
          ? await getMessages(token, selectedAddress) 
          : [];

        const allMessages = [...currentUserMessages, ...selectedUserMessages];
        console.log(allMessages)  
        const messagesWithContent = await Promise.all(
          allMessages.map(async (msg) => {
            try {
              const contentData = await getFromIPFS<MessageContent>(msg.CID);
              return {
                ...msg,
                content: contentData.content
              };
            } catch (err) {
              console.error('Failed to load message content:', err);
              return {
                ...msg,
                content: 'Не удалось загрузить сообщение'
              };
            }
          })
        );
        
        const filteredMessages = messagesWithContent.filter(msg => 
          (msg.fromAddress === userAddress && msg.toAddress === selectedAddress) ||
          (msg.fromAddress === selectedAddress && msg.toAddress === userAddress)
        );
        
        const sortedMessages = filteredMessages.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setMessages(sortedMessages);
      } catch (err) {
        setMessagesError(err instanceof Error ? err.message : 'Ошибка загрузки сообщений');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedAddress, userAddress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !userAddress || !selectedAddress) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }
      
      const dataToStore: MessageContent = { 
        content: message,
      };
      
      const cid = await storeToIPFS(dataToStore);
      
      await addMessage(token, {
        CID: cid,
        timestamp: new Date().toISOString(),
        fromAddress: userAddress,
        toAddress: selectedAddress
      });

      const newMessage: LocalMessage = {
        CID: cid,
        ownerAddress: userAddress,
        timestamp: new Date().toISOString(),
        fromAddress: userAddress,
        toAddress: selectedAddress,
        content: message
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Ошибка отправки сообщения');
    } finally {
      setIsSending(false);
    }
  };

  const handleSearchUser = async () => {
    if (!usernameSearch.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }
      
      const foundUser = await findUser(token, usernameSearch.trim());
      setSearchResults([foundUser]);
    } catch (err) {
      setSearchResults([]);
      setSearchError(err instanceof Error ? err.message : 'Ошибка поиска пользователя');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: UserInfoResponse) => {
    setSelectedAddress(user.address);
    setAddressInput(user.address);
    setSearchResults([]);
    setUsernameSearch('');
  };

  const handleSelectAddress = () => {
    if (addressInput.trim()) {
      setSelectedAddress(addressInput.trim());
    }
  };

  const handleViewOwnMessages = () => {
    setSelectedAddress(userAddress);
    setAddressInput(userAddress);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beigeBrown-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beigeBrown-500 mb-4"></div>
          <div className="text-beigeBrown-700">Загрузка информации о пользователе...</div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-beigeBrown-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-beigeBrown-700 mb-2">Ошибка загрузки</h2>
          <p className="text-beigeBrown-600 mb-4">{userError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-beigeBrown-500 text-white px-4 py-2 rounded-lg hover:bg-beigeBrown-600 transition"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beigeBrown-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-beigeBrown-700 mb-6">Чат</h1>
        
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <h2 className="text-lg font-medium text-beigeBrown-700 mb-3">Поиск пользователя</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-beigeBrown-400" />
              </div>
              <input
                type="text"
                value={usernameSearch}
                onChange={(e) => setUsernameSearch(e.target.value)}
                placeholder="Введите имя пользователя"
                className="pl-10 w-full border border-beigeBrown-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-beigeBrown-500"
              />
            </div>
            <button
              onClick={handleSearchUser}
              disabled={isSearching || !usernameSearch.trim()}
              className={`bg-beigeBrown-500 text-white px-4 py-2 rounded-lg hover:bg-beigeBrown-600 transition whitespace-nowrap flex items-center justify-center ${
                isSearching || !usernameSearch.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <FiSearch className="mr-2" />
              )}
              Найти
            </button>
          </div>

          {searchError && (
            <div className="mt-2 text-red-500 text-sm">{searchError}</div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map((user) => (
                <div 
                  key={user.address} 
                  className="p-3 border border-beigeBrown-200 rounded-lg hover:bg-beigeBrown-50 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="font-medium text-beigeBrown-700">{user.username}</div>
                  <div className="text-sm text-beigeBrown-500 font-mono break-all">{user.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <h2 className="text-lg font-medium text-beigeBrown-700 mb-3">Выбор адреса для чата</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-beigeBrown-400" />
              </div>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Введите адрес пользователя"
                className="pl-10 w-full border border-beigeBrown-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-beigeBrown-500"
              />
            </div>
            <button
              onClick={handleSelectAddress}
              className="bg-beigeBrown-500 text-white px-4 py-2 rounded-lg hover:bg-beigeBrown-600 transition whitespace-nowrap"
            >
              Показать сообщения
            </button>
            <button
              onClick={handleViewOwnMessages}
              className="bg-beigeBrown-300 text-beigeBrown-700 px-4 py-2 rounded-lg hover:bg-beigeBrown-400 transition whitespace-nowrap"
            >
              Мои сообщения
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-beigeBrown-500 w-3 h-3 rounded-full mr-2"></div>
              <span className="font-medium text-beigeBrown-700">Ваш адрес:</span>
            </div>
            <p className="mt-1 text-beigeBrown-600 font-mono text-sm break-all">
              {userAddress}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-blue-500 w-3 h-3 rounded-full mr-2"></div>
              <span className="font-medium text-beigeBrown-700">Просматриваемые сообщения:</span>
            </div>
            <p className="mt-1 text-beigeBrown-600 font-mono text-sm break-all">
              {selectedAddress === userAddress 
                ? userAddress 
                : `${selectedAddress} и ${userAddress}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-beigeBrown-700">
              {selectedAddress === userAddress 
                ? "Ваши сообщения" 
                : `Диалог с пользователем`}
            </h2>
            {messages.length > 0 && (
              <span className="text-sm text-beigeBrown-500">
                {messages.length} сообщений
              </span>
            )}
          </div>
          
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {isLoadingMessages ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-beigeBrown-500"></div>
              </div>
            ) : messagesError ? (
              <div className="text-center py-4 text-red-500">
                {messagesError}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-beigeBrown-500">
                {selectedAddress 
                  ? "Нет сообщений для этого диалога" 
                  : "Выберите адрес для просмотра сообщений"}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={`${msg.CID}-${index}`} 
                  className={`p-4 rounded-lg max-w-[80%] ${
                    msg.fromAddress === userAddress 
                      ? 'bg-beigeBrown-100 ml-auto' 
                      : 'bg-beigeBrown-50'
                  }`}
                >
                  <p className="text-beigeBrown-700">{msg.content}</p>
                  <div className="text-xs text-beigeBrown-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                    {msg.fromAddress !== userAddress && (
                      <div className="mt-1 text-xs text-beigeBrown-400">
                        От: {msg.fromAddress.substring(0, 12)}...
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              disabled={isSending}
              maxLength={500}
              className="flex-1 border border-beigeBrown-200 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-beigeBrown-500 resize-none"
              rows={3}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className={`bg-beigeBrown-500 text-white px-6 rounded-r-lg flex items-center justify-center ${
                isSending || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-beigeBrown-600'
              }`}
            >
              <FiSend className="mr-2" />
              Отправить
            </button>
          </div>
          
          <div className="mt-2 text-sm text-beigeBrown-500">
            {isSending 
              ? 'Отправка сообщения...' 
              : `Длина сообщения: ${message.length}/500 символов`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;