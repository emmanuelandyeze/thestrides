import React from 'react';
import {
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';

type SearchInputProps = {
	// user:
};

const SearchInput: React.FC<SearchInputProps> = () => {
	return (
		<Flex
			width={{base: '50%', md: '50%'}}
			// flexGrow={1}
			mr={2}
			align={'center'}
		>
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<SearchIcon color="gray.400" mb={1} />
				</InputLeftElement>
				<Input
					type="text"
					placeholder="Search Strides"
					fontSize={'10pt'}
					_placeholder={{ color: 'gray.500' }}
					_hover={{
						bg: 'white',
						border: '1px solid',
						borderColor: 'blue.500',
					}}
					_focus={{
						outline: 'none',
						border: '1px solid',
						borderColor: 'blue.500',
					}}
					height={'40px'}
					bg={'gray.50'}
				/>
			</InputGroup>
		</Flex>
	);
};
export default SearchInput;
