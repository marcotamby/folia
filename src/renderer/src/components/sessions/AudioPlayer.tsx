import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Gauge
} from 'lucide-react';
import { SessionMarker } from '../../types';

interface AudioPlayerProps {
  audioFilePath: string;
  duration?: number;
  markers?: SessionMarker[];
  onSeekToTime?: (seconds: number) => void;
  onAddMarkerAtCurrentTime?: (seconds: number) => void;
  selectedMarkerId?: string | null;
}

export const formatDuration = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFilePath,
  duration = 0,
  markers = [],
  onAddMarkerAtCurrentTime,
  selectedMarkerId
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<SessionMarker | null>(null);
  const [mediaSrc, setMediaSrc] = useState<string>('');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsPlaying(false);
    setCurrentTime(0);
    setHasLoadError(false);
    setIsLoadingAudio(true);

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackRate;
    }

    const loadAudioSource = async () => {
      // 1. Try reading the file directly as an ArrayBuffer and create a Blob URL
      // This is the most reliable method across all Windows paths and special characters
      if ((window as any).foliaAPI?.readRecordingBuffer) {
        try {
          const res = await (window as any).foliaAPI.readRecordingBuffer(audioFilePath);
          if (!active) return;
          if (res?.success && res?.buffer) {
            const ext = audioFilePath.toLowerCase();
            const mime = ext.endsWith('.wav') ? 'audio/wav' : ext.endsWith('.mp3') ? 'audio/mpeg' : 'audio/webm';
            const blob = new Blob([res.buffer], { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            blobUrlRef.current = blobUrl;
            setMediaSrc(blobUrl);
            setIsLoadingAudio(false);
            return;
          }
        } catch (err) {
          console.warn('readRecordingBuffer failed, falling back to protocol URL:', err);
        }
      }

      // 2. Fallback to folia-media protocol URL
      if (!active) return;
      const protoUrl = (window as any).foliaAPI?.getMediaUrl
        ? (window as any).foliaAPI.getMediaUrl(audioFilePath)
        : audioFilePath;
      setMediaSrc(protoUrl);
      setIsLoadingAudio(false);
    };

    loadAudioSource();

    return () => {
      active = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [audioFilePath]);

  useEffect(() => {
    if (duration > 0) {
      setAudioDuration(duration);
    }
  }, [duration]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasLoadError(false);
      } catch (err) {
        console.error('Audio playback failed:', err);
        // Fallback: if not currently playing from a blob URL, attempt buffer load now
        if (!mediaSrc.startsWith('blob:') && (window as any).foliaAPI?.readRecordingBuffer) {
          try {
            const res = await (window as any).foliaAPI.readRecordingBuffer(audioFilePath);
            if (res?.success && res?.buffer) {
              const blob = new Blob([res.buffer], { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
              blobUrlRef.current = url;
              setMediaSrc(url);
              if (audioRef.current) {
                audioRef.current.src = url;
                await audioRef.current.play();
                setIsPlaying(true);
                setHasLoadError(false);
                return;
              }
            }
          } catch (fallbackErr) {
            console.error('Fallback buffer playback failed:', fallbackErr);
          }
        }
        setHasLoadError(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (dur && !isNaN(dur) && dur !== Infinity && dur > 0) {
        setAudioDuration(dur);
      } else if (duration > 0) {
        setAudioDuration(duration);
      }
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleSkip = (delta: number) => {
    if (!audioRef.current) return;
    const maxDur = audioDuration || duration || 0;
    const nextTime = Math.max(0, Math.min(maxDur, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const seekToExactSeconds = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasLoadError(false);
      }).catch(() => {});
    }
  }, [isPlaying]);

  // Expose seeking function on window or via ref if needed
  useEffect(() => {
    (window as any)._foliaPlayerSeek = seekToExactSeconds;
    return () => {
      delete (window as any)._foliaPlayerSeek;
    };
  }, [seekToExactSeconds]);

  const effectiveDuration = audioDuration || duration || 1;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  return (
    <div className="bg-paper-50 border border-paper-300 rounded-2xl p-4 shadow-sm select-none">
      <audio
        ref={audioRef}
        src={mediaSrc}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setIsPlaying(true);
          setHasLoadError(false);
        }}
        onError={async (e) => {
          console.warn('Audio tag error, attempting buffer fallback:', e);
          if (!mediaSrc.startsWith('blob:') && (window as any).foliaAPI?.readRecordingBuffer) {
            try {
              const res = await (window as any).foliaAPI.readRecordingBuffer(audioFilePath);
              if (res?.success && res?.buffer) {
                const blob = new Blob([res.buffer], { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = url;
                setMediaSrc(url);
                return;
              }
            } catch (err) {}
          }
          setHasLoadError(true);
        }}
      />

      {/* Progress Bar with Marker Pins */}
      <div className="relative mb-3 group/track">
        {/* Custom Progress Track */}
        <div className="relative h-2 w-full bg-paper-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-folia-600 rounded-full transition-[width] duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Interactive Native Range Input (Transparent overlay for precision seeking) */}
        <input
          type="range"
          min="0"
          max={effectiveDuration}
          step="0.1"
          value={currentTime}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={() => setIsSeeking(false)}
          onChange={handleSeekChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-20"
        />

        {/* Visual Marker Pins on Timeline */}
        {markers.map((marker) => {
          const markerPercent = Math.min(100, Math.max(0, (marker.timestamp / effectiveDuration) * 100));
          const isSelected = marker.id === selectedMarkerId;
          return (
            <div
              key={marker.id}
              onClick={(e) => {
                e.stopPropagation();
                seekToExactSeconds(marker.timestamp);
              }}
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
              style={{ left: `${markerPercent}%` }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-2.5 h-2.5 rounded-full cursor-pointer transition-transform hover:scale-150 shadow-xs ${
                isSelected 
                  ? 'bg-amber-500 ring-2 ring-amber-300 scale-125' 
                  : 'bg-folia-800 ring-1 ring-white hover:bg-amber-600'
              }`}
            />
          );
        })}

        {/* Marker Hover Tooltip */}
        {hoveredMarker && (
          <div 
            style={{ 
              left: `${Math.min(90, Math.max(10, (hoveredMarker.timestamp / effectiveDuration) * 100))}%` 
            }}
            className="absolute bottom-4 -translate-x-1/2 z-30 bg-paper-900 text-paper-50 text-[11px] px-2 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
          >
            <span className="text-amber-400 font-mono mr-1">[{formatDuration(hoveredMarker.timestamp)}]</span>
            <span className="font-medium">{hoveredMarker.label}</span>
          </div>
        )}
      </div>

      {/* Controls & Times */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          {/* Skip -15s */}
          <button
            onClick={() => handleSkip(-15)}
            title="Indietro di 15 secondi"
            className="p-1.5 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            disabled={isLoadingAudio}
            title={hasLoadError ? 'Errore di riproduzione - Clicca per riprovare' : isPlaying ? 'Pausa' : 'Riproduci'}
            className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
              hasLoadError 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-folia-700 hover:bg-folia-800'
            } ${isLoadingAudio ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Skip +15s */}
          <button
            onClick={() => handleSkip(15)}
            title="Avanti di 15 secondi"
            className="p-1.5 rounded-lg text-paper-600 hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Current Time / Total Duration */}
          <div className="text-xs font-mono text-paper-700 ml-1 select-text">
            <span className="font-semibold text-paper-900">{formatDuration(currentTime)}</span>
            <span className="text-paper-400 mx-1">/</span>
            <span>{formatDuration(effectiveDuration)}</span>
          </div>
        </div>

        {/* Right: Rate, Volume, Add Marker */}
        <div className="flex items-center gap-2">
          {/* Add Marker at current playhead */}
          {onAddMarkerAtCurrentTime && (
            <button
              onClick={() => onAddMarkerAtCurrentTime(currentTime)}
              title="Aggiungi segnalibro al punto attuale"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors font-medium cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span className="hidden sm:inline">Segnalibro</span>
            </button>
          )}

          {/* Speed Selector */}
          <button
            onClick={cyclePlaybackRate}
            title="Velocità di riproduzione"
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg text-paper-700 hover:bg-paper-200 font-mono font-medium transition-colors cursor-pointer border border-paper-200"
          >
            <Gauge className="w-3.5 h-3.5 text-paper-500" />
            <span>{playbackRate.toFixed(2).replace(/\.00$/, '')}x</span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1 text-paper-600">
            <button 
              onClick={toggleMute}
              title={isMuted ? 'Riattiva audio' : 'Disattiva audio'}
              className="p-1.5 rounded-lg hover:text-paper-900 hover:bg-paper-200 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-paper-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              title="Volume"
              className="w-16 h-1.5 accent-folia-700 bg-paper-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
