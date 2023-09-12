import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export type User = {
	uid: string;
	displayName: string;
	email: string;
	photoURL?: string;
	createdAt: Timestamp;
};


