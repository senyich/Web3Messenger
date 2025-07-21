import React from 'react';
import type { CustomLinkProps } from '../interfaces/layout_interfaces';

const CustomLink: React.FC<CustomLinkProps> = ({ 
  href, 
  children, 
  variant = 'primary' 
}) => {
  const baseClasses = "font-medium transition-all duration-300 rounded-lg px-4 py-2";
  
  const variantClasses = variant === 'primary' 
    ? "bg-beigeBrown-500 hover:bg-beigeBrown-600 text-white" 
    : "bg-sand-200 hover:bg-sand-300 text-beigeBrown-800";

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </a>
  );
};

export default CustomLink;