import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export interface Community {
	communityDescription: string;
	id: string;
	creatorId: string;
	numberOfMembers: number;
	privacyType: 'public' | 'restricted' | 'private';
	createdAt?: Timestamp;
	imageURL?: string;
	communityName: string;
}

export interface CommunitySnippet {
	communityId: string;
	isModerator?: boolean;
	imageURL?: string;
}

interface CommunityState {
	mySnippets: CommunitySnippet[];
	currentCommunity?: Community;
	snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
	mySnippets: [],
	snippetsFetched: false,
};

export const communityState = atom<CommunityState>({
	key: 'communitiesState',
	default: defaultCommunityState,
});
