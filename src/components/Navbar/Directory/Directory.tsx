import {
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuList,
	Text,
} from '@chakra-ui/react';
import React from 'react';

import { AuthModalState } from '@/src/atoms/authModalAtom';
import { useSetRecoilState } from 'recoil';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';

const Directory: React.FC = () => {
	const setAuthModalState =
		useSetRecoilState(AuthModalState);
	return (
		<>
			<Menu>
				<MenuButton
					cursor={'pointer'}
					padding={'3px 3px'}
					borderRadius={4}
					_hover={{
						outline: '1px solid',
						outlineColor: 'gray.200',
					}}
				>
					<Flex align={'center'} justify={'space-between'} width={{base: 'auto', lg: '200px'}}>
						<Flex align={'center'} alignItems={'center'}>
							<Icon
								as={TiHome}
								fontSize={24}
								mr={{ base: 1, md: 2 }}
							/>
							<Flex display={{base: 'none', lg: 'flex'}}>
								<Text fontWeight={600} fontSize={'10pt'}>Home</Text>
							</Flex>
						</Flex>
						<ChevronDownIcon />
					</Flex>
				</MenuButton>

                <MenuList>
                    <Communities />
                </MenuList>
			</Menu>
		</>
	);
};
export default Directory;
