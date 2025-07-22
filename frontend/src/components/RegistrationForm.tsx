import React, { useState } from 'react';
import CustomLink from './CustomLink';
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
    const navigate = useNavigate();

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

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const token: string = localStorage.getItem('authToken') ?? "";
            if(token)
                navigate('/');
            try{
                const userData : UserInfoResponse= await getUserInfo(token);
                console.log(userData);
                navigate('/');
            } catch(err) {
                const { email, username, password } = formData;
                const response = await registerUser({ email, username, password });
                localStorage.setItem('authToken', response.authToken);
                navigate('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
        }
    };
    
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
                    value={formData.confirmPassword}
                    onChange={handleFormUpdate}
                />
                </div>

                <div className="flex items-center">
                <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-beigeBrown-600 focus:ring-beigeBrown-500 border-beigeBrown-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-beigeBrown-700">
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
            </div>
        </div>
        </div>
    );
};

export default RegistrationForm;