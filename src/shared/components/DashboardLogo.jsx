import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_CHANGE_INTERVAL = 300000;

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
      setCurrentLogoIndex((prev) => {
        const next = (prev + 1) % logos.length;
        setNextLogoIndex((next + 1) % logos.length);
        return next;
      });
    }, LOGO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [logos.length]);

  if (isLoading || logos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] pt-3">
        <motion.div 
          className="w-[160px] h-[160px] rounded-full bg-black border-2 border-[#00F6FF]"
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
    <div className="flex items-center justify-center h-[300px] pt-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLogoIndex}
          initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-[200px] h-[200px]"
        >
          {/* Main container with all effects */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer glow and border */}
            <motion.div
              className="absolute w-[160px] h-[160px] rounded-full"
              style={{
                background: 'black',
                boxShadow: `
                  0 0 40px rgba(0,246,255,0.5),
                  0 0 80px rgba(0,246,255,0.3),
                  inset 0 0 100px rgba(255,46,151,0.3)
                `,
                border: '2px solid #00F6FF'
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
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Image container */}
            <div 
              className="absolute w-[160px] h-[160px] rounded-full overflow-hidden"
              style={{ transform: 'scale(1.01)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={logos[currentLogoIndex]}
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    exit: { duration: 0.5 },
                    crossfade: true 
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={logos[currentLogoIndex]}
                    alt="Cyberpunk Logo"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.2)',
                    }}
                    onError={() => {
                      console.error(`Error loading logo: ${logos[currentLogoIndex]}`);
                      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Preload next image */}
              <div className="hidden">
                <img
                  src={logos[nextLogoIndex]}
                  alt="Preload Next"
                  onError={() => console.error(`Error preloading next logo: ${logos[nextLogoIndex]}`)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DashboardLogo;