import { Community, communityState } from '@/src/atoms/communitiesAtom';
import About from '@/src/components/Community/About';
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Header from '@/src/components/Community/Header';
import NotFound from '@/src/components/Community/NotFound';
import PageContent from '@/src/components/Layout/PageContent';
import Posts from '@/src/components/Posts/Posts';
import { firestore } from '@/src/firebase/clientApp';
import { Box, Flex, Text } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import {
	GetServerSideProps,
	GetServerSidePropsContext,
} from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
	const router = useRouter()

	const { communityId } = router.query;
	useEffect(() => {
		setCommunityStateValue((prev) => ({
			...prev,
			currentCommunity: communityData
	}))
	
	}, [communityData])
	
	if (!communityData) {
		return <NotFound />;
	}
	return (
		<div style={{ paddingTop: '3rem' }}>
			<NextSeo
				title={`${communityData.communityName} Community - The Strides`}
				description="Discover communities right for you, engage and grow."
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: `https://www.thestrides.com.ng/c/${communityId}`,
					siteName: 'The Strides',
				}}
				twitter={{
					handle: '@stridesconnect',
					site: '@stridesconnect',
					cardType: 'summary_large_image',
				}}
			/>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<Flex
						display={{ base: 'block', md: 'none' }}
						mb={2}
					>
						{/* <About communityData={communityData} /> */}
						<Link href={`/c/${communityData.id}/submit`}>
							<Box
								color={'white'}
								bg={'purple.900'}
								w={'45px'}
								borderRadius={'full'}
								py={1}
								position={'fixed'}
								bottom={5}
								right={5}
								shadow={'md'}
							>
								<Text
									textAlign={'center'}
									fontWeight={'bold'}
									fontSize={'24px'}
								>
									+
								</Text>
							</Box>
						</Link>
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
