
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export interface ConnectedDomain {
  name: string;
  connectedAt: string;
}

interface DomainContextType {
  domains: ConnectedDomain[];
  addDomain: (name: string) => void;
  removeDomain: (name: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<ConnectedDomain[]>([]);
  
  // Create a user-specific key for local storage
  const userStorageKey = user ? `connectedDomains_${user.uid}` : null;

  // Load domains from local storage when the user changes
  useEffect(() => {
    if (userStorageKey) {
      try {
        const item = window.localStorage.getItem(userStorageKey);
        setDomains(item ? JSON.parse(item) : []);
      } catch (error) {
        console.error("Failed to read domains from localStorage.", error);
        setDomains([]);
      }
    } else {
      // If there's no user, clear the domains list
      setDomains([]);
    }
  }, [userStorageKey]);

  // Save domains to local storage whenever they change
  useEffect(() => {
    if (userStorageKey) {
      try {
        window.localStorage.setItem(userStorageKey, JSON.stringify(domains));
      } catch (error) {
        console.error("Failed to write domains to localStorage", error);
      }
    }
  }, [domains, userStorageKey]);

  const addDomain = useCallback((name: string) => {
    setDomains(prev => {
      if (!name || prev.some(d => d.name === name)) return prev;
      const newDomain: ConnectedDomain = {
        name,
        connectedAt: new Date().toISOString(),
      };
      return [newDomain, ...prev];
    });
  }, []);
  
  const removeDomain = useCallback((name: string) => {
    setDomains(prev => prev.filter(d => d.name !== name));
  }, []);

  const value = { domains, addDomain, removeDomain };

  return (
    <DomainContext.Provider value={value}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomains = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomains must be used within a DomainProvider');
  }
  return context;
};
