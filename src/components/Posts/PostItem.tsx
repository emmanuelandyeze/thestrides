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
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
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
	onSelectPost?: (post: Post) => void;
	homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
	homePage,
}) => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [error, setError] = useState(false);
	const router = useRouter();
	const singlePostPage = !onSelectPost;

	const handleDelete = async () => {
		setLoadingDelete(true);
		try {
			const success = await onDeletePost(post);
			if (!success) {
				throw new Error('Faled to delete Post');
			}
			console.log('Post was successfuly deleted');
			if (singlePostPage) {
				router.push(`/c/${post.communityId}`);
			}
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setLoadingDelete(false);
	};

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
					cursor={singlePostPage ? 'unset' : 'pointer'}
					onClick={() => onSelectPost && onSelectPost(post)}
				>
					<Stack spacing={1} p={'10px'}>
						<Stack
							direction={'row'}
							spacing={0.6}
							align={'center'}
							fontSize={'9pt'}
							justify={'space-between'}
						>
							<Stack
								direction="row"
								spacing={0.6}
								align="center"
								fontSize="9pt"
							>
								{/* Home Page Check */}
								{homePage && (
									<>
										{post.communityImageURL ? (
											<Image
												src={post.communityImageURL}
												borderRadius="full"
												boxSize="18px"
												mr={2}
												alt=""
											/>
										) : (
											<Icon
												as={IoIosPeople}
												fontSize="18pt"
												mr={1}
												color="blue.500"
											/>
										)}
										<Link href={`c/${post.communityId}`}>
											<Text
												fontWeight={700}
												_hover={{
													textDecoration: 'underline',
												}}
												onClick={(event) =>
													event.stopPropagation()
												}
											>{`${post.communityId}`}</Text>
										</Link>
										<Icon
											as={BsDot}
											color="gray.500"
											fontSize={8}
										/>
									</>
								)}
								<Text>@{post.creatorDisplayName} </Text>
							</Stack>
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
									{singlePostPage && post?.imageURL && (
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
												height={'460px'}
												objectFit={'cover'}
												borderRadius={4}
												width={'100%'}
												display={
													loadingImage ? 'none' : 'unset'
												}
												onLoad={() =>
													setLoadingImage(false)
												}
												alt="Post Image"
											/>
										</Flex>
									)}
									{singlePostPage ? (
										<Text fontSize={'9pt'} fontWeight={400} pt={5}>
											<pre
												style={{
													width: '100%',
													padding: 0,
													margin: 0,
													overflow: 'auto',
													overflowY: 'hidden',
													fontSize: '12px',
													lineHeight: '20px',
													whiteSpace: 'pre-wrap',
													fontFamily:
														'Open Sans, sans-serif',
												}}
											>
												{post?.body}
											</pre>
										</Text>
									) : (
										<Wrap>
											<WrapItem>
												<Text
													fontSize={'9pt'}
													noOfLines={[1, 2, 3]}
														fontWeight={400}
														pt={0}
												>
													<pre
														style={{
															width: '100%',
															padding: 0,
															margin: 0,
															overflow: 'auto',
															overflowY: 'hidden',
															fontSize: '12px',
															lineHeight: '20px',
															whiteSpace: 'pre-wrap',
															fontFamily:
																'Open Sans, sans-serif',
														}}
													>
														{post?.body.slice(0, 250)}...
													</pre>
												</Text>
											</WrapItem>
										</Wrap>
									)}
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
											align={'center'}
											objectFit={'cover'}
											borderRadius={4}
											width={'100%'}
											height={'100%'}
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
							onClick={() =>
								onVote(post, -1, post.communityId)
							}
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
