import { AuthModalState } from '@/src/atoms/authModalAtom';
import { Button } from '@chakra-ui/react';
import React from 'react';
import {useSetRecoilState} from 'recoil'

const AuthButtons: React.FC = () => {
    const setAuthModalState = useSetRecoilState(AuthModalState)
	return (
		<>
			<Button
				variant={'outline'}
				mr={2}
				height={'33px'}
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				onClick={() =>
					setAuthModalState({ open: true, view: 'login' })
				}
			>
				Login
			</Button>
			<Button
				variant={'solid'}
				mr={2}
				height={'33px'}
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				onClick={() =>
					setAuthModalState({ open: true, view: 'signup' })
				}
			>
				Sign Up
			</Button>
		</>
	);
};
export default AuthButtons;
