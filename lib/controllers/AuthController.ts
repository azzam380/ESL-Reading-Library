import { useState, useEffect } from 'react';
import { AuthService } from '../usecases/AuthService';
import { FirestoreStudentRepository } from '../data/FirestoreStudentRepository';
import { useRouter } from 'next/navigation';

export interface UseAuthControllerReturn {
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  error: string | null;
  detectedSchoolId: 'AAR' | 'BIS' | null;
  submitLogin: (e: React.FormEvent) => Promise<void>;
}

export function useAuthController(): UseAuthControllerReturn {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSchoolId, setDetectedSchoolId] = useState<'AAR' | 'BIS' | null>(null);

  // Instantiating concrete layers inside the controller factory scope
  const studentRepo = new FirestoreStudentRepository();
  const authService = new AuthService(studentRepo);

  // Brand-shifting Scanner: Automatically parses the text as it is entered
  useEffect(() => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setDetectedSchoolId(null);
      return;
    }

    // A: Check if it's a Student ID prefix
    if (!trimmed.includes('@')) {
      const prefix = trimmed.split('-')[0].toUpperCase();
      if (prefix === 'AAR' || prefix === 'BIS') {
        setDetectedSchoolId(prefix);
        return;
      }
    }

    // B: Check if it's a staff email domain
    if (trimmed.includes('@')) {
      if (trimmed.toLowerCase().includes('bis')) {
        setDetectedSchoolId('BIS');
      } else {
        setDetectedSchoolId('AAR'); // Default to Al-Ameen for staff emails if generic
      }
      return;
    }

    setDetectedSchoolId(null);
  }, [identifier]);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(identifier, password);
      
      // Save authenticated session details in session storage for demo simplicity
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pell_session', JSON.stringify({
          user: result.user,
          type: result.type,
          schoolId: result.user.schoolId
        }));
      }

      // Dynamic routing based on the resolved user role and type
      if (result.type === 'staff') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    isLoading,
    error,
    detectedSchoolId,
    submitLogin
  };
}
