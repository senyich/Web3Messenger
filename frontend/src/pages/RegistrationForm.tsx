import React, { useEffect, useState } from 'react';
import CustomLink from '../components/CustomLink';
import { registerUser, validateJWT } from '../utils/axios_requests';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import CryptoNavbar from '../components/CryptoNavbar';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  const account = useAccount();

  useEffect(() => {
    async function checkAuth() {
      const token: string | null = localStorage.getItem('authToken');
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const tokenData = await validateJWT(token);
        navigate('/');
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsCheckingAuth(false);
        console.error('Ошибка при проверке авторизации', error);
      }
    }

    checkAuth();
  }, [navigate]);

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!account.address) {
      setError('Пожалуйста, подключите криптокошелек');
      return;
    }

    try {
      const { username, password } = formData;
      const response = await registerUser({ 
        username, 
        password,
        address: account.address 
      });
      localStorage.setItem('authToken', response.authToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-beigeBrown-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beigeBrown-500 mb-4"></div>
          <div className="text-beigeBrown-700">Проверка авторизации...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-beigeBrown-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-beigeBrown-500 to-beigeBrown-600 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Создайте учетную запись
            </h2>
            <p className="text-beigeBrown-100 mt-1">
              Присоединяйтесь к нашему сообществу
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <CryptoNavbar />

                <div className="relative">
                  <label htmlFor="username" className="block text-sm font-medium text-beigeBrown-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-beigeBrown-500" />
                    Имя пользователя
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-beigeBrown-200 focus:ring-2 focus:ring-beigeBrown-500 focus:border-transparent outline-none transition"
                      placeholder="Ваше имя"
                      required
                      value={formData.username}
                      onChange={handleFormUpdate}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-beigeBrown-400" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-beigeBrown-700 mb-2 flex items-center">
                    <FiLock className="mr-2 text-beigeBrown-500" />
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-beigeBrown-200 focus:ring-2 focus:ring-beigeBrown-500 focus:border-transparent outline-none transition"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleFormUpdate}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-beigeBrown-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beigeBrown-500 ${
                  !account.address 
                    ? 'bg-beigeBrown-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-beigeBrown-500 to-beigeBrown-600 hover:from-beigeBrown-600 hover:to-beigeBrown-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                disabled={!account.address}
              >
                Зарегистрироваться
                <FiArrowRight className="ml-2" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-beigeBrown-100 text-center">
              <p className="text-beigeBrown-600">
                Уже есть аккаунт?{' '}
                <CustomLink href="/login" variant="primary">
                  Войти
                </CustomLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;