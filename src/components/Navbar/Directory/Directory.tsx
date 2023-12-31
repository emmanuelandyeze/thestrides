import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Flex,
	Icon,
	Image,
	Menu,
	MenuButton,
	MenuList,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import { TiHome } from 'react-icons/ti';
import useDirectory from '../../../hooks/useDirectory';
import Communities from './Communities';

const Directory: React.FC = () => {
	const { directoryState, toggleMenuOpen } = useDirectory();

	return (
		<Menu isOpen={directoryState.isOpen}>
			<MenuButton
				cursor="pointer"
				padding={{ base: '1px 6px', md: '0px 8px' }}
				borderRadius={4}
				mr={2}
				ml={{ base: 0, md: 2 }}
				_hover={{
					outline: '1px solid',
					outlineColor: 'gray.200',
				}}
				onClick={toggleMenuOpen}
				bg={'gray.600'}
				color={'white'}
			>
				<Flex
					align="center"
					justify="space-between"
					width={{ base: 'auto', lg: '200px' }}
				>
					<Flex align="center">
						{directoryState.selectedMenuItem.imageURL ? (
							<Image
								src={
									directoryState.selectedMenuItem.imageURL
								}
								borderRadius="full"
								boxSize="30px"
								mr={2}
								alt=""
								objectFit={'cover'}
								onClick={toggleMenuOpen}
							/>
						) : (
							<Icon
								fontSize={24}
								mr={{ base: 1, md: 2 }}
								as={directoryState.selectedMenuItem.icon}
								color={
									directoryState.selectedMenuItem.iconColor
								}
								onClick={toggleMenuOpen}
							/>
						)}
						<Flex display={{ base: 'flex', lg: 'flex' }}>
							<Text fontWeight={600} fontSize="10pt">
								{
									directoryState.selectedMenuItem
										.displayText
								}
							</Text>
						</Flex>
					</Flex>
					<Flex display={{ base: 'block', md: 'block' }}>
						<ChevronDownIcon />
					</Flex>
				</Flex>
			</MenuButton>
			<MenuList>
				<Communities />
			</MenuList>
		</Menu>
	);
};
export default Directory;
