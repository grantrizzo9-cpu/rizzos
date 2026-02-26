
'use client';

import { getWebsites, setDomainMapping, type SavedWebsite } from '@/lib/firestore';
import { useAuth } from '@/components/auth/auth-provider';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// --- Types ---
export type DomainStatus = 'verified' | 'pending' | 'error';

export interface DnsRecord {
  type: 'A' | 'CNAME';
  host: string;
  value: string;
  status: 'verifying' | 'missing' | 'found';
}

export interface Domain {
  id: string;
  name: string;
  status: DomainStatus;
  dnsRecords: DnsRecord[];
  deployedWebsiteId: string | null;
}

interface DomainsContextType {
  domains: Domain[];
  addDomain: (domainName: string) => void;
  deleteDomain: (domainId: string) => void;
  verifyDomainDns: (domainId: string) => Promise<void>;
  deployWebsiteToDomain: (domainId: string, websiteId: string) => void;
  getDomainById: (domainId: string) => Domain | undefined;
  generatedWebsites: SavedWebsite[];
  loadingWebsites: boolean;
}

// --- Constants ---
const A_RECORD_VALUES = ['199.36.158.100', '199.36.158.101'];
const DOMAINS_LOCAL_STORAGE_KEY = 'user_domains';

// --- Context ---
const DomainsContext = createContext<DomainsContextType | undefined>(undefined);

// --- Provider ---
export const DomainsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [generatedWebsites, setGeneratedWebsites] = useState<SavedWebsite[]>([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);

  // Load domains from local storage on mount
  useEffect(() => {
    if (user?.uid) {
      try {
        const storedDomains = localStorage.getItem(`${DOMAINS_LOCAL_STORAGE_KEY}_${user.uid}`);
        if (storedDomains) {
          setDomains(JSON.parse(storedDomains));
        }
      } catch (error) {
        console.error("Failed to load domains from local storage:", error);
      }
    }
  }, [user?.uid]);

  // Save domains to local storage whenever they change
  useEffect(() => {
    if (user?.uid) {
      try {
        localStorage.setItem(`${DOMAINS_LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(domains));
      } catch (error) {
        console.error("Failed to save domains to local storage:", error);
      }
    }
  }, [domains, user?.uid]);

   // Fetch user's generated websites
  useEffect(() => {
    if (user?.uid) {
      setLoadingWebsites(true);
      getWebsites(user.uid)
        .then(setGeneratedWebsites)
        .catch(err => console.error("Failed to fetch websites", err))
        .finally(() => setLoadingWebsites(false));
    }
  }, [user?.uid]);


  const getCnameValue = useCallback(() => {
    return user?.username ? `${user.username}.hostproai.com` : '';
  }, [user?.username]);

  const addDomain = useCallback((domainName: string) => {
    if (!domainName || domains.some(d => d.name === domainName)) {
      return;
    }

    const cnameValue = getCnameValue();
    if (!cnameValue) return;

    const newDomain: Domain = {
      id: `domain_${Date.now()}`,
      name: domainName,
      status: 'pending',
      deployedWebsiteId: null,
      dnsRecords: [
        { type: 'A', host: '@', value: A_RECORD_VALUES[0], status: 'verifying' },
        { type: 'A', host: '@', value: A_RECORD_VALUES[1], status: 'verifying' },
        { type: 'CNAME', host: 'www', value: cnameValue, status: 'verifying' },
      ],
    };

    setDomains(prev => [...prev, newDomain]);
  }, [domains, getCnameValue]);

  const deleteDomain = useCallback((domainId: string) => {
    setDomains(prev => prev.filter(d => d.id !== domainId));
  }, []);

  const getDomainById = useCallback((domainId: string) => {
    return domains.find(d => d.id === domainId);
  }, [domains]);

  // This is a mock verification. In a real app, this would be a backend call.
  const verifyDomainDns = useCallback(async (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    
    // Set all to verifying first
    setDomains(prev => prev.map(d => d.id === domainId ? { ...d, dnsRecords: d.dnsRecords.map(r => ({...r, status: 'verifying'})) } : d));
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Simulate some records failing for demonstration
    const updatedRecords = domain.dnsRecords.map(record => {
      const isFound = Math.random() > 0.3; // 70% chance of success
      return { ...record, status: isFound ? 'found' : 'missing' } as DnsRecord;
    });

    const allVerified = updatedRecords.every(r => r.status === 'found');

    setDomains(prev => prev.map(d => 
        d.id === domainId 
        ? { ...d, dnsRecords: updatedRecords, status: allVerified ? 'verified' : 'error' } 
        : d
    ));

  }, [domains]);

  const deployWebsiteToDomain = useCallback((domainId: string, websiteId: string) => {
    if (!user?.uid) return;
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    
    // Create the public mapping in Firestore
    setDomainMapping(domain.name, websiteId, user.uid);
    
    // Update local state to reflect the deployment
    setDomains(prev => prev.map(d => 
      d.id === domainId 
      ? { ...d, deployedWebsiteId: websiteId } 
      : d
    ));
  }, [domains, user?.uid]);

  const value = {
    domains,
    addDomain,
    deleteDomain,
    verifyDomainDns,
    getDomainById,
    deployWebsiteToDomain,
    generatedWebsites,
    loadingWebsites,
  };

  return <DomainsContext.Provider value={value}>{children}</DomainsContext.Provider>;
};

// --- Hook ---
export const useDomains = (): DomainsContextType => {
  const context = useContext(DomainsContext);
  if (context === undefined) {
    throw new Error('useDomains must be used within a DomainsProvider');
  }
  return context;
};
