'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { OpeningAnimation } from './OpeningAnimation';

export const GlobalIntro: React.FC = () => {
  const pathname = usePathname();
  const { isIntroOpen, setIsIntroOpen } = useCart();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <OpeningAnimation
      isOpen={isIntroOpen}
      onComplete={() => setIsIntroOpen(false)}
    />
  );
};
