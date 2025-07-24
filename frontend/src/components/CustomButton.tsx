import type { CustomButtonProps } from "../interfaces/layout_interfaces";

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseClasses = "font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-beigeBrown-500 hover:bg-beigeBrown-600 text-white focus:ring-beigeBrown-500",
    secondary: "bg-sand-200 hover:bg-sand-300 text-beigeBrown-800 focus:ring-sand-300",
    text: "text-beigeBrown-600 hover:text-beigeBrown-800 bg-transparent hover:bg-beigeBrown-100 focus:ring-beigeBrown-300"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CustomButton;