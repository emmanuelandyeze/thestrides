import { AuthModalState } from '@/src/atoms/authModalAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import {
	Button,
	Flex,
	Input,
	Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { addDoc, collection, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type SignUpProps = {};

const SignUp: React.FC<SignUpProps> = () => {
	const setAuthModalState =
		useSetRecoilState(AuthModalState);
	const [error, setError] = useState('')
	const [signupForm, setSignUpForm] = useState({
		email: '',
        password: '',
		confirmPassword: '',
	});
	const [
		createUserWithEmailAndPassword,
		userCred,
		loading,
		userError
	] = useCreateUserWithEmailAndPassword(auth)

	const onSubmit = (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault()
		if (error) setError('');
		if (!signupForm.email.includes('@')) {
			return setError('Please enter a valid email');
		}
		if (
			signupForm.password !== signupForm.confirmPassword
		) {
			return setError('Passwords do not match');

		}
		createUserWithEmailAndPassword(
			signupForm.email,
			signupForm.password,
		);
		
	};

	const onChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSignUpForm((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const createUserDocument = async(user: User) => {
		await addDoc(collection(firestore, "users"), JSON.parse(JSON.stringify(user)))
	}

	useEffect(() => {
		if (userCred) {
			createUserDocument(userCred.user);
		}
	}, [userCred]);


	return (
		<>
			<form onSubmit={onSubmit}>
				
				<Input
					required
					name="email"
					placeholder="Email Address"
					type="email"
					mb={2}
					fontSize={'10pt'}
					_placeholder={{ color: 'gray.500' }}
					_hover={{
						bg: 'white',
						border: '1px solid',
						borderColor: 'purple.500',
					}}
					bg={'gray.50'}
					onChange={onChange}
				/>
				<Input
					required
					name="password"
					placeholder="Password"
					type="password"
					mb={2}
					fontSize={'10pt'}
					_placeholder={{ color: 'gray.500' }}
					_hover={{
						bg: 'white',
						border: '1px solid',
						borderColor: 'purple.500',
					}}
					bg={'gray.50'}
					onChange={onChange}
				/>
				<Input
					required
					name="confirmPassword"
					placeholder="Confirm Password"
					type="password"
					mb={2}
					fontSize={'10pt'}
					_placeholder={{ color: 'gray.500' }}
					_hover={{
						bg: 'white',
						border: '1px solid',
						borderColor: 'purple.500',
					}}
					bg={'gray.50'}
					onChange={onChange}
				/>
				{error ||
					(userError && (
						<Text
							textAlign={'center'}
							color={'red'}
							fontSize={'10pt'}
						>
							{error || userError.message}
						</Text>
					))}

				<Button
					width={'100%'}
					height={'36px'}
					mt={2}
					mb={5}
					type="submit"
					isLoading={loading}
				>
					Sign Up
				</Button>
				<Flex fontSize={'9pt'} justifyContent={'center'}>
					<Text mr={1}>Already have an account? </Text>
					<Text
						color={'purple.900'}
						cursor={'pointer'}
						fontWeight={700}
						onClick={() =>
							setAuthModalState((prev) => ({
								...prev,
								view: 'login',
							}))
						}
					>
						LOG IN
					</Text>
				</Flex>
			</form>
		</>
	);
};
export default SignUp;
