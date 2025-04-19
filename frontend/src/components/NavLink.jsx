import React from 'react';
import PropTypes from 'prop-types';

export const NavLink = ({ href, children, className = "", onClick }) => {
  return (
    <a 
      href={href} 
      className={`block text-gray-700 hover:text-blue-600 transition ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};