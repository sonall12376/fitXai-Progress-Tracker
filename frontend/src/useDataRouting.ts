import { useState, useEffect } from 'react';
import type { DashboardData } from './models';
import { mockProgressData } from './mockProgressData';

const DB_NAME = 'FitAI_DB';
const STORE_NAME = 'DashboardCache';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const useDataRouting = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchData = async () => {
      const db = await initDB();
      if (!navigator.onLine) {
        // Fetch from IndexedDB
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get('dashboard_data');
        request.onsuccess = () => {
          if (request.result) setData(request.result.data);
          else setData(mockProgressData); // Fallback
        };
      } else {
        // Simulate API Fetch and store to IndexedDB
        const apiData = mockProgressData;
        setData(apiData);
        
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put({ id: 'dashboard_data', data: apiData, lastUpdated: new Date() });
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline]);

  return { data, isOffline };
};
