import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-beigeBrown-900 text-beigeBrown-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-beigeBrown-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                BabuinWeb3
              </h2>
            </div>
            <p className="text-beigeBrown-300 mb-4">
              Web3 пет проект
            </p>
            <div className="flex space-x-3">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="bg-beigeBrown-700 hover:bg-beigeBrown-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="bg-beigeBrown-300 w-5 h-5 rounded-full"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-beigeBrown-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-beigeBrown-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} BabuinWeb3. Все права защищены.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-beigeBrown-500 hover:text-beigeBrown-300 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-beigeBrown-500 hover:text-beigeBrown-300 transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;