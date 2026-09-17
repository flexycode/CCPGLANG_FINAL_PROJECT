/**
 * useServerTime.ts — Real-Time Philippine Clock Hook (WorldTimeAPI + Asia/Manila)
 * ================================================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Synchronizes the frontend clock with the backend's WorldTimeAPI-sourced
 * Philippine Standard Time (PHT, UTC+8). Provides:
 * - Live ticking clock with seconds (updates every second)
 * - Formatted date for the topbar display
 * - Active class period label
 * 
 * Demonstrates:
 * - Pure functions for date/time formatting
 * - Immutable state updates via React useState & useEffect
 * - Server drift offset calculation for millisecond accuracy
 */

import { useState, useEffect, useRef } from 'react';

export interface ServerTimeState {
  readonly formattedDate: string;
  readonly formattedTime: string;
  readonly activePeriod: string;
  readonly timezone: string;
  readonly isLive: boolean;
}

/**
 * Format a Date as a display-friendly date string.
 * Uses Philippine locale conventions.
 * e.g., "Thursday, September 17"
 */
const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a Date as a live clock string with seconds.
 * e.g., "3:45:22 PM"
 */
const formatDisplayTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Calculate the active class period based on the current hour.
 * Matches the university scheduling blocks from the Figma design.
 */
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
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [activePeriod, setActivePeriod] = useState<string>('3:00 PM - 5:00 PM');
  const [timezoneLabel, setTimezoneLabel] = useState<string>('PHT');
  const [isLive, setIsLive] = useState<boolean>(false);
  const offsetRef = useRef<number>(0);

  // Sync with backend on mount (backend fetches from WorldTimeAPI/Asia/Manila)
  useEffect(() => {
    let isMounted = true;

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
            offsetRef.current = calculatedOffset;
            setActivePeriod(data.active_period || calculateActivePeriod(new Date(serverTimeWithLatency)));
            setTimezoneLabel(data.timezone === 'Asia/Manila' ? 'PHT' : data.timezone);
            setIsLive(true);
          }
        }
      } catch (err) {
        console.warn('Real-time server sync fell back to local system clock:', err);
      }
    };

    syncWithServer();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tick every second using the synced offset
  useEffect(() => {
    const intervalId = setInterval(() => {
      const corrected = new Date(Date.now() + offsetRef.current);
      setCurrentTime(corrected);
      setActivePeriod(calculateActivePeriod(corrected));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return {
    formattedDate: formatDisplayDate(currentTime),
    formattedTime: formatDisplayTime(currentTime),
    activePeriod: activePeriod,
    timezone: timezoneLabel,
    isLive: isLive,
  };
};
