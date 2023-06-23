import { Community } from '@/src/atoms/communitiesAtom';
import { Button, Image, Text } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import useCommunityData from '@/src/hooks/useCommunityData';

type HeaderProps = {
	communityData: Community;
};

const Header: React.FC<HeaderProps> = ({
	communityData,
}) => {
	const { onJoinOrLeaveCommunity, communityStateValue, loading } =
		useCommunityData();
	const isJoined = !!communityStateValue.mySnippets.find(
		(item) => item.communityId === communityData.id,
	);

	return (
		<>
			<Flex
				direction={'column'}
				width={'100%'}
				height={'100px'}
				pt={5}
				bg={'gray.200'}
			>
				{/* <Box height={'10%'} bg={'gray.500'}></Box> */}
				<Flex
					justify={'center'}
					bg={'gray.200'}
					flexGrow={1}
				>
					<Flex
						width={'95%'}
						maxWidth={'800px'}
						borderBottom={{ base: '.5px solid', md: 'none' }}
						pb={2}
					>
						{communityStateValue.currentCommunity
							?.imageURL ? (
							<Image
								borderRadius="full"
								boxSize="86px"
								src={
									communityStateValue.currentCommunity
										?.imageURL
								}
								alt=""
								position="relative"
								top={-3}
								color="blue.500"
								border="4px solid white"
								objectFit={'cover'}
							/>
						) : (
							<Image
								borderRadius="full"
								boxSize="66px"
								src="/images/logo.png"
								alt=""
								position="relative"
								top={-3}
								color="blue.500"
								border="4px solid white"
								bg={'white'}
								shadow={'md'}
							/>
						)}
						<Flex padding={'0px 16px'}>
							<Flex direction={'column'} mr={6}>
								<Text fontWeight={800} fontSize={'16pt'}>
									{communityData?.communityName}
								</Text>
								<Text
									fontWeight={600}
									fontSize={'10pt'}
									color={'gray.400'}
								>
									c/{communityData.id}
								</Text>
							</Flex>
							<Flex>
								<Button
									variant={isJoined ? 'outline' : 'solid'}
									height="30px"
									pr={6}
									pl={6}
									onClick={() =>
										onJoinOrLeaveCommunity(
											communityData,
											isJoined,
										)
									}
									isLoading={loading}
								>
									{isJoined ? 'Joined' : 'Join'}
								</Button>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};
export default Header;
