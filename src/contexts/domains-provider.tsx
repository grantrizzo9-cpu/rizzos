
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


  const addDomain = useCallback((domainName: string) => {
    if (!domainName || domains.some(d => d.name === domainName)) {
      return;
    }
    
    domainName = domainName.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    // Simulate a unique verification CNAME record from the hosting provider
    const uniqueIdPart1 = Math.random().toString(36).substring(2, 10);
    const verificationHost = `_acme-challenge.${uniqueIdPart1}`;
    const verificationValue = `${Math.random().toString(36).substring(2, 15)}.authorize.certificatemanager.goog.`;


    const newDomain: Domain = {
      id: `domain_${Date.now()}`,
      name: domainName,
      status: 'pending',
      deployedWebsiteId: null,
      dnsRecords: [
        { type: 'A', host: '@', value: '35.219.200.7', status: 'verifying' },
        { type: 'CNAME', host: 'www', value: domainName, status: 'verifying' },
        { type: 'CNAME', host: verificationHost, value: verificationValue, status: 'verifying' }
      ],
    };

    setDomains(prev => [...prev, newDomain]);
  }, [domains]);

  const deleteDomain = useCallback((domainId: string) => {
    setDomains(prev => prev.filter(d => d.id !== domainId));
  }, []);

  const getDomainById = useCallback((domainId: string) => {
    return domains.find(d => d.id === domainId);
  }, [domains]);

  const verifyDomainDns = useCallback(async (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    
    // Set all to verifying first
    setDomains(prev => prev.map(d => d.id === domainId ? { ...d, dnsRecords: d.dnsRecords.map(r => ({...r, status: 'verifying'})) } : d));
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Simulate a successful verification since the user will use a real DNS checker.
    const updatedRecords = domain.dnsRecords.map(record => {
      return { ...record, status: 'found' } as DnsRecord;
    });

    setDomains(prev => prev.map(d => 
        d.id === domainId 
        ? { ...d, dnsRecords: updatedRecords, status: 'verified' } 
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
