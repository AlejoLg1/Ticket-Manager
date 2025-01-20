import React from 'react';
import  Lottie  from "lottie-react";
import animationDataRed from '@public/animations/house.json';
import animationDataWhite from '@public/animations/house-white.json';

interface Props {
  tiny?: boolean;
  white?: boolean;
}

function HouseLoader({ tiny, white }: Props) {
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

export default HouseLoader;
