import React, { createContext, useContext, useState } from 'react';
import { UserRole, Student, Faculty } from '../types';
import { mockStudents, mockFaculty } from '../data/mockData';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  currentStudent: Student;
  currentFaculty: Faculty;
  notificationsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
  selectedAttemptId: string | null;
  setSelectedAttemptId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('public');
  const [activeScreen, setActiveScreen] = useState<string>('landing');
  const [currentStudent] = useState<Student>(mockStudents[0]);
  const [currentFaculty] = useState<Faculty>(mockFaculty);
  const [notificationsCount] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>('sess_1001');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>('VATT-2026-981');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'public') setActiveScreen('landing');
    else if (newRole === 'student') setActiveScreen('student-dashboard');
    else if (newRole === 'faculty') setActiveScreen('faculty-dashboard');
    else if (newRole === 'admin') setActiveScreen('admin-dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        activeScreen,
        setActiveScreen,
        currentStudent,
        currentFaculty,
        notificationsCount,
        searchQuery,
        setSearchQuery,
        selectedSessionId,
        setSelectedSessionId,
        selectedAttemptId,
        setSelectedAttemptId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
