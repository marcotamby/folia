import { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface UseAutosaveProps {
  project: Project;
  onSave: (project: Project) => Promise<void>;
  intervalSeconds?: number;
}

export function useAutosave({ project, onSave, intervalSeconds = 120 }: UseAutosaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(new Date());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(intervalSeconds);
  const projectRef = useRef<Project>(project);
  const isDirtyRef = useRef<boolean>(false);

  // Keep ref updated
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Mark dirty on project changes
  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
    setSaveStatus('unsaved');
  }, []);

  // Clear dirty state
  const clearDirty = useCallback(() => {
    isDirtyRef.current = false;
    setSaveStatus('saved');
    setLastSavedTime(new Date());
    setSecondsRemaining(intervalSeconds);
  }, [intervalSeconds]);

  // Perform save
  const performSave = useCallback(async () => {
    if (saveStatus === 'saving') return;
    try {
      setSaveStatus('saving');
      await onSave(projectRef.current);
      clearDirty();
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveStatus('unsaved');
    }
  }, [onSave, saveStatus, clearDirty]);

  // 2-minute timer loop & countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Trigger autosave if dirty
          if (isDirtyRef.current) {
            performSave();
          }
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [performSave, intervalSeconds]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        performSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performSave]);

  return {
    saveStatus,
    lastSavedTime,
    secondsRemaining,
    performSave,
    markDirty,
    clearDirty,
    isDirty: isDirtyRef.current || saveStatus === 'unsaved'
  };
}
