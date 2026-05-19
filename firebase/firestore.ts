import { 
  collection, 
  doc, 
  DocumentData, 
  FirestoreDataConverter, 
  QueryDocumentSnapshot,
  SnapshotOptions
} from 'firebase/firestore';
import { db } from './config';

export const COLLECTIONS = {
  USERS: 'users',
  SCHOOLS: 'schools',
  STUDENTS: 'students',
  BOOKS: 'books',
  SESSIONS: 'sessions',
} as const;

// Firestore type converter factory mapping raw Firestore documents directly to TS interfaces
export const genericConverter = <T extends object>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    // Exclude the ID when writing to Firestore (as it is the document name/key)
    const { id, ...rest } = data as any;
    return rest;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as unknown as T;
  },
});

// Reusable helper helper to obtain typed collection references
export const getCollectionRef = <T extends object>(collectionName: string) => {
  return collection(db, collectionName).withConverter(genericConverter<T>());
};

// Reusable helper helper to obtain typed document references
export const getDocumentRef = <T extends object>(collectionName: string, docId: string) => {
  return doc(db, collectionName, docId).withConverter(genericConverter<T>());
};
