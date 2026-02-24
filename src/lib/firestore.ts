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

const addDoc = async (collectionRef: { path: string }, data: any) => {
    const collectionData = getDbForPath(collectionRef.path);
    const id = `mock_id_${Date.now()}`;
    collectionData.push({ id, ...data });
    setDbForPath(collectionRef.path, collectionData);
    console.log("Mock Firestore: Document added to", collectionRef.path, { id, ...data });
    return { id };
};

const deleteDoc = async (docRef: { path: string }) => {
    const parts = docRef.path.split('/');
    const docId = parts.pop();
    const collectionPath = parts.join('/');
    
    let collectionData = getDbForPath(collectionPath);
    collectionData = collectionData.filter((doc: any) => doc.id !== docId);
    setDbForPath(collectionPath, collectionData);
    console.log("Mock Firestore: Document deleted from", docRef.path);
};


const doc = (db: any, ...pathSegments: string[]) => {
    return { path: pathSegments.join('/') };
};

const serverTimestamp = () => new Date().toISOString();


export async function saveWebsite(userId: string, htmlContent: string, themeName: string): Promise<string> {
    if (!userId) {
        throw new Error("User ID is required to save a website.");
    }
    
    // In a real app, you would get the db instance from your firebase setup
    const db = {}; // Mock db object

    const websitesCollectionRef = collection(db, `/users/${userId}/websites`);
    
    const docRef = await addDoc(websitesCollectionRef, {
        htmlContent,
        themeName,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}


export interface SavedWebsite {
    id: string;
    htmlContent: string;
    themeName: string;
    createdAt: string;
}

export async function getWebsites(userId: string): Promise<SavedWebsite[]> {
    if (!userId) {
        return [];
    }
    const db = {}; // Mock db object
    const websitesCollectionRef = collection(db, `/users/${userId}/websites`);
    const snapshot = await getDocs(websitesCollectionRef);
    const websites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedWebsite));
    // Sort by most recent first
    return websites.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteWebsite(userId: string, websiteId: string): Promise<void> {
    if (!userId || !websiteId) {
        throw new Error("User ID and Website ID are required.");
    }
    const db = {}; // Mock db object
    const websiteDocRef = doc(db, `/users/${userId}/websites`, websiteId);
    await deleteDoc(websiteDocRef);
}
