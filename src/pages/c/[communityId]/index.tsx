import { Community, communityState } from '@/src/atoms/communitiesAtom';
import About from '@/src/components/Community/About';
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Header from '@/src/components/Community/Header';
import NotFound from '@/src/components/Community/NotFound';
import PageContent from '@/src/components/Layout/PageContent';
import Posts from '@/src/components/Posts/Posts';
import { firestore } from '@/src/firebase/clientApp';
import { Flex } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import {
	GetServerSideProps,
	GetServerSidePropsContext,
} from 'next';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';

type communityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<communityPageProps> = ({
	communityData,
}) => {
	const setCommunityStateValue = useSetRecoilState(communityState)
	useEffect(() => {
		setCommunityStateValue((prev) => ({
			...prev,
			currentCommunity: communityData
	}))
	
	}, [])
	
	if (!communityData) {
		return <NotFound />;
	}
	return (
		<div style={{paddingTop: '3rem'}}>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<Flex display={{base: 'block', md: 'none'}} mb={2}>
						<About communityData={communityData} />
					</Flex>
					{/* <CreatePostLink /> */}
					<Posts communityData={communityData} />
				</>
				<>
					<About communityData={communityData} />
				</>
			</PageContent>
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext,
) {
	//get community data and pass it to client

	try {
		const communityDocRef = doc(
			firestore,
			'communities',
			context.query.communityId as string,
		);

		const communityDoc = await getDoc(communityDocRef);

		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({
								id: communityDoc.id,
								...communityDoc.data(),
							}),
					  )
					: '',
			},
		};
	} catch (error) {
		//Add error page here
		console.log(error);
	}
}
export default CommunityPage;
