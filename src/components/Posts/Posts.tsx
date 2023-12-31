import { Community } from '@/src/atoms/communitiesAtom';
import { Post } from '@/src/atoms/postsAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import usePosts from '@/src/hooks/usePosts';
import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
	communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	const [user] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	} = usePosts();

	const getPosts = async () => {
		try {
			setLoading(true)
			const postQuery = query(
				collection(firestore, 'posts'),
				where('communityId', '==', communityData.id),
				orderBy('createdAt', 'desc'),
			);
			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setPostStateValue((prev) => ({
				...prev,
				posts: posts as any,
			}));
			setLoading(false)
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPosts();
	}, [communityData]);

	return (
		<>
			{loading ? (
				<PostLoader />
			) : (
				<Stack>
					{postStateValue?.posts.map((item) => (
						<PostItem
							post={item}
							key={item?.id}
							userIsCreator={user?.uid === item.creatorId}
							onSelectPost={onSelectPost}
							onDeletePost={onDeletePost}
							onVote={onVote}
							userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id) ?.voteValue}
						/>
					))}
				</Stack>
			)}
		</>
	);
};
export default Posts;
