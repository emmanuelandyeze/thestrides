import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
	Post,
	PostVote,
	postState,
} from '../atoms/postsAtom';
import {
	auth,
	firestore,
	storage,
} from '../firebase/clientApp';
import {
	doc,
	deleteDoc,
	writeBatch,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { communityState } from '../atoms/communitiesAtom';
import { AuthModalState } from '../atoms/authModalAtom';

const usePosts = () => {
	const [user] = useAuthState(auth);
	const [postStateValue, setPostStateValue] =
		useRecoilState(postState);
	const currentCommunity =
		useRecoilValue(communityState).currentCommunity;
	const setAuthModalState = useSetRecoilState(AuthModalState)

	const onVote = async (
		post: Post,
		vote: number,
		communityId: string,
	) => {
		if (!user?.uid) {
			setAuthModalState({ open: true, view: 'login' })
			return
		}
		try {
			const { voteStatus } = post;
			const existingVote = postStateValue.postVotes.find(
				(vote) => vote.postId === post.id,
			);

			const batch = writeBatch(firestore);
			const updatedPost = { ...post };
			const updatedPosts = [...postStateValue.posts];
			let updatedPostVotes = [...postStateValue.postVotes];
			let voteChange = vote;

			//New Vote
			if (!existingVote) {
				const postVoteRef = doc(
					collection(
						firestore,
						'users',
						`${user?.uid}/postVotes`,
					),
				);

				const newVote: PostVote = {
					id: postVoteRef.id,
					postId: post.id!,
					communityId,
					voteValue: vote,
				};

				batch.set(postVoteRef, newVote);

				updatedPost.voteStatus = voteStatus + vote;
				updatedPostVotes = [...updatedPostVotes, newVote];
			} else {
				const postVoteRef = doc(
					firestore,
					'users',
					`${user?.uid}/postVotes/existingVote.id`,
				);
				if (existingVote.voteValue === vote) {
					updatedPost.voteStatus = voteStatus - vote;
					updatedPostVotes = updatedPostVotes.filter(
						(vote) => vote.id !== existingVote.id,
					);

					batch.delete(postVoteRef);

					voteChange *= -1;
				} else {
					updatedPost.voteStatus = voteStatus + 2 * vote;
					const voteIdx =
						postStateValue.postVotes.findIndex(
							(vote) => vote.id === existingVote.id,
						);

					updatedPostVotes[voteIdx] = {
						...existingVote,
						voteValue: vote,
					};

					batch.update(postVoteRef, {
						voteValue: vote,
					});
				}
			}

			const postRef = doc(firestore, 'posts', post.id!);
			batch.update(postRef, {
				voteStatus: voteStatus + voteChange,
			});

			const postIdx = postStateValue.posts.findIndex(
				(item) => item.id === post.id,
			);
			updatedPosts[postIdx] = updatedPost;
			setPostStateValue((prev) => ({
				...prev,
				posts: updatedPosts,
				postVotes: updatedPostVotes,
			}));

			await batch.commit();
		} catch (error) {
			console.log('onvote', error);
		}
	};

	const onSelectPost = async () => {};

	const onDeletePost = async (
		post: Post,
	): Promise<boolean> => {
		try {
			// check if image, delete if exists
			if (post.imageURL) {
				const imageRef = ref(
					storage,
					`posts/${post.id}/image`,
				);
				await deleteObject(imageRef);
			}

			// delete post document from firestore
			const postDocRef = doc(firestore, 'posts', post.id!);
			await deleteDoc(postDocRef);

			// update recoil state
			setPostStateValue((prev) => ({
				...prev,
				posts: prev.posts.filter(
					(item) => item.id !== post.id,
				),
			}));
			return true;
		} catch (error) {
			return false;
		}
	};

	const getCommunityPostVotes = async (
		communityId: string,
	) => {
		const postVotesQuery = query(
			collection(
				firestore,
				'users',
				`${user?.uid}/postVotes`,
			),
			where('communityId', '==', communityId),
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
	};

	useEffect(() => {
		if (!user || !currentCommunity?.id) return;
		getCommunityPostVotes(currentCommunity?.id);
	}, [user, currentCommunity]);

	useEffect(() => {
		if (!user) {
			setPostStateValue((prev) => ({
				...prev,
				postVotes: []
			}))
		}
	}, [user]);

	return {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	};
};
export default usePosts;
