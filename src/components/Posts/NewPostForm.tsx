import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import {
	IoDocumentText,
	IoImageOutline,
} from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import TabItem from './TabItem';
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { Post } from '@/src/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Timestamp, addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/src/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/src/hooks/useSelectFile';

type NewPostFormProps = {
	user: User;
	communityImageURL?: string;
};


const formTabs: TabItem[] = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Video',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];


const NewPostForm: React.FC<NewPostFormProps> = ({
	user,
	communityImageURL,
}) => {
	const router = useRouter();
	const { communityId } = router.query;
	const [selectedTab, setSelectedTab] = useState(
		formTabs[0].title,
	);
	const [textInputs, setTextInputs] = useState({
		title: '',
		body: '',
	});
	const { selectedFile, setSelectedFile, onSelectFile } =
		useSelectFile();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handleCreatePost = async () => {
		const newPost: Post = {
			communityId: communityId as string,
			communityImageURL: communityImageURL || '',
			creatorId: user.uid,
			creatorDisplayName: user.email!.split('@')[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp() as Timestamp,
		};

		setLoading(true);
		try {
			const postDocRef = await addDoc(
				collection(firestore, 'posts'),
				newPost,
			);

			if (selectedFile) {
				const imageRef = ref(
					storage,
					`posts/${postDocRef.id}/image`,
				);
				await uploadString(
					imageRef,
					selectedFile,
					'data_url',
				);
				const downloadURL = await getDownloadURL(imageRef);

				await updateDoc(postDocRef, {
					imageURL: downloadURL,
				});
			}
			router.back();
		} catch (error: any) {
			console.log(error);
			setError(true);
		}

		setLoading(false);
	};

	const onTextChange = (
		event: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		const {
			target: { name, value },
		} = event;
		setTextInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Flex
			direction={'column'}
			bg={'white'}
			borderRadius={4}
			mt={2}
		>
			<Flex width={'100%'}>
				{formTabs.map((item) => (
					<TabItem
						item={item}
						key={item.title}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === 'Images & Video' && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelectImage={onSelectFile}
						setSelectedTab={setSelectedTab}
						setSelectedFile={setSelectedFile}
					/>
				)}
			</Flex>
			{error && (
				<Alert status="error">
					<AlertIcon />
					<Text mr={2}>Error creating post</Text>
				</Alert>
			)}
		</Flex>
	);
};
export default NewPostForm;
