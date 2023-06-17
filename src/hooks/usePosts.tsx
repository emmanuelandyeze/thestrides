import React from 'react';
import { useRecoilState } from 'recoil';
import { Post, postState } from '../atoms/postsAtom';
import { firestore, storage } from '../firebase/clientApp';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';


const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState)

    const onVote = async() => {

    }

    const onSelectPost = async() => {}

    const onDeletePost = async (post: Post): Promise<boolean> => {
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
					const postDocRef = doc(
						firestore,
						'posts',
						post.id!,
					);
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
    }
    
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost
    }
}
export default usePosts;