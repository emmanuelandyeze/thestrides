import { auth, firestore } from '@/src/firebase/clientApp';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Text,
	Box,
	Input,
	Stack,
    Checkbox,
    Flex,
    Icon
} from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import {HiLockClosed} from 'react-icons/hi2'

type CreateCommunityModalProps = {
	open: boolean;
	handleClose: () => void;
};

const CreateCommunityModal: React.FC<
	CreateCommunityModalProps
	> = ({ open, handleClose }) => {
	const [user] = useAuthState(auth)
	const [communityName, setCommunityName] = useState('');
	const [communityHandle, setCommunityHandle] = useState('');
	const [communityType, setCommunityType] =
		useState('public');
	const [charsRemaining, setCharsRemaining] = useState(50);
		const [error, setError] = useState('')
		const [loading, setLoading] = useState(false)

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (event.target.value.length > 50) return;
		setCommunityHandle(event.target.value);

		setCharsRemaining(50 - event.target.value.length);
		};
		
		const handleName = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			setCommunityName(event.target.value);
		}

	const onCommunityTypeChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setCommunityType(event.target.name);
	};

		const handleCreateCommunity = async () => {
		setLoading(true)
		//Validate the community name
		 const format =
				/[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

			if (format.test(communityHandle) || communityHandle.length < 3) {
				return setError(
					'Community handles must be between 3–21 characters, and can only contain letters, numbers, or underscores.',
				);
				setLoading(false)
			}
		try {
			//Create the community document in Firestore
			const communityDocRef = doc(
				firestore,
				'communities',
				communityHandle,
			);

			await runTransaction(firestore, async(transaction) => {
				const communityDoc = await transaction.get(
					communityDocRef,
				);
				if (communityDoc.exists()) {
					throw new Error(
						`Sorry, ${communityHandle} is already taken. Choose another.`,
					);
				}

				//Create Community
				transaction.set(communityDocRef, {
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberOfMembers: 1,
					privacyType: communityType,
					communityName,
					communityHandle,
				});

				//Create community snippet
				transaction.set(
					doc(
						firestore,
						`users/${user?.uid}/communitySnippets`,
						communityHandle
					), {
						communityId: communityHandle,
						communityName: communityName,
						isModerator: true
					}
				);
			})
		
			

			setLoading(false);
		} catch (error: any) {
			console.log('handlecreatecommunity ERROR')
			setError(error.message)
			setLoading(false)
		}
	}

	return (
		<>
			<Modal
				blockScrollOnMount={false}
				isOpen={open}
				onClose={handleClose}
				size={'lg'}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create a Community</ModalHeader>
					<Box pl={3} pr={3}>
						<ModalCloseButton />
						<ModalBody
							display={'flex'}
							flexDirection={'column'}
							padding={'10px 0px'}
						>
							<Text fontWeight={600} fontSize={15}>
								Choose Handle
							</Text>
							<Text fontSize={11} color={'gray.500'}>
								Community handle including capitalization
								cannot be changed
							</Text>
							<Text
								position={'relative'}
								top={'26px'}
								left={'10px'}
								width={'20px'}
								color={'gray.400'}
							>
								c/
							</Text>
							<Input
								position={'relative'}
								value={communityHandle}
								size={'sm'}
								pl={'22pt'}
								onChange={handleChange}
							/>
							<Text
								fontSize={11}
								color={
									charsRemaining === 0 ? 'red' : 'gray.500'
								}
							>
								{charsRemaining} characters remaining
							</Text>
							<Text fontSize={11} color={'red'}>
								{error}
							</Text>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Name
								</Text>
								
								<Input
									
									value={communityName}
									size={'sm'}
									pl={'4pt'}
									onChange={handleName}
								/>
							</Box>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Community Type
								</Text>
								<Stack spacing={2}>
									<Checkbox
										name="public"
										isChecked={communityType === 'public'}
										onChange={onCommunityTypeChange}
									>
										<Flex align={'center'}>
											<Icon
												as={BsFillPersonFill}
												color={'gray.500'}
												mr={2}
											/>
											<Text fontSize={'10pt'} mr={1}>
												Public
											</Text>
											<Text
												fontSize={'8pt'}
												color={'gray.500'}
											>
												Anyone can view, post and comment to
												this community.
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name="restricted"
										isChecked={
											communityType === 'restricted'
										}
										onChange={onCommunityTypeChange}
									>
										<Flex align={'center'}>
											<Icon
												as={BsFillEyeFill}
												color={'gray.500'}
												mr={2}
											/>
											<Text fontSize={'10pt'} mr={1}>
												Restricted
											</Text>
											<Text
												fontSize={'8pt'}
												color={'gray.500'}
											>
												Anyone can view, but only approved
												users can post to this community.
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name="private"
										isChecked={communityType === 'private'}
										onChange={onCommunityTypeChange}
									>
										<Flex align={'center'}>
											<Icon
												as={HiLockClosed}
												color={'gray.500'}
												mr={2}
											/>
											<Text fontSize={'10pt'} mr={1}>
												Private
											</Text>
											<Text
												fontSize={'8pt'}
												color={'gray.500'}
											>
												Only approved users can view, post
												and comment to this community.
											</Text>
										</Flex>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleClose}
							bg={'white'}
							color={'gray.900'}
							border={'1px solid'}
							_hover={{ color: 'white', bg: 'purple.900' }}
						>
							Close
						</Button>
						<Button
							isLoading={loading}
							onClick={handleCreateCommunity}
						>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default CreateCommunityModal;
