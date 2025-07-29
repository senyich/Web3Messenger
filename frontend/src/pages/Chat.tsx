import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import { getUserInfo, validateJWT } from '../utils/axios_requests';
import { storeToIPFS, getFromIPFS } from '../utils/ipfs';
import { getMessages, addMessage } from '../utils/axios_requests';
import type { UserInfoResponse } from '../interfaces/user_interfaces';
import type { Message } from '../interfaces/message_interface';
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
        setSelectedAddress(userInfo.address); // Устанавливаем по умолчанию свой адрес
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
      if (!selectedAddress) return;
      
      setIsLoadingMessages(true);
      setMessagesError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Пользователь не авторизован');
        }
        const serverMessages: Message[] = await getMessages(token, selectedAddress);
        
        const messagesWithContent = await Promise.all(
          serverMessages.map(async (msg) => {
            try {
              const contentData = await getFromIPFS<{ content: string }>(msg.CID);
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
        const sortedMessages = messagesWithContent.sort(
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
  }, [selectedAddress]); // Зависимость от выбранного адреса

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !userAddress) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }
      const dataToStore = { content: message };
      const cid = await storeToIPFS(dataToStore);
      
      await addMessage(token, {
        CID: cid,
        timestamp: new Date().toISOString()
      });

      const newMessage: LocalMessage = {
        CID: cid,
        ownerAddress: userAddress,
        timestamp: new Date().toISOString(),
        content: message
      };

      // Добавляем сообщение только если смотрим свою историю
      if (selectedAddress === userAddress) {
        setMessages(prev => [newMessage, ...prev]);
      }
      setMessage('');
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Ошибка отправки сообщения');
    } finally {
      setIsSending(false);
    }
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
        <h1 className="text-2xl font-bold text-beigeBrown-700 mb-6">Тестовый чат</h1>
        
        {/* Панель выбора пользователя */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
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

        {/* Информация о текущих адресах */}
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
              {selectedAddress || "не выбраны"}
            </p>
          </div>
        </div>

        {/* Окно сообщений */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-beigeBrown-700">
              {selectedAddress === userAddress 
                ? "Ваши сообщения" 
                : `Сообщения пользователя`}
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
                  ? "Нет сообщений для этого адреса" 
                  : "Выберите адрес для просмотра сообщений"}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={`${msg.CID}-${index}`} 
                  className={`p-4 rounded-lg max-w-[80%] ${
                    msg.ownerAddress === userAddress 
                      ? 'bg-beigeBrown-100 ml-auto' 
                      : 'bg-beigeBrown-50'
                  }`}
                >
                  <p className="text-beigeBrown-700">{msg.content}</p>
                  <div className="text-xs text-beigeBrown-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Форма отправки сообщения */}
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