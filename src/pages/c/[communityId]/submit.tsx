import { communityState } from '@/src/atoms/communitiesAtom';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const SubmitPostPage: React.FC = () => {
    const [user] = useAuthState(auth)
    
		// const visitedCommunities = useRecoilValue(communityState).visitedCommunities;
		const communityStateValue =
			useRecoilValue(communityState);
		const { loading } = useCommunityData();
	return (
		<PageContent>
			<>
				<Box
					p={'14px 0px'}
					borderBottom={'1px solid'}
					borderColor={'white'}
				>
					<Text>Create a Post</Text>
				</Box>
				{user && <NewPostForm user={user} />}
			</>
			<></>
		</PageContent>
	);
};
export default SubmitPostPage;
