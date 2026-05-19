import React from 'react';

const Logo = ({ variant = 'full', size = 'md', className = '' }) => {
  // Define size dimensions
  const dimensions = {
    sm: { h: 'h-6', w: 'w-6', text: 'text-lg' },
    md: { h: 'h-8', w: 'w-8', text: 'text-2xl' },
    lg: { h: 'h-12', w: 'w-12', text: 'text-4xl' },
  }[size] || { h: 'h-8', w: 'w-8', text: 'text-2xl' };

  // High-fidelity custom ticket NeuralEvents logo emblem
  const Emblem = () => (
    <img 
      src="https://res.cloudinary.com/dxz68zfml/image/upload/v1779210715/Screenshot_2026-05-19_224017_fnjzc4.png" 
      alt="NeuralEvents Logo" 
      className={`${dimensions.h} ${dimensions.w} rounded-lg object-contain flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]`}
    />
  );

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Emblem />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Emblem />
      {variant === 'full' && (
        <span className={`font-display font-black tracking-tight ${dimensions.text} text-white`}>
          Neural<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Events</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
