import React, { useState, useRef } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';

type Props = {
  src: string;
};

const AudioPlayer = ({ src }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div style={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={48}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
        <IconButton onClick={togglePlay}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
      </div>
    </div>
  );
};

export default AudioPlayer;
