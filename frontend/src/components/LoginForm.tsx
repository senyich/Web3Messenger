import React from "react";
import CustomLink from "./CustomLink";


const LoginForm: React.FC = () => {
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

          <form className="space-y-6">
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
              />
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
} 
export default LoginForm;