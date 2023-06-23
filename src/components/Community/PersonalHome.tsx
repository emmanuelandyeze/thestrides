import React from 'react';
import {
	Button,
	Flex,
	Icon,
	Stack,
	Text,
} from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';

const PersonalHome: React.FC = () => {
	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius={4}
			cursor="pointer"
			border="1px solid"
			borderColor="gray.300"
			position="sticky"
		>
			<Flex
				align="flex-end"
				color="white"
				p="6px 10px"
				bg="gray.500"
				height="34px"
				borderRadius="4px 4px 0px 0px"
				fontWeight={600}
				bgImage="url(/images/redditPersonalHome.png)"
				backgroundSize="cover"
			></Flex>
			<Flex direction="column" p="12px">
				<Flex align="center" mb={2}>
					<Icon
						as={IoIosPeople}
						fontSize={50}
						color="gray.500"
						mr={2}
					/>
					<Text fontWeight={600}>Home</Text>
				</Flex>
				<Stack spacing={3}>
					<Text fontSize="9pt">
						Your personal Strides frontpage, built for you.
					</Text>
					<Button height="30px" bg={'gray.500'}>Create Post</Button>
					<Button _hover={{bg: 'gray.500', color: 'white'}} borderColor={'gray.500'} bg={'white'} border={'.5px solid'} height="30px" color={'gray.500'}>
						Create Community
					</Button>
				</Stack>
			</Flex>
		</Flex>
	);
};
export default PersonalHome;
