import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

function LoadingSpinner() {
  const container = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../assets/loading.json'),
    });

    return () => {
      anim.destroy(); 
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      {/* Lottie animation container */}
      <div ref={container} className="w-1/4"></div> 
    </div>
  );
}

export default LoadingSpinner;
