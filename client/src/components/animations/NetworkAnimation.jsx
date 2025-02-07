import React from 'react';
import Lottie from 'lottie-react';
import networkAnimation from './network-animation.json';

const NetworkAnimation = () => {
  return (
    <Lottie
      animationData={networkAnimation}
      loop={true}
      style={{ width: '100%', maxWidth: '500px' }}
    />
  );
};

export default NetworkAnimation;
