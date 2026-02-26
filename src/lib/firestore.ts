'use client';
// This is a mock Firestore implementation.
// In a real app, you would import from 'firebase/firestore'
// and use a real Firebase instance.

const getDbForPath = (path: string): any[] => {
    if (typeof window === 'undefined') return [];
    try {
        const item = window.localStorage.getItem(`mockdb_${path}`);
        return item ? JSON.parse(item) : [];
    } catch (e) {
        console.error("Error reading from mock DB", e);
        return [];
    }
}

const setDbForPath = (path: string, data: any[]) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(`mockdb_${path}`, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save to mock DB", e);
    }
}

const collection = (db: any, path: string) => {
    return { path };
};

const getDocs = async (collectionRef: { path: string }) => {
    const documents = getDbForPath(collectionRef.path);
    return {
        docs: documents.map((doc: any) => ({
            id: doc.id,
            data: () => doc,
        }))
    };
};

const getDoc = async (docRef: { path: string }) => {
    const parts = docRef.path.split('/');
    const docId = parts.pop();
    const collectionPath = parts.join('/');
    const collectionData = getDbForPath(collectionPath);
    const doc = collectionData.find((d: any) => d.id === docId);
    return {
        exists: () => !!doc,
        data: () => doc,
    };
};

const setDoc = async (docRef: { path: string }, data: any) => {
    const parts = docRef.path.split('/');
    const docId = parts.pop();
    const collectionPath = parts.join('/');
    let collectionData = getDbForPath(collectionPath);
    const existingIndex = collectionData.findIndex((d: any) => d.id === docId);
    if (existingIndex > -1) {
        collectionData[existingIndex] = { ...collectionData[existingIndex], ...data, id: docId };
    } else {
        collectionData.push({ id: docId, ...data });
    }
    setDbForPath(collectionPath, collectionData);
};


const addDoc = async (collectionRef: { path: string }, data: any) => {
    const collectionData = getDbForPath(collectionRef.path);
    const id = `mock_id_${Date.now()}`;
    collectionData.push({ id, ...data });
    setDbForPath(collectionRef.path, collectionData);
    return { id };
};

const deleteDoc = async (docRef: { path: string }) => {
    const parts = docRef.path.split('/');
    const docId = parts.pop();
    const collectionPath = parts.join('/');
    
    let collectionData = getDbForPath(collectionPath);
    collectionData = collectionData.filter((doc: any) => doc.id !== docId);
    setDbForPath(collectionPath, collectionData);
};


const doc = (db: any, ...pathSegments: string[]) => {
    return { path: pathSegments.join('/') };
};

const serverTimestamp = () => new Date().toISOString();

// --- Website Management ---

export interface SavedWebsite {
    id: string;
    htmlContent: string;
    themeName: string;
    createdAt: string;
}

export async function saveWebsite(userId: string, htmlContent: string, themeName: string): Promise<string> {
    if (!userId) throw new Error("User ID is required to save a website.");
    const db = {}; // Mock db object
    const websitesCollectionRef = collection(db, `/users/${userId}/websites`);
    const docRef = await addDoc(websitesCollectionRef, {
        htmlContent,
        themeName,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getWebsites(userId: string): Promise<SavedWebsite[]> {
    if (!userId) return [];
    const db = {};
    const websitesCollectionRef = collection(db, `/users/${userId}/websites`);
    const snapshot = await getDocs(websitesCollectionRef);
    const websites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedWebsite));
    return websites.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteWebsite(userId: string, websiteId: string): Promise<void> {
    if (!userId || !websiteId) throw new Error("User ID and Website ID are required.");
    const db = {};
    const websiteDocRef = doc(db, `/users/${userId}/websites`, websiteId);
    await deleteDoc(websiteDocRef);
}


// --- Domain and Hosting Management ---

export async function setDomainMapping(domainName: string, websiteId: string, userId: string): Promise<void> {
    const db = {};
    const mappingRef = doc(db, 'domains', domainName);
    await setDoc(mappingRef, { userId, websiteId });
}

export async function getWebsiteForDomain(domainName: string): Promise<SavedWebsite | null> {
    const db = {};
    const mappingRef = doc(db, 'domains', domainName);
    const mappingSnap = await getDoc(mappingRef);

    if (!mappingSnap.exists()) {
        console.log(`No domain mapping found for ${domainName}`);
        return null;
    }

    const { userId, websiteId } = mappingSnap.data();
    
    const websiteRef = doc(db, 'users', userId, 'websites', websiteId);
    const websiteSnap = await getDoc(websiteRef);

    if (!websiteSnap.exists()) {
        console.log(`Website ${websiteId} not found for user ${userId}`);
        return null;
    }
    
    return { id: websiteSnap.data().id, ...websiteSnap.data() } as SavedWebsite;
}
