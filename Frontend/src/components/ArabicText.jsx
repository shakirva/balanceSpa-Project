import React from 'react';

const ArabicText = ({ children, className = '', style = {}, ...props }) => {
  return (
    <span
      className={`arabic-text ${className}`}
      style={{
        fontFamily: '"Noto Sans Arabic", "Cairo", "Amiri", "Scheherazade New", Arial, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        unicodeBidi: 'embed',
        ...style
      }}
      lang="ar"
      {...props}
    >
      {children}
    </span>
  );
};

export default ArabicText;