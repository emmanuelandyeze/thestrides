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
			bg="white"
			height={'50px'}
			justifyContent={'space-between'}
			padding={'6px 12px 5px 5px'}
			position={'fixed'}
			zIndex={50}
			width={'100%'}
		>
			<Flex align={'center'} cursor={'pointer'} onClick={() => onSelectMenuItem(defaultMenuItem)}>
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
				/>
			</Flex>
			{user && <Directory />}

			<SearchInput />
			<RightContent user={user} />
		</Flex>
	);
};
export default Navbar;
