import {
	Box,
	Divider,
	Flex,
	Icon,
	MenuItem,
	Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';
import {IoIosPeople} from 'react-icons/io'
import Link from 'next/link';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
	const [open, setOpen] = useState(false);
	const mySnippets =
		useRecoilValue(communityState).mySnippets;

	return (
		<>
			<CreateCommunityModal
				open={open}
				handleClose={() => setOpen(false)}
			/>
			<Link href={'/'}>
				<Text px={3} fontSize={'11pt'} py={2} _hover={{bg: 'purple.600', color: 'white'}}>
					Your Feed
				</Text>
			</Link>
			<Divider />
			<Box mt={3} mb={4}>
				<Text
					pl={3}
					mb={1}
					fontSize="7pt"
					fontWeight={500}
					color="gray.500"
				>
					MODERATING
				</Text>
				{mySnippets
					.filter((snippet) => snippet.isModerator)
					.map((snippet) => (
						<MenuListItem
							key={snippet.communityId}
							icon={IoIosPeople}
							displayText={`c/${snippet.communityId}`}
							link={`/c/${snippet.communityId}`}
							iconColor="brand.100"
							imageURL={snippet.imageURL}
						/>
					))}
			</Box>
			<Divider />
			<Box mt={3} mb={4}>
				<Text
					pl={3}
					mb={1}
					fontSize="7pt"
					fontWeight={500}
					color="gray.500"
				>
					MY COMMUNITIES
				</Text>
				<MenuItem
					width="100%"
					fontSize="10pt"
					_hover={{ bg: 'gray.100' }}
					onClick={() => setOpen(true)}
				>
					<Flex align="center">
						<Icon fontSize={20} mr={2} as={GrAdd} />
						Create Community
					</Flex>
				</MenuItem>
				{mySnippets.map((snippet) => (
					<MenuListItem
						key={snippet.communityId}
						icon={IoIosPeople}
						displayText={`c/${snippet.communityId}`}
						link={`/c/${snippet.communityId}`}
						iconColor="purple.500"
						imageURL={snippet.imageURL}
					/>
				))}
			</Box>
		</>
	);
};
export default Communities;
