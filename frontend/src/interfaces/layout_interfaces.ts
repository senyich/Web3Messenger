export interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}
export interface CustomButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
