
import { useState } from 'react';
import CosmicBackground from '@/components/CosmicBackground';
import ParticleSystem from '@/components/ParticleSystem';

import CosmicJourney from '@/components/CosmicJourney';
import SoundEffects from '@/components/SoundEffects';
import FortuneCard from '@/components/FortuneCard';
import MusicPlayer from '@/components/MusicPlayer';
import ActionButtons from '@/components/ActionButtons';
import WeatherForecast from '@/components/WeatherForecast';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [fortune, setFortune] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [spaceData, setSpaceData] = useState<any>(null);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [soundTriggers, setSoundTriggers] = useState({
    buttonClick: 0,
    fortuneGenerate: 0,
    musicPlay: 0
  });

  const generateFortune = async () => {
    setIsLoading(true);
    setSoundTriggers(prev => ({ ...prev, fortuneGenerate: prev.fortuneGenerate + 1 }));
    
    try {
      // Using NASA APOD API to get space data
      const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
      const data = await response.json();
      
      const fortunes = [
        `Like ${data.title}, your future shines bright across the cosmic void...`,
        `The universe whispers: "${data.explanation?.slice(0, 100)}..." - let this guide your path today.`,
        `From the depths of space comes wisdom: Today's cosmic energy aligns with discovery and wonder.`,
        `As vast as the cosmos above, your potential knows no bounds. The stars have spoken.`,
        `${data.title} reminds us that beauty exists in the infinite. Your day will reflect this cosmic truth.`
      ];
      
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(randomFortune);
      setSpaceData(data);
    } catch (error) {
      console.error('Error fetching space data:', error);
      const fallbackFortunes = [
        "The cosmos align to bring you unexpected opportunities today...",
        "Like distant galaxies, your dreams are closer than they appear...",
        "Solar winds carry news of positive changes heading your way...",
        "The dance of celestial bodies suggests harmony in your near future...",
        "Cosmic radiation detected: High probability of serendipitous encounters..."
      ];
      setFortune(fallbackFortunes[Math.floor(Math.random() * fallbackFortunes.length)]);
    }
    setIsLoading(false);
  };

  const handleButtonClick = () => {
    setSoundTriggers(prev => ({ ...prev, buttonClick: prev.buttonClick + 1 }));
    generateFortune();
  };

  const handleMusicPlay = () => {
    setSoundTriggers(prev => ({ ...prev, musicPlay: prev.musicPlay + 1 }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <ParticleSystem />

      <CosmicJourney 
        isActive={isJourneyMode} 
        onToggle={() => setIsJourneyMode(!isJourneyMode)} 
      />
      <SoundEffects 
        onButtonClick={soundTriggers.buttonClick}
        onFortuneGenerate={soundTriggers.fortuneGenerate}
        onMusicPlay={soundTriggers.musicPlay}
      />
      
      <div className={`relative z-10 container mx-auto px-4 py-8 transition-all duration-1000 ${
        isJourneyMode ? 'transform rotate-1 scale-105' : ''
      }`}>
        <header className="text-center mb-8">
          <h1 className="font-orbitron text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4 animate-pulse">
            Cosmic Fortune Tunes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Where the mysteries of the universe become your personal soundtrack
          </p>
          
          {/* Weather forecast */}
          <div className="max-w-md mx-auto mb-8">
            <WeatherForecast />
          </div>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Button
              onClick={handleButtonClick}
              disabled={isLoading}
              size="lg"
              className="cosmic-glow font-orbitron text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 hover:scale-110 transform"
            >
              <Sparkles className="mr-2" />
              {isLoading ? 'Consulting the Cosmos...' : 'Generate Cosmic Fortune'}
            </Button>
          </div>

          {fortune && (
            <>
              <FortuneCard fortune={fortune} spaceData={spaceData} />
              <div className="flex flex-col items-center space-y-6">
                <MusicPlayer spaceData={spaceData} onPlay={handleMusicPlay} />
                <ActionButtons 
                  onNewFortune={handleButtonClick} 
                  spaceData={spaceData}
                  fortune={fortune}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
