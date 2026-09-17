/**
 * useServerTime.ts — Real-Time Server Date & Time Hook
 * ====================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Demonstrates:
 * - Pure functions for date/time formatting
 * - Immutable state updates via React useState & useEffect
 * - Server drift offset calculation for millisecond accuracy
 */

import { useState, useEffect } from 'react';

export interface ServerTimeState {
  readonly formattedDate: string;
  readonly formattedTime: string;
  readonly activePeriod: string;
  readonly isLive: boolean;
}

const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const formatDisplayTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const calculateActivePeriod = (date: Date): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (hour === 7 || (hour === 8) || (hour === 9 && minute < 30)) {
    return '7:30 AM - 9:30 AM';
  } else if (hour === 9 || hour === 10 || (hour === 11 && minute < 30)) {
    return '9:30 AM - 11:30 AM';
  } else if (hour === 11 || hour === 12 || (hour === 13 && minute < 30)) {
    return '11:30 AM - 1:30 PM';
  } else if (hour >= 13 && hour < 15) {
    return '1:30 PM - 3:00 PM';
  } else if (hour >= 15 && hour < 17) {
    return '3:00 PM - 5:00 PM';
  } else if (hour >= 17 && hour < 19) {
    return '5:00 PM - 7:00 PM';
  } else {
    return '3:00 PM - 5:00 PM'; // Standard academic reference period
  }
};

export const useServerTime = (): ServerTimeState => {
  const [offsetMs, setOffsetMs] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [activePeriod, setActivePeriod] = useState<string>('3:00 PM - 5:00 PM');
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Fetch initial server timestamp to calculate client-server drift offset
    const syncWithServer = async () => {
      try {
        const clientReqStart = Date.now();
        const response = await fetch('http://localhost:8000/api/system/time');
        if (response.ok) {
          const data = await response.json();
          const clientReqEnd = Date.now();
          const roundTripLatency = (clientReqEnd - clientReqStart) / 2;
          const serverTimeWithLatency = data.timestamp_ms + roundTripLatency;
          const calculatedOffset = serverTimeWithLatency - clientReqEnd;

          if (isMounted) {
            setOffsetMs(calculatedOffset);
            setActivePeriod(data.active_period || calculateActivePeriod(new Date(serverTimeWithLatency)));
            setIsLive(true);
          }
        }
      } catch (err) {
        console.warn('Real-time server sync fell back to local system clock:', err);
      }
    };

    syncWithServer();

    // Pure functional ticker: update clock every second
    const intervalId = setInterval(() => {
      setCurrentTime(() => new Date(Date.now() + offsetMs));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [offsetMs]);

  return {
    formattedDate: formatDisplayDate(currentTime),
    formattedTime: formatDisplayTime(currentTime),
    activePeriod: activePeriod,
    isLive: isLive,
  };
};
