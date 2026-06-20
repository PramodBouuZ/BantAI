import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PrefetchLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  component: () => Promise<any>;
}

const PrefetchLink: React.FC<PrefetchLinkProps> = ({ to, component, children, ...props }) => {
  const navigate = useNavigate();

  const handlePrefetch = () => {
    component();
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      {...props}
    >
      {children}
    </a>
  );
};

export default PrefetchLink;
