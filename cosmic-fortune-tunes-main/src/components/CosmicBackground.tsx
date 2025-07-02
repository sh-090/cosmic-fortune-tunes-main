
import { useEffect, useState } from 'react';

const CosmicBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card animate-pulse" 
           style={{ animationDuration: '8s' }} />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-primary star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px hsl(47 96% 53% / 0.5)`
          }}
        />
      ))}

      {/* Floating cosmic elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 blur-xl float-animation" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-lg float-animation" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-md float-animation" 
           style={{ animationDelay: '4s' }} />

      {/* Orbiting elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute w-2 h-2 bg-accent rounded-full orbit-animation" />
        </div>
      </div>
    </div>
  );
};

export default CosmicBackground;
