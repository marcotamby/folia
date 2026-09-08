import { useState, useRef, useCallback, useEffect } from 'react';
import { SessionMarker } from '../types';

export interface SavedRecordingResult {
  filePath: string;
  fileSizeBytes: number;
  duration: number;
  markers: SessionMarker[];
}

export type MicPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unknown';

export function useAudioRecorder(enabled: boolean = false) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [markers, setMarkers] = useState<SessionMarker[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Microphone device enumeration & state
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string>(() => {
    return localStorage.getItem('folia_preferred_mic_id') || 'default';
  });
  const [isCheckingDevices, setIsCheckingDevices] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<MicPermissionStatus>('unknown');
  const [isTestingMic, setIsTestingMic] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentDurationRef = useRef<number>(0);
  const currentMarkersRef = useRef<SessionMarker[]>([]);

  // Test stream refs
  const testStreamRef = useRef<MediaStream | null>(null);
  const testAudioCtxRef = useRef<AudioContext | null>(null);
  const testAnalyserRef = useRef<AnalyserNode | null>(null);
  const testAnimFrameRef = useRef<number | null>(null);

  // Keep ref synchronized with state
  useEffect(() => {
    currentDurationRef.current = recordingSeconds;
  }, [recordingSeconds]);

  useEffect(() => {
    currentMarkersRef.current = markers;
  }, [markers]);

  const setSelectedDeviceId = useCallback((deviceId: string) => {
    setSelectedDeviceIdState(deviceId);
    try {
      localStorage.setItem('folia_preferred_mic_id', deviceId);
    } catch (e) {}
  }, []);

  // Refresh and list audio input devices
  const refreshDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setAudioDevices([]);
      return [];
    }

    setIsCheckingDevices(true);
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const inputDevices = allDevices.filter(d => d.kind === 'audioinput');
      setAudioDevices(inputDevices);

      // Check if current selected device is still available
      if (inputDevices.length > 0) {
        // If device has a label, permission was granted at least once
        if (inputDevices.some(d => d.label)) {
          setPermissionStatus('granted');
        }
        const exists = inputDevices.some(d => d.deviceId === selectedDeviceId);
        if (!exists && selectedDeviceId !== 'default') {
          setSelectedDeviceId(inputDevices[0].deviceId || 'default');
        }
      } else {
        setPermissionStatus('unknown');
      }

      return inputDevices;
    } catch (err) {
      console.warn('Could not enumerate audio devices:', err);
      setAudioDevices([]);
      return [];
    } finally {
      setIsCheckingDevices(false);
    }
  }, [selectedDeviceId, setSelectedDeviceId]);

  // Devices scan and listener for device plug/unplug (only active when enabled)
  useEffect(() => {
    if (!enabled) return undefined;

    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      };
    }
    return undefined;
  }, [enabled, refreshDevices]);

  // Audio analyser loop for live microphone level (RMS)
  const updateAudioLevel = useCallback(() => {
    const analyser = analyserRef.current || testAnalyserRef.current;
    if (!analyser || (!isRecording && !isTestingMic) || isPaused) {
      setAudioLevel(0);
      return;
    }
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    // Scale 0-100
    const level = Math.min(100, Math.round((average / 128) * 100));
    setAudioLevel(level);

    animFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [isRecording, isTestingMic, isPaused]);

  useEffect(() => {
    if ((isRecording && !isPaused) || isTestingMic) {
      animFrameRef.current = requestAnimationFrame(updateAudioLevel);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAudioLevel(0);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording, isTestingMic, isPaused, updateAudioLevel]);

  // Cleanup helper for recording
  const cleanupAudio = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    setAudioLevel(0);
  }, []);

  // Cleanup helper for mic test
  const stopMicTest = useCallback(() => {
    if (testAnimFrameRef.current) {
      cancelAnimationFrame(testAnimFrameRef.current);
      testAnimFrameRef.current = null;
    }
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach(track => track.stop());
      testStreamRef.current = null;
    }
    if (testAudioCtxRef.current && testAudioCtxRef.current.state !== 'closed') {
      try {
        testAudioCtxRef.current.close();
      } catch (e) {}
      testAudioCtxRef.current = null;
    }
    testAnalyserRef.current = null;
    setIsTestingMic(false);
    setAudioLevel(0);
  }, []);

  // Start temporary mic test to verify audio input and vu meter
  const startMicTest = useCallback(async (deviceIdOverride?: string): Promise<{ success: boolean; error?: string }> => {
    stopMicTest();
    setError(null);

    const devId = deviceIdOverride || (selectedDeviceId !== 'default' ? selectedDeviceId : undefined);
    const constraints: MediaStreamConstraints = {
      audio: devId
        ? { deviceId: { exact: devId }, echoCancellation: true, noiseSuppression: true }
        : { echoCancellation: true, noiseSuppression: true }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      testStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      testAudioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      testAnalyserRef.current = analyser;

      setIsTestingMic(true);
      setPermissionStatus('granted');
      refreshDevices();
      return { success: true };
    } catch (err: any) {
      console.error('Microphone test failed:', err);
      let message = 'Impossibile accedere al microfono per il test.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Accesso al microfono negato dalle impostazioni di Windows. Abilita il microfono in Privacy e sicurezza > Microfono.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Nessun microfono rilevato. Assicurati che un dispositivo di registrazione sia collegato.';
      }
      setError(message);
      return { success: false, error: message };
    }
  }, [selectedDeviceId, stopMicTest, refreshDevices]);

  // Pre-flight check to verify microphone presence and permissions
  const verifyMicrophone = useCallback(async (): Promise<{ ok: boolean; message?: string }> => {
    const devices = await refreshDevices();
    if (!devices || devices.length === 0) {
      const msg = 'Nessun dispositivo di registrazione (microfono) rilevato sul computer. Collega un microfono o cuffie per iniziare.';
      setError(msg);
      return { ok: false, message: msg };
    }
    return { ok: true };
  }, [refreshDevices]);

  // Start recording with robust error classification
  const startRecording = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // If mic test is currently running, stop it first to release the stream
    stopMicTest();

    setError(null);
    chunksRef.current = [];
    setRecordingSeconds(0);
    currentDurationRef.current = 0;
    setMarkers([]);
    currentMarkersRef.current = [];

    // Pre-flight check
    const check = await verifyMicrophone();
    if (!check.ok) {
      return { success: false, error: check.message };
    }

    try {
      const devId = selectedDeviceId && selectedDeviceId !== 'default' ? selectedDeviceId : undefined;
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };
      if (devId) {
        audioConstraints.deviceId = { exact: devId };
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      streamRef.current = stream;
      setPermissionStatus('granted');

      // Refresh devices to get complete labels if they were blank before permission
      refreshDevices();

      // Setup audio analyzer for live VU meter
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Select audio format
      let options: MediaRecorderOptions = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else {
          options = {};
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Request data in chunks of 5 seconds to minimize memory pressure
      mediaRecorder.start(5000);
      setIsRecording(true);
      setIsPaused(false);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      return { success: true };
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      let message = 'Accesso al microfono non riuscito.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Accesso al microfono negato dalle impostazioni di Windows. Vai su Impostazioni > Privacy e sicurezza > Microfono e consenti l\'accesso alle app.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Nessun dispositivo microfono trovato. Collega un microfono o verifica le periferiche audio del computer.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'Il microfono è attualmente occupato o in uso esclusivo da un\'altra applicazione.';
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      cleanupAudio();
      setIsRecording(false);
      setIsPaused(false);
      return { success: false, error: message };
    }
  }, [stopMicTest, verifyMicrophone, selectedDeviceId, refreshDevices, cleanupAudio]);

  // Pause
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
    }
  }, []);

  // Resume
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      setIsPaused(false);
    }
  }, []);

  // Add marker during recording
  const addMarker = useCallback((label: string = 'Segnalibro', notes?: string) => {
    const newMarker: SessionMarker = {
      id: 'marker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: currentDurationRef.current,
      label,
      notes
    };
    setMarkers(prev => [...prev, newMarker]);
    return newMarker;
  }, []);

  // Update existing marker during recording
  const updateMarker = useCallback((markerId: string, updates: Partial<SessionMarker>) => {
    setMarkers(prev => prev.map(m => m.id === markerId ? { ...m, ...updates } : m));
  }, []);

  // Delete marker during recording
  const deleteMarker = useCallback((markerId: string) => {
    setMarkers(prev => prev.filter(m => m.id !== markerId));
  }, []);

  // Stop recording and save to disk
  const stopRecording = useCallback(async (
    campaignTitle: string = 'Campagna D&D',
    sessionTitle?: string
  ): Promise<SavedRecordingResult | null> => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    const finalDuration = currentDurationRef.current;
    const finalMarkers = [...currentMarkersRef.current];

    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        cleanupAudio();
        setIsRecording(false);
        setIsPaused(false);
        resolve(null);
        return;
      }

      recorder.onstop = async () => {
        cleanupAudio();
        setIsRecording(false);
        setIsPaused(false);

        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const buffer = await blob.arrayBuffer();

          const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
          const safeTitle = (sessionTitle || 'Sessione').replace(/[<>:"/\\|?*]/g, '_');
          const fileName = `${safeTitle}_${timestampStr}.webm`;

          if ((window as any).foliaAPI?.saveAudioRecording) {
            const res = await (window as any).foliaAPI.saveAudioRecording(campaignTitle, fileName, buffer);
            if (res.success && res.filePath) {
              resolve({
                filePath: res.filePath,
                fileSizeBytes: res.fileSizeBytes || blob.size,
                duration: finalDuration,
                markers: finalMarkers
              });
              return;
            }
          }

          // Fallback or error
          setError('Impossibile salvare il file audio su disco');
          resolve(null);
        } catch (err: any) {
          console.error('Failed to process recorded audio:', err);
          setError(err.message || 'Errore durante il salvataggio audio');
          resolve(null);
        }
      };

      // Stop recorder
      recorder.stop();
    });
  }, [isRecording, cleanupAudio]);

  // Cancel recording without saving
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    cleanupAudio();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setMarkers([]);
  }, [cleanupAudio]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
      stopMicTest();
    };
  }, [cleanupAudio, stopMicTest]);

  return {
    isRecording,
    isPaused,
    recordingSeconds,
    audioLevel,
    markers,
    error,
    audioDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    refreshDevices,
    isCheckingDevices,
    permissionStatus,
    isTestingMic,
    startMicTest,
    stopMicTest,
    verifyMicrophone,
    clearError,
    startRecording,
    pauseRecording,
    resumeRecording,
    addMarker,
    updateMarker,
    deleteMarker,
    stopRecording,
    cancelRecording
  };
}
