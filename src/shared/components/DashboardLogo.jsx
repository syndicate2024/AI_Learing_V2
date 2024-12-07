import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LOGO_CHANGE_INTERVAL = 300000; // 5 minutes

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        resolve(true);
      } else {
        reject(new Error('Image loaded but has no dimensions'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

const DashboardLogo = () => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [nextLogoIndex, setNextLogoIndex] = useState(1);
  const [logos, setLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLogoPreloaded, setNextLogoPreloaded] = useState(false);

  useEffect(() => {
    const getLogos = async () => {
      setIsLoading(true);
      const validLogos = [];
      
      for (let i = 4; i <= 59; i++) {
        const logoPath = `/logos/${i}.png`;
        try {
          const isValid = await preloadImage(logoPath);
          if (isValid) {
            validLogos.push(logoPath);
          }
        } catch {
          console.log(`Logo ${i}.png not available or invalid`);
        }
      }

      if (validLogos.length > 0) {
        console.log(`Loaded ${validLogos.length} valid logos`);
        setLogos(shuffleArray(validLogos));
      }
      setIsLoading(false);
    };

    getLogos();
  }, []);

  useEffect(() => {
    if (logos.length === 0) return;

    const interval = setInterval(() => {
      if (!nextLogoPreloaded) return; // Don't transition if next logo isn't ready

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLogoIndex((prev) => {
          const next = (prev + 1) % logos.length;
          setNextLogoIndex((next + 1) % logos.length);
          return next;
        });
        setIsTransitioning(false);
      }, 1000);
    }, LOGO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [logos.length, nextLogoPreloaded]);

  if (isLoading || logos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div 
          className="w-full h-full rounded-full bg-black border-2 border-[#00F6FF]"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            boxShadow: [
              '0 0 20px rgba(0,246,255,0.3)',
              '0 0 40px rgba(0,246,255,0.5)',
              '0 0 20px rgba(0,246,255,0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Main container with all effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer glow and border */}
          <motion.div
            className="absolute w-full h-full rounded-full"
            style={{
              background: 'black',
              boxShadow: `
                0 0 40px rgba(0,246,255,0.5),
                0 0 80px rgba(0,246,255,0.3),
                inset 0 0 100px rgba(255,46,151,0.3)
              `,
              border: '2px solid #00F6FF',
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
            animate={{
              boxShadow: [
                `
                  0 0 40px rgba(0,246,255,0.5),
                  0 0 80px rgba(0,246,255,0.3),
                  inset 0 0 100px rgba(255,46,151,0.3)
                `,
                `
                  0 0 50px rgba(255,46,151,0.5),
                  0 0 90px rgba(255,46,151,0.3),
                  inset 0 0 110px rgba(0,246,255,0.3)
                `,
                `
                  0 0 40px rgba(0,246,255,0.5),
                  0 0 80px rgba(0,246,255,0.3),
                  inset 0 0 100px rgba(255,46,151,0.3)
                `
              ],
              rotateY: isTransitioning ? 360 : 0
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotateY: {
                duration: 1,
                ease: "easeInOut"
              }
            }}
          >
            {/* Image container */}
            <div 
              className="absolute w-full h-full rounded-full overflow-hidden"
              style={{ transform: 'scale(1.01)' }}
            >
              {/* Current Logo */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.img
                  src={logos[currentLogoIndex]}
                  alt="Current Cyberpunk Logo"
                  className="absolute w-full h-full object-cover"
                  style={{ transform: 'scale(1.2)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </motion.div>

              {/* Next Logo (preloaded and ready for transition) */}
              {isTransitioning && nextLogoPreloaded && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <motion.img
                    src={logos[nextLogoIndex]}
                    alt="Next Cyberpunk Logo"
                    className="absolute w-full h-full object-cover"
                    style={{ transform: 'scale(1.2)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              )}

              {/* Hidden preload container */}
              <div className="hidden">
                <img
                  src={logos[nextLogoIndex]}
                  alt="Preload Next"
                  onLoad={() => setNextLogoPreloaded(true)}
                  onError={() => {
                    console.error(`Error preloading next logo: ${logos[nextLogoIndex]}`);
                    setNextLogoIndex((prev) => (prev + 1) % logos.length);
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogo;