import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { getUserInfo } from '../utils/axios_requests';
import { storeToIPFS, getFromIPFS } from '../utils/ipfs';
import { getMessages, addMessage } from '../utils/axios_requests';
import type { UserInfoResponse } from '../interfaces/user_interfaces';
import type { Message } from '../interfaces/message_interface';

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
        setUserError(err instanceof Error ? err.message : 'Ошибка загрузки информации');
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!userAddress) return;
      
      setIsLoadingMessages(true);
      setMessagesError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Пользователь не авторизован');
        }
        
        const serverMessages: Message[] = await getMessages(token, userAddress);
        console.log(serverMessages);
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
  }, [userAddress]);

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

      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Ошибка отправки сообщения');
    } finally {
      setIsSending(false);
    }
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
          {userAddress && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow">
            <div className="flex items-center">
              <div className="bg-beigeBrown-500 w-3 h-3 rounded-full mr-2"></div>
              <span className="font-medium text-beigeBrown-700">Ваш адрес:</span>
            </div>
            <p className="mt-1 text-beigeBrown-600 font-mono text-sm break-all">
              {userAddress}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {isLoadingMessages && messages.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-beigeBrown-500"></div>
              </div>
            ) : messagesError ? (
              <div className="text-center py-4 text-red-500">
                {messagesError}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-beigeBrown-500">
                Нет сообщений
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