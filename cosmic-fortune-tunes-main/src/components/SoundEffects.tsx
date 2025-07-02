
import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface SoundEffectsProps {
  onButtonClick?: number;
  onFortuneGenerate?: number;
  onMusicPlay?: number;
}

const SoundEffects = ({ onButtonClick, onFortuneGenerate, onMusicPlay }: SoundEffectsProps) => {
  const synthRef = useRef<Tone.Synth | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const initializeSynth = async () => {
      if (!initialized.current) {
        await Tone.start();
        synthRef.current = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 0.4 }
        }).toDestination();
        initialized.current = true;
      }
    };

    initializeSynth();

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const playButtonSound = () => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease('C5', '8n');
    }
  };

  const playFortuneSound = () => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease('E5', '4n');
      setTimeout(() => synthRef.current?.triggerAttackRelease('G5', '8n'), 200);
    }
  };

  const playMusicSound = () => {
    if (synthRef.current) {
      const notes = ['C4', 'E4', 'G4'];
      notes.forEach((note, index) => {
        setTimeout(() => synthRef.current?.triggerAttackRelease(note, '8n'), index * 100);
      });
    }
  };

  useEffect(() => {
    if (onButtonClick && onButtonClick > 0) {
      playButtonSound();
    }
  }, [onButtonClick]);

  useEffect(() => {
    if (onFortuneGenerate && onFortuneGenerate > 0) {
      playFortuneSound();
    }
  }, [onFortuneGenerate]);

  useEffect(() => {
    if (onMusicPlay && onMusicPlay > 0) {
      playMusicSound();
    }
  }, [onMusicPlay]);

  return null;
};

export default SoundEffects;
