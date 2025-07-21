import React from 'react';
import CustomLink from '../CustomLink';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-beigeBrown-50 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-beigeBrown-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-beigeBrown-800 tracking-tight">
              Babuin<span className="text-beigeBrown-500">Hosting</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-beigeBrown-700 hover:text-beigeBrown-500 font-medium transition-colors"
            >
              Возможные активности
            </a>
            <a 
              href="#" 
              className="text-beigeBrown-700 hover:text-beigeBrown-500 font-medium transition-colors"
            >
              Социальные сети
            </a>
            <a 
              href="#" 
              className="text-beigeBrown-700 hover:text-beigeBrown-500 font-medium transition-colors"
            >
              О создателе
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <CustomLink href="/login" variant="secondary">
              Войти
            </CustomLink>
            <CustomLink href="/register">
              Регистрация
            </CustomLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;