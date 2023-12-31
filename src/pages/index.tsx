import { Box, Flex, Stack } from '@chakra-ui/react';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Post, PostVote } from '../atoms/postsAtom';
import CreatePostLink from '../components/Community/CreatePostLink';
import PersonalHome from '../components/Community/PersonalHome';
import Premium from '../components/Community/Premium';
import Recommendations from '../components/Community/Recommendations';
import PageContent from '../components/Layout/PageContent';
import PostItem from '../components/Posts/PostItem';
import PostLoader from '../components/Posts/PostLoader';
import { auth, firestore } from '../firebase/clientApp';
import useCommunityData from '../hooks/useCommunityData';
import usePosts from '../hooks/usePosts';
import { NextSeo } from 'next-seo';
import CommunityRecommendations from '../components/Community/CommunityRecommendations';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import YourCommunities from '../components/Community/YourCommunities';

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postStateValue,
		setPostStateValue,
		onSelectPost,
		onDeletePost,
		onVote,
	} = usePosts();
	const { communityStateValue } = useCommunityData();

	const buildUserHomeFeed = async () => {
		setLoading(true);
		try {
			if (communityStateValue.mySnippets.length) {
				// get posts from users' communities
				const myCommunityIds =
					communityStateValue.mySnippets.map(
						(snippet) => snippet.communityId,
					);
				
				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					orderBy('createdAt', 'desc'),
					limit(10),
				);
				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPostStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.log('buildUserHomeFeed error', error);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
		setLoading(true);
		try {
			const postQuery = query(
				collection(firestore, 'posts'),
				orderBy('voteStatus', 'desc'),
				limit(10),
			);

			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));

			// setPostState
		} catch (error) {
			console.log('buildNoUserHomeFeed error', error);
		}
		setLoading(false);
	};

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map(
				(post) => post.id,
			);
			const postVotesQuery = query(
				collection(
					firestore,
					`users/${user?.uid}/postVotes`,
				),
				where('postId', 'in', postIds),
			);
			const postVoteDocs = await getDocs(postVotesQuery);
			const postVotes = postVoteDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (error) {
			console.log('getUserPostVotes error', error);
		}
	};

	// useEffects
	useEffect(() => {
		if (communityStateValue.snippetsFetched)
			buildUserHomeFeed();
	}, [communityStateValue.snippetsFetched]);

	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser]);

	useEffect(() => {
		if (user && postStateValue.posts.length)
			getUserPostVotes();

		return () => {
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		};
	}, [user, postStateValue.posts]);

  return (
		<div style={{ paddingTop: 45 }}>
			<NextSeo
				title="The Strides - One platform, many communities, one goal."
				description="Discover communities right for you, engage and grow."
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: 'https://www.thestrides.com.ng/',
					siteName: 'The Strides',
				}}
				twitter={{
					handle: '@stridesconnect',
					site: '@stridesconnect',
					cardType: 'summary_large_image',
				}}
			/>
			<PageContent>
				<>
					{/* <CreatePostLink /> */}
					{loading ? (
						<PostLoader />
					) : (
						<Stack mt={0} pt={0}>
							<Tabs>
								<Flex
									position={'fixed'}
									bg={'white'}
									  zIndex={100}
									  w={'full'}
								>
									<TabList>
										<Tab>Communities</Tab>
										<Tab>Feed</Tab>
									</TabList>
								</Flex>

								{/* <Flex pt={14}> */}
									<TabPanel width={'full'}>
										<Flex
											display={{
												base: 'block',
												md: 'block',
										  }}
										  pt={10}
									  >
										  {user && (
											  <YourCommunities />
										  )}
											<CommunityRecommendations />
										</Flex>
									</TabPanel>
									<TabPanel>
										<Box
											// borderLeft={'.5px'}
										  borderColor={'gray.200'}
										  pt={10}
										>
											{postStateValue.posts.map((post) => (
												<PostItem
													key={post.id}
													post={post}
													onSelectPost={onSelectPost}
													onDeletePost={onDeletePost}
													onVote={onVote}
													userVoteValue={
														postStateValue.postVotes.find(
															(item) =>
																item.postId === post.id,
														)?.voteValue
													}
													userIsCreator={
														user?.uid === post.creatorId
													}
													homePage
												/>
											))}
										</Box>
									</TabPanel>
								{/* </Flex> */}
							</Tabs>
						</Stack>
					)}
				</>
				<Stack spacing={5} position="sticky" top="55px">
					<Recommendations />
					<Premium />
					<PersonalHome />
				</Stack>
			</PageContent>
		</div>
	);
};

export default Home;
