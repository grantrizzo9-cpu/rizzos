'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export interface Domain {
  name: string;
  status: 'pending' | 'active' | 'error';
  websiteId: string | null; // ID of the deployed website
}

interface DomainsContextType {
  domains: Domain[];
  addDomain: (domainName: string) => void;
  updateDomainStatus: (domainName: string, status: Domain['status']) => void;
  deployWebsiteToDomain: (domainName: string, websiteId: string) => void;
  deleteDomain: (domainName: string) => void;
}

const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

export const DomainsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);

  const storageKey = user ? `domains_${user.uid}` : null;

  useEffect(() => {
    if (storageKey) {
      try {
        const item = window.localStorage.getItem(storageKey);
        if (item) {
          setDomains(JSON.parse(item));
        } else {
          setDomains([]); // Start with an empty array if nothing is in storage
        }
      } catch (error) {
        console.error("Failed to read domains from localStorage", error);
        setDomains([]);
      }
    } else {
      setDomains([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(domains));
      } catch (error) {
        console.error("Failed to write domains to localStorage", error);
      }
    }
  }, [domains, storageKey]);

  const addDomain = useCallback((domainName: string) => {
    setDomains(prev => {
      if (prev.some(d => d.name === domainName)) {
        return prev; // Domain already exists
      }
      const newDomain: Domain = {
        name: domainName,
        status: 'pending',
        websiteId: null
      };
      return [...prev, newDomain];
    });
  }, []);
  
  const updateDomainStatus = useCallback((domainName: string, status: Domain['status']) => {
      setDomains(prev => prev.map(d => d.name === domainName ? { ...d, status } : d));
  }, []);
  
  const deployWebsiteToDomain = useCallback((domainName:string, websiteId: string) => {
      setDomains(prev => prev.map(d => d.name === domainName ? { ...d, websiteId, status: 'active' } : d));
  }, []);

  const deleteDomain = useCallback((domainName: string) => {
      setDomains(prev => prev.filter(d => d.name !== domainName));
  }, []);

  const value = { domains, addDomain, updateDomainStatus, deployWebsiteToDomain, deleteDomain };

  return (
    <DomainsContext.Provider value={value}>
      {children}
    </DomainsContext.Provider>
  );
};

export const useDomains = (): DomainsContextType => {
  const context = useContext(DomainsContext);
  if (context === undefined) {
    throw new Error('useDomains must be used within a DomainsProvider');
  }
  return context;
};
