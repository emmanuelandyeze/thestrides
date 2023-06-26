import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import Directory from './Directory/Directory';
import Link from 'next/link';
import useDirectory from '@/src/hooks/useDirectory';
import { defaultMenuItem } from '@/src/atoms/directoryMenuAtom';

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth)
	const {onSelectMenuItem} = useDirectory()
	return (
		<Flex
			width="100%"
			// justify="center"
			maxWidth={'860px'}
		>
			<Flex
				bg="white"
				height={'50px'}
				justifyContent={'space-between'}
				padding={{
					base: '12px 12px 12px 5px',
					md: '12px 250px 12px 250px',
				}}
				position={'fixed'}
				zIndex={50}
				width={'100%'}
				shadow={'sm'}
			>
				<Flex align={'center'} cursor={'pointer'}>
					<Image
						src="/images/logo.png"
						alt=""
						height={'46px'}
						objectFit={'cover'}
						display={{
							base: 'flex',
							md: 'none',
							lg: 'none',
							xl: 'none',
						}}
						onClick={() =>
							onSelectMenuItem(defaultMenuItem)
						}
					/>
					<Image
						src="/images/text.png"
						alt=""
						height={'18px'}
						mr={2}
						display={{
							base: 'none',
							md: 'none',
							lg: 'none',
							xl: 'flex',
						}}
						onClick={() =>
							onSelectMenuItem(defaultMenuItem)
						}
					/>
					{user && <Directory />}
				</Flex>

				{/* <SearchInput /> */}
				<RightContent user={user} />
			</Flex>
		</Flex>
	);
};
export default Navbar;
