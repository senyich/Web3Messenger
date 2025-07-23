import React, { useEffect, useState } from 'react';
import CustomLink from '../components/CustomLink';
import { getUserInfo, registerUser } from '../utils/axios_requests';
import { useNavigate } from 'react-router-dom';
import type { UserInfoResponse } from '../interfaces/user_interfaces';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false
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
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.acceptedTerms) {
            setError('Необходимо принять условия пользования');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const { email, username, password } = formData;
            const response = await registerUser({ email, username, password });
            localStorage.setItem('authToken', response.authToken);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
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
                            Создайте аккаунт
                        </h2>
                        <p className="text-beigeBrown-500 mt-2">
                            Уже есть аккаунт?{' '}
                            <CustomLink href="/login" variant="primary">
                                Войти
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
                            <label htmlFor="username" className="block text-sm font-medium text-beigeBrown-700 mb-1">
                                Имя пользователя
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-3 rounded-lg border border-beigeBrown-300 focus:ring-2 focus:ring-beigeBrown-500 focus:border-beigeBrown-500 outline-none transition"
                                placeholder="babuin123"
                                required
                                value={formData.username}
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-beigeBrown-700 mb-1">
                                Подтверждение пароля
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-3 rounded-lg border border-beigeBrown-300 focus:ring-2 focus:ring-beigeBrown-500 focus:border-beigeBrown-500 outline-none transition"
                                placeholder="••••••••"
                                required
                                value={formData.confirmPassword}
                                onChange={handleFormUpdate}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="acceptedTerms"
                                type="checkbox"
                                className="h-4 w-4 text-beigeBrown-600 focus:ring-beigeBrown-500 border-beigeBrown-300 rounded"
                                checked={formData.acceptedTerms}
                                onChange={handleFormUpdate}
                                required
                            />
                            <label htmlFor="acceptedTerms" className="ml-2 block text-sm text-beigeBrown-700">
                                Я согласен с <CustomLink href="#" variant="secondary">условиями пользования</CustomLink>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-beigeBrown-600 hover:bg-beigeBrown-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-beigeBrown-500 focus:ring-offset-2"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-beigeBrown-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-beigeBrown-500">Или войдите через</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.location.href = `http://localhost:8000/connect/google`}
                            className="mt-4 w-full flex justify-center py-3 px-4 border border-beigeBrown-300 rounded-lg shadow-sm text-sm font-medium text-beigeBrown-700 bg-white hover:bg-beigeBrown-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beigeBrown-500"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="#4285F4"
                            />
                            </svg>
                            Войти через Google
                        </button>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;