import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, RotateCcw, Shuffle } from 'lucide-react';
import * as Tone from 'tone';

interface MusicPlayerProps {
  spaceData?: any;
  onPlay?: () => void;
}

const MusicPlayer = ({ spaceData, onPlay }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMelody, setCurrentMelody] = useState<any[]>([]);
  const [dataMapping, setDataMapping] = useState<any>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const generateMelodyFromData = (isRemix = false) => {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    const rhythms = ['8n', '4n', '4n.', '2n'];
    
    let melody = [];
    let mapping = {
      title: spaceData?.title || 'Cosmic Default',
      dataPoints: [],
      musicalElements: {
        scale: 'C Major',
        tempo: 80,
        rhythm: 'Standard 4/4'
      }
    };
    
    if (spaceData?.title) {
      const titleLength = spaceData.title.length;
      const charSum = spaceData.title.split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
      const dateValue = spaceData.date ? new Date(spaceData.date).getTime() : Date.now();
      
      // Map data to musical elements
      mapping.musicalElements.tempo = Math.max(60, Math.min(120, 60 + (titleLength * 2)));
      
      for (let i = 0; i < 12; i++) {
        const baseNoteIndex = isRemix 
          ? (charSum + i * titleLength + Math.floor(Math.random() * 4)) % notes.length
          : (charSum + i * titleLength) % notes.length;
        
        const rhythmIndex = isRemix 
          ? Math.floor(Math.random() * rhythms.length)
          : i % rhythms.length;
        
        const note = notes[baseNoteIndex];
        const duration = rhythms[rhythmIndex];
        
        melody.push({ note, duration });
        
        mapping.dataPoints.push({
          dataValue: spaceData.title.charAt(i % titleLength),
          musicalNote: note,
          explanation: `Character "${spaceData.title.charAt(i % titleLength)}" (ASCII: ${spaceData.title.charCodeAt(i % titleLength)}) → ${note}`
        });
      }
      
      if (spaceData.explanation) {
        const wordCount = spaceData.explanation.split(' ').length;
        mapping.musicalElements.tempo = Math.max(70, Math.min(100, wordCount));
        mapping.dataPoints.push({
          dataValue: `${wordCount} words in explanation`,
          musicalNote: 'Tempo',
          explanation: `Word count ${wordCount} → ${mapping.musicalElements.tempo} BPM`
        });
      }
      
    } else {
      // Fallback cosmic melody
      melody = [
        { note: 'C4', duration: '4n' },
        { note: 'E4', duration: '4n' },
        { note: 'G4', duration: '4n' },
        { note: 'C5', duration: '2n' },
        { note: 'A4', duration: '4n' },
        { note: 'F4', duration: '4n' },
        { note: 'D4', duration: '4n' },
        { note: 'C4', duration: '2n' }
      ];
    }
    
    setCurrentMelody(melody);
    setDataMapping(mapping);
    return melody;
  };

  const playMelody = async (isRemix = false) => {
    setIsLoading(true);
    
    // Trigger sound effect
    if (onPlay) {
      onPlay();
    }
    
    try {
      await Tone.start();
      
      // Stop existing sequence if playing
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      
      // Create a new synth with cosmic sound
      synthRef.current = new Tone.Synth({
        oscillator: {
          type: 'triangle'
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.7,
          release: 1.2
        }
      }).toDestination();

      // Add reverb for spacey effect
      const reverb = new Tone.Reverb(2.5).toDestination();
      synthRef.current.connect(reverb);

      const melody = generateMelodyFromData(isRemix);
      
      sequenceRef.current = new Tone.Sequence((time, note) => {
        synthRef.current?.triggerAttackRelease(note.note, note.duration, time);
        
        // Animate visualizer
        if (visualizerRef.current) {
          const bars = visualizerRef.current.querySelectorAll('.visualizer-bar');
          bars.forEach((bar, index) => {
            if (bar instanceof HTMLElement) {
              const randomHeight = Math.random() * 30 + 10;
              bar.style.height = `${randomHeight}px`;
              bar.style.opacity = '1';
            }
          });
        }
      }, melody.map(m => m), '4n');

      const tempo = dataMapping?.musicalElements?.tempo || 80;
      Tone.Transport.bpm.value = tempo;
      sequenceRef.current.start();
      Tone.Transport.start();
      
      setIsPlaying(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error playing melody:', error);
      setIsLoading(false);
    }
  };

  const stopMelody = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.dispose();
      synthRef.current = null;
    }
    Tone.Transport.stop();
    setIsPlaying(false);
    
    // Reset visualizer
    if (visualizerRef.current) {
      const bars = visualizerRef.current.querySelectorAll('.visualizer-bar');
      bars.forEach((bar) => {
        if (bar instanceof HTMLElement) {
          bar.style.height = '8px';
          bar.style.opacity = '0.6';
        }
      });
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopMelody();
    } else {
      playMelody(false);
    }
  };

  const handleRemix = () => {
    playMelody(true);
  };

  return (
    <div className="space-y-4 card-width">
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-card/50 to-muted/30 rounded-xl border border-primary/20 backdrop-blur-sm">
        <Button
          onClick={handlePlayPause}
          disabled={isLoading}
          size="lg"
          className="cosmic-glow bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary"
        >
          {isLoading ? (
            <RotateCcw className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-1" />
          )}
        </Button>
        
        <Button
          onClick={handleRemix}
          disabled={isLoading}
          size="lg"
          className="cosmic-glow bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
        >
          <Shuffle className="w-5 h-5" />
          Remix
        </Button>
        
        <div className="flex-1">
          <h3 className="font-orbitron text-lg font-semibold flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-primary" />
            Cosmic Sonification
          </h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Generating cosmic melody...' : 
             isPlaying ? 'Playing your fortune tune...' : 
             'Click to hear your space data as music'}
          </p>
        </div>
        
        {/* Enhanced Audio visualizer */}
        <div ref={visualizerRef} className="flex space-x-1 items-end">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`visualizer-bar w-2 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300`}
              style={{
                height: '8px',
                opacity: isPlaying ? '1' : '0.6',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Data Mapping Display */}
      {dataMapping && (
        <div className="p-4 bg-gradient-to-r from-muted/20 to-card/20 rounded-lg border border-accent/20">
          <h4 className="font-orbitron text-md font-semibold mb-3 text-accent">
            🎵 Data → Music Mapping
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-primary">Musical Elements:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Scale: {dataMapping.musicalElements.scale}</li>
                <li>Tempo: {dataMapping.musicalElements.tempo} BPM</li>
                <li>Rhythm: {dataMapping.musicalElements.rhythm}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-primary">Data Points:</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {dataMapping.dataPoints.slice(0, 4).map((point: any, index: number) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {point.explanation}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
