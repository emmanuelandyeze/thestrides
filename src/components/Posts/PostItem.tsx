import { Post } from '@/src/atoms/postsAtom';
import {
	Flex,
	Icon,
	Stack,
	Text,
	Image,
	HStack,
	VStack,
	Skeleton,
	Spinner,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from 'react-icons/io5';
import { SlDislike, SlLike } from 'react-icons/sl';

type PostItemProps = {
	post: Post;
	userIsCreator: boolean;
	userVoteValue?: number;
	onVote: (
		post: Post,
		vote: number,
		communityId: string,
	) => void;
	onDeletePost: (post: Post) => Promise<boolean>;
	onSelectPost: () => void;
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
}) => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [loadingDelete, setLoadingDelete] = useState(false)
	const [error, setError] = useState(false)

	const handleDelete = async () => {
		setLoadingDelete(true)
		try {
			const success = await onDeletePost(post)
			if (!success) {
				throw new Error('Faled to delete Post')
			}
			console.log('Post was successfuly deleted')
		} catch (error: any) {
			console.log(error)
			setError(error.message)
		}
		setLoadingDelete(false)
	}

	return (
		<>
			<Flex
				border={'1px solid'}
				bg={'white'}
				borderColor={'gray.300'}
				borderRadius={5}
				_hover={{ shadow: 'md' }}
				direction={'column'}
			>
				<Flex
					direction={'column'}
					width={'100%'}
					cursor={'pointer'}
					onClick={() => {}}
				>
					<Stack spacing={1} p={'10px'}>
						<Stack
							direction={'row'}
							spacing={0.6}
							align={'center'}
							fontSize={'9pt'}
							justify={'space-between'}
						>
							<Text>
								Posted by{' '}
								<span style={{ color: 'blue' }}>
									{post.creatorDisplayName}{' '}
								</span>
							</Text>
							<Text>
								{moment(
									new Date(post.createdAt?.seconds * 1000),
								).fromNow()}
							</Text>
						</Stack>
						{post?.body ? (
							<HStack
								align={'start'}
								width={'100%'}
								justify={'space-between'}
							>
								<VStack align={'start'}>
									<Text fontSize={'12pt'} fontWeight={600}>
										{post?.title}
									</Text>
									<Text fontSize={'9pt'} fontWeight={400}>
										{post?.body}
									</Text>
								</VStack>
							</HStack>
						) : (
							<VStack align={'start'} width={'100%'}>
								<VStack align={'start'}>
									<Text fontSize={'12pt'} fontWeight={600}>
										{post?.title}
									</Text>
								</VStack>
								{post?.imageURL && !post?.body && (
									<Flex
										justify={'center'}
										p={0}
										flexGrow={1}
									>
										{loadingImage && (
											<Skeleton
												height="200px"
												width={'100%'}
												bg={'gray.200'}
												borderRadius={4}
											/>
										)}
										<Image
											src={post?.imageURL}
											// maxHeight={'460px'}
											objectFit={'cover'}
											borderRadius={4}
											width={'100%'}
											display={
												loadingImage ? 'none' : 'unset'
											}
											onLoad={() => setLoadingImage(false)}
											alt="Post Image"
										/>
									</Flex>
								)}
							</VStack>
						)}
					</Stack>
				</Flex>
				<Flex
					pb={2}
					pt={2}
					justify={'flex-start'}
					direction={'row'}
					px={3}
				>
					<Flex
						align={'center'}
						px={'10px'}
						direction={'row'}
					>
						<Icon
							as={userVoteValue === 1 ? SlLike : SlLike}
							color={
								userVoteValue === 1
									? 'green.300'
									: 'gray.400'
							}
							// fontSize={22}
							onClick={() =>
								onVote(post, 1, post.communityId)
							}
						/>
						<Text mx={2}>{post?.voteStatus}</Text>
						<Icon
							as={
								userVoteValue === -1 ? SlDislike : SlDislike
							}
							color={
								userVoteValue === -1
									? 'red.500'
									: 'gray.400'
							}
							// fontSize={22}
							onClick={() => onVote(post, -1, post.communityId)}
						/>
					</Flex>
					<Flex
						align={'center'}
						p={'0px 10px'}
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor={'pointer'}
					>
						<Icon as={BsChat} mr={2} />
						<Text fontSize={'9pt'}>
							{post.numberOfComments}
						</Text>
					</Flex>
					<Flex
						align={'center'}
						p={'0px 10px'}
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor={'pointer'}
					>
						<Icon as={IoArrowRedoOutline} mr={2} />
						<Text fontSize={'9pt'}>Share</Text>
					</Flex>
					<Flex
						align={'center'}
						p={'0px 10px'}
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor={'pointer'}
					>
						<Icon as={IoBookmarkOutline} mr={2} />
						<Text fontSize={'9pt'}>Save</Text>
					</Flex>
					{userIsCreator && (
						<Flex
							align={'center'}
							p={'0px 10px'}
							borderRadius={4}
							_hover={{ bg: 'gray.200' }}
							cursor={'pointer'}
							color={'red.600'}
							onClick={handleDelete}
						>
							{loadingDelete ? (
								<Spinner size={'sm'} />
							) : (
								<>
									<Icon as={AiOutlineDelete} mr={2} />
									<Text fontSize={'9pt'}>Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</>
	);
};
export default PostItem;
