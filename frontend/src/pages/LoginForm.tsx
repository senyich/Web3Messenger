import React, { useEffect, useState } from 'react';
import CustomLink from '../components/CustomLink';
import { getUserInfo, loginUser } from '../utils/axios_requests';
import { useNavigate } from 'react-router-dom';
import type { UserInfoResponse } from '../interfaces/user_interfaces';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            const token: string | null = localStorage.getItem('authToken');
            if (!token) {
                setIsCheckingAuth(false);
                return;
            }

            try {
                const userData: UserInfoResponse = await getUserInfo(token);
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
        try {
            const { email, password } = formData;
            const response = await loginUser({ email, password });
            localStorage.setItem('authToken', response.authToken);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-beigeBrown-50 flex items-center justify-center">
                <div className="text-beigeBrown-800 text-lg">Проверка авторизации...</div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-beigeBrown-50">
            <div className="container mx-auto px-6 py-16 max-w-lg"> 
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-beigeBrown-500 w-12 h-12 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">B</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-beigeBrown-800">
                            Войдите в существующую учетную запись
                        </h2>
                        <p className="text-beigeBrown-500 mt-2">
                            Нет аккаунта?{' '}
                            <CustomLink href="/register" variant="primary">
                                Зарегистрировать новый
                            </CustomLink>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-beigeBrown-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 rounded-lg border border-beigeBrown-300 focus:ring-2 focus:ring-beigeBrown-500 focus:border-beigeBrown-500 outline-none transition"
                                placeholder="your@email.com"
                                required
                                value={formData.email}
                                onChange={handleFormUpdate}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-beigeBrown-700 mb-1">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 rounded-lg border border-beigeBrown-300 focus:ring-2 focus:ring-beigeBrown-500 focus:border-beigeBrown-500 outline-none transition"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleFormUpdate}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-beigeBrown-600 hover:bg-beigeBrown-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-beigeBrown-500 focus:ring-offset-2"
                        >
                            Войти
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;