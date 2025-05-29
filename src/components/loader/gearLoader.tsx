'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import animationDataRed from '@public/animations/gear.json';
import animationDataWhite from '@public/animations/gear-white.json';

interface Props {
  tiny?: boolean;
  white?: boolean;
}

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

function GearLoader({ tiny, white }: Props) {
  const animationData = white ? animationDataWhite : animationDataRed;
  const size = tiny ? 100 : 200;

  return (
    <Lottie
      animationData={animationData}
      loop
      style={{ height: size, width: size }}
    />
  );
}

export default GearLoader;
