import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { storage } from './src/storage';
import { MainNavigator } from './src/navigation/MainNavigator';
import { PinScreen } from './src/screens/PinScreen';

export default function App() {
  const [pin, setPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const load = async () => {
      const d = await storage.loadData();
      setPin(d.settings.pin ?? null);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return null;
  }

  if (pin && !unlocked) {
    return (
      <PinScreen pin={pin} mode="verify" onUnlock={() => setUnlocked(true)} />
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <MainNavigator />
    </>
  );
}