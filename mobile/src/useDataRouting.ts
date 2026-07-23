import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { DashboardData } from './models';
import { mockProgressData } from './models';

const STORAGE_KEY = '@dashboard_data';

export const useDataRouting = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    const fetchData = async () => {
      const netInfo = await NetInfo.fetch();
      const offline = !netInfo.isConnected;
      setIsOffline(offline);

      if (offline) {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          setData(JSON.parse(cached));
        } else {
          setData(mockProgressData);
        }
      } else {
        const apiData = mockProgressData;
        setData(apiData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
      }
    };

    fetchData();

    return () => unsubscribe();
  }, []);

  return { data, isOffline };
};
