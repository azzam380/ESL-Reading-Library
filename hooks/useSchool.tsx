'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { SchoolConfig } from '../types/school';
import { useAuth } from './useAuth';

interface SchoolContextType {
  schoolId: string | null;
  config: SchoolConfig | null;
  loading: boolean;
  error: string | null;
  setManualSchoolId: (id: string | null) => void;
}

const SchoolContext = createContext<SchoolContextType>({
  schoolId: null,
  config: null,
  loading: true,
  error: null,
  setManualSchoolId: () => {},
});

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { schoolId: authSchoolId } = useAuth();
  const [config, setConfig] = useState<SchoolConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Supports manual selection for platform super-admins or initial setup
  const [manualSchoolId, setManualSchoolId] = useState<string | null>(null);

  const activeSchoolId = manualSchoolId || authSchoolId;

  useEffect(() => {
    if (!activeSchoolId) {
      setLoading(false);
      setConfig(null);
      return;
    }

    const fetchSchoolConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const schoolDocRef = doc(db, 'schools', activeSchoolId);
        const docSnap = await getDoc(schoolDocRef);
        
        if (docSnap.exists()) {
          const schoolData = docSnap.data() as SchoolConfig;
          setConfig(schoolData);

          // Premium UX feature: dynamically inject tenant-specific HSL primary/secondary colors
          const primaryColor = schoolData.branding?.primaryColor || '215 80% 50%'; // Raw HSL values e.g. "215 80% 50%"
          const secondaryColor = schoolData.branding?.secondaryColor || '280 80% 50%';
          
          document.documentElement.style.setProperty('--school-primary', primaryColor);
          document.documentElement.style.setProperty('--school-secondary', secondaryColor);
        } else {
          // If building or placeholder local sandbox
          setConfig({
            schoolId: activeSchoolId,
            name: activeSchoolId === 'AAR' ? 'Al-Ameen Academy' : 'British International School',
            branding: {
              primaryColor: activeSchoolId === 'AAR' ? '142 70% 45%' : '215 80% 50%',
              secondaryColor: activeSchoolId === 'AAR' ? '160 80% 40%' : '280 80% 50%',
            },
            studentSequenceCounter: 14,
            terms: [],
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        console.error('Error fetching school config:', err);
        setError(err.message || 'Failed to fetch school configurations');
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolConfig();
  }, [activeSchoolId]);

  return (
    <SchoolContext.Provider 
      value={{ 
        schoolId: activeSchoolId, 
        config, 
        loading, 
        error, 
        setManualSchoolId 
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => useContext(SchoolContext);
export default useSchool;
