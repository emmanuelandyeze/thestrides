import { Post } from '@/src/atoms/postsAtom';
import About from '@/src/components/Community/About';
import PageContent from '@/src/components/Layout/PageContent';
import Comments from '@/src/components/Posts/Comments/Comments';
import PostItem from '@/src/components/Posts/PostItem';
import { auth, firestore } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePosts';
import { Box, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const PostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	const {
		postStateValue,
		setPostStateValue,
		onDeletePost,
		onVote,
	} = usePosts();
	const router = useRouter();
	const { communityStateValue } = useCommunityData();

	const fetchPost = async (postId: string) => {
		try {
			const postDocRef = doc(firestore, 'posts', postId);
			const postDoc = await getDoc(postDocRef);
			setPostStateValue((prev) => ({
				...prev,
				selectedPost: {
					id: postDoc.id,
					...postDoc.data(),
				} as Post,
			}));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const { pid } = router.query;

		if (pid && !postStateValue.selectedPost) {
			fetchPost(pid as string);
		}
	}, [router.query, postStateValue.selectedPost]);

	return (
		<>
			<NextSeo
				title={`Check out this post in @${postStateValue.selectedPost?.communityId} on The Strides`}
				description="Discover communities right for you, engage and grow."
				openGraph={{
					title: `${postStateValue.selectedPost?.title} - The Strides`,
					description: `${postStateValue.selectedPost?.body} - The Strides`,
					url: `https://www.thestrides.com.ng/c/${postStateValue.selectedPost?.communityId}/comments/${postStateValue.selectedPost?.id}`,
					type: 'article',
					article: {
						authors: [
							`${postStateValue.selectedPost?.creatorDisplayName}`,
						],
					},
					images: [
						{
							url: `${postStateValue.selectedPost?.imageURL}`,
							width: 850,
							height: 650,
							alt: 'Post Photo',
						},
					],
				}}
			/>
			<div style={{ paddingTop: 45 }}>
				<PageContent>
					<>
						<Box
							display={{ base: 'block', md: 'none' }}
							mb={3}
						>
							{communityStateValue.currentCommunity && (
								// <About
								// 	communityData={
								// 		communityStateValue.currentCommunity
								// 	}
								// />
								<Link
									href={`/c/${communityStateValue.currentCommunity.id}/submit`}
								>
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
							)}
						</Box>
						{postStateValue.selectedPost && (
							<PostItem
								post={postStateValue.selectedPost}
								onVote={onVote}
								onDeletePost={onDeletePost}
								userVoteValue={
									postStateValue.postVotes.find(
										(item) =>
											item.postId ===
											postStateValue.selectedPost?.id,
									)?.voteValue
								}
								userIsCreator={
									user?.uid ===
									postStateValue.selectedPost?.creatorId
								}
							/>
						)}
						<Comments
							user={user as User}
							selectedPost={postStateValue.selectedPost}
							communityId={
								postStateValue.selectedPost
									?.communityId as string
							}
						/>
					</>
					<>
						{communityStateValue.currentCommunity && (
							<About
								communityData={
									communityStateValue.currentCommunity
								}
							/>
						)}
					</>
				</PageContent>
			</div>
		</>
	);
};
export default PostPage;
