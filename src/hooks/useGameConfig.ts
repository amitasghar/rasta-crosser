import { useState, useEffect } from 'react';
import { GameConfig } from '../types/game';

export const useGameConfig = () => {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/gameConfig.json');

        if (!response.ok) {
          throw new Error(`Failed to load game config: ${response.statusText}`);
        }

        const config: GameConfig = await response.json();
        setGameConfig(config);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading config');
        setGameConfig(null);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { gameConfig, loading, error };
};