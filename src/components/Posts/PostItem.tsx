import { Post } from '@/src/atoms/postsAtom';
import { Flex, Icon, Stack, Text, Image, HStack, VStack } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
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

type PostItemProps = {
	post: any;
	userIsCreator: boolean;
	userVoteValue?: number;
	onVote: () => {};
	onDeletePost: () => {};
	onSelectPost: () => {};
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
}) => {
	return (
		<>
			<Flex
				border={'1px solid'}
				bg={'white'}
				borderColor={'gray.300'}
				borderRadius={4}
				_hover={{ shadow: 'md' }}
				cursor={'pointer'}
				onClick={() => {}}
				direction={'column'}
			>
				<Flex direction={'column'} width={'100%'}>
					<Stack spacing={1} p={'10px'}>
						<Stack
							direction={'row'}
							spacing={0.6}
							align={'center'}
							fontSize={'9pt'}
						>
							<Text>
								Posted by u/{post.creatorDisplayName}{' '}
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
								{post?.imageURL && !post?.body && (
									<Flex
										justify={'center'}
										p={2}
										height={'8rem'}
										width={'8rem'}
										flexGrow={1}
									>
										<Image
											src={post?.imageURL}
											maxHeight={'460px'}
											alt=""
											objectFit={'cover'}
										/>
									</Flex>
								)}
							</HStack>
						) : (
							<VStack
								align={'start'}
								width={'100%'}
							>
								<VStack align={'start'}>
									<Text fontSize={'12pt'} fontWeight={600}>
										{post?.title}
									</Text>
									
								</VStack>
								{post?.imageURL && !post?.body && (
									<Flex
										justify={'center'}
										p={2}
										
										flexGrow={1}
									>
										<Image
											src={post?.imageURL}
											maxHeight={'460px'}
											alt=""
											objectFit={'cover'}
										/>
									</Flex>
								)}
							</VStack>
						)}
					</Stack>
				</Flex>
				<Flex p={'10px'}>
					<Icon
						as={
							userVoteValue === 1
								? IoArrowUpCircleOutline
								: IoArrowUpCircleOutline
						}
						color={
							userVoteValue === 1 ? 'brand.100' : 'gray.400'
						}
						fontSize={22}
						onClick={onVote}
					/>
					<Text mx={2}>{post?.voteStatus}</Text>
					<Icon
						as={
							userVoteValue === -1
								? IoArrowDownCircleOutline
								: IoArrowDownCircleOutline
						}
						color={
							userVoteValue === -1 ? 'red.500' : 'gray.400'
						}
						fontSize={22}
						onClick={onVote}
					/>
				</Flex>
			</Flex>
		</>
	);
};
export default PostItem;
