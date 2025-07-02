
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, RotateCcw } from 'lucide-react';

interface CosmicJourneyProps {
  isActive: boolean;
  onToggle: () => void;
}

const CosmicJourney = ({ isActive, onToggle }: CosmicJourneyProps) => {
  const [journeyStep, setJourneyStep] = useState(0);

  const journeySteps = [
    { name: "Earth's Atmosphere", description: "Starting our cosmic journey from home..." },
    { name: "The Moon", description: "Our faithful celestial companion..." },
    { name: "Mars", description: "The red planet beckons..." },
    { name: "Jupiter", description: "Gas giant with swirling storms..." },
    { name: "Saturn's Rings", description: "Spectacular icy formations..." },
    { name: "Deep Space", description: "Beyond our solar system..." },
    { name: "Andromeda Galaxy", description: "Our nearest galactic neighbor..." },
    { name: "The Cosmic Web", description: "The universe's grand structure..." }
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setJourneyStep((prev) => (prev + 1) % journeySteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed top-4 right-4 z-30">
      <Button
        onClick={onToggle}
        size="lg"
        className={`cosmic-glow font-orbitron transition-all duration-500 ${
          isActive 
            ? 'bg-gradient-to-r from-accent to-primary animate-pulse' 
            : 'bg-gradient-to-r from-primary to-secondary'
        }`}
      >
        {isActive ? (
          <>
            <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
            Journey Mode
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5 mr-2" />
            Cosmic Journey
          </>
        )}
      </Button>

      {isActive && (
        <div className="mt-4 p-4 bg-gradient-to-br from-card/90 to-muted/80 backdrop-blur-lg rounded-lg border border-accent/30 min-w-64">
          <div className="text-center">
            <h3 className="font-orbitron text-lg font-bold text-accent mb-2">
              🚀 {journeySteps[journeyStep].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {journeySteps[journeyStep].description}
            </p>
            <div className="mt-3 flex justify-center space-x-1">
              {journeySteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === journeyStep ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicJourney;
