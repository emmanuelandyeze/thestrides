import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Menu,
	MenuButton,
	Button,
	MenuList,
	MenuItem,
	Icon,
	Image,
	Flex,
	MenuDivider,
	Box,
	Text,
} from '@chakra-ui/react';
import { User, signOut } from 'firebase/auth';
import React from 'react';

import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { IoSparkles } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin } from 'react-icons/md';
import { auth } from '@/src/firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { AuthModalState } from '@/src/atoms/authModalAtom';
import { communityState } from '@/src/atoms/communitiesAtom';

type UserMenuProps = {
	user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
	const setAuthModalState = useSetRecoilState(AuthModalState)
	const resetCommunityState = useResetRecoilState(communityState)

	const logout = () => {
		signOut(auth);
		resetCommunityState()
	}
	return (
		<>
			<Menu>
				<MenuButton
					cursor={'pointer'}
					padding={{ base: '3px 8px', md: '3px 3px' }}
					borderRadius={4}
					_hover={{
						outline: '1px solid',
						outlineColor: 'gray.200',
					}}
				>
					{!user ? (
						<Flex align={'center'}>
							<Flex align={'center'}>
								<>
									<Icon
										fontSize={30}
										mr={2}
										as={CgProfile}
									/>
								</>
								<ChevronDownIcon />
							</Flex>
						</Flex>
					) : (
						<Flex align={'center'}>
							<>
								<Image
									src="https://firebasestorage.googleapis.com/v0/b/stridesconnect-864a1.appspot.com/o/profile%2Femmanuel.andyeze%2Fimage?alt=media&token=59ff9c8a-a8bf-467f-a372-eff4d8906d94"
									alt=""
										height={'40px'}
										rounded={'full'}
										objectFit={'cover'}
									width={'40px'}
									mr={1}
									color={'gray.300'}
								/>
								<Box
									display={{ base: 'none', lg: 'flex' }}
									flexDirection="column"
									fontSize="8pt"
									alignItems="flex-start"
									mr={8}
								>
									<Text fontWeight={700}>
										{user?.displayName ||
											user?.email?.split('@')[0]}
									</Text>
									<Flex alignItems="center">
										<Icon
											as={IoSparkles}
											color="brand.100"
											mr={1}
										/>
										<Text color="gray.400">1 stride</Text>
									</Flex>
								</Box>
							</>
							<ChevronDownIcon />
						</Flex>
					)}
				</MenuButton>

				<MenuList>
					{user ? (
						<>
							<MenuItem
								fontSize={'10pt'}
								fontWeight={700}
								_hover={{
									bg: 'purple.900',
									color: 'white',
								}}
							>
								<Flex align={'center'}>
									<Icon
										fontSize={20}
										mr={2}
										as={CgProfile}
									/>
									Profile
								</Flex>
							</MenuItem>
							<MenuDivider />
							<MenuItem
								fontSize={'10pt'}
								fontWeight={700}
								_hover={{
									bg: 'purple.900',
									color: 'white',
								}}
								onClick={logout}
							>
								<Flex align={'center'}>
									<Icon
										fontSize={20}
										mr={2}
										as={MdOutlineLogin}
									/>
									Logout
								</Flex>
							</MenuItem>
						</>
					) : (
						<>
							<MenuItem
								fontSize={'10pt'}
								fontWeight={700}
								_hover={{
									bg: 'purple.900',
									color: 'white',
								}}
								onClick={() =>
									setAuthModalState({
										open: true,
										view: 'login',
									})
								}
							>
								<Flex align={'center'}>
									<Icon
										fontSize={20}
										mr={2}
										as={MdOutlineLogin}
									/>
									Login/ Sign Up
								</Flex>
							</MenuItem>
						</>
					)}
				</MenuList>
			</Menu>
		</>
	);
};
export default UserMenu;
