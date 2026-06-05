/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js" {
  export function initializeApp(config: Record<string, string>): any;
}

declare module "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js" {
  export function getFirestore(app: any): any;
  export function collection(db: any, path: string): any;
  export function query(...args: any[]): any;
  export function where(field: string, op: string, value: unknown): any;
  export function limit(n: number): any;
  export function getDocs(q: any): Promise<any>;
  export function getDocsFromServer(q: any): Promise<any>;
  export function getDoc(ref: any): Promise<any>;
  export function addDoc(ref: any, data: Record<string, unknown>): Promise<any>;
  export function setDoc(ref: any, data: Record<string, unknown>): Promise<void>;
  export function updateDoc(ref: any, data: Record<string, unknown>): Promise<void>;
  export function deleteDoc(ref: any): Promise<void>;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function serverTimestamp(): any;
}

declare module "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js" {
  export function getAuth(app: any): any;
  export function signInWithEmailAndPassword(
    auth: any,
    email: string,
    password: string
  ): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): () => void;
}
