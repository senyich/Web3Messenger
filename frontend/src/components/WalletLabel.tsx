const WalletLabel: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <path d="M17 12h.01"></path>
  </svg>
);
export default WalletLabel;