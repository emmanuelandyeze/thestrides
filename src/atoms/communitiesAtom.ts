import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil'

export interface Community {
    id: string;
    creatorId: string,
    numberOfMembers: number;
    privacyType: 'public' | 'restricted' | 'private';
    createdAt?: Timestamp;
    imageURL: string;
    communityName: string
}

export interface CommunitySnippet {
    communityId: string,
    isModerator?: boolean,
    communityName: string
}

interface CommunityState {
    mySnippets: CommunitySnippet[];
    // visitedCommunities
}

const defaultCommunityState: CommunityState = {
    mySnippets: []
}

export const communityState = atom<CommunityState>({
    key: 'communitiesState',
    default: defaultCommunityState
})