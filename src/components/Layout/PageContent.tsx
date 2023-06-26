import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

interface PageContentProps {
    maxWidth?: string;
    children?: any
}

// Assumes array of two children are passed
const PageContent: React.FC<
	PageContentProps
> = ({ children, maxWidth }) => {
	return (
		<Flex justify="center" p="16px 0px">
			<Flex
				width="100%"
				justify="center"
				maxWidth={maxWidth || '1050px'}
			>
				
				<Flex
					direction="column"
					width={{ base: '100%', md: '65%' }}
					mr={{ base: 0, md: 6 }}
					
					borderColor={'gray.200'}
				>
					{children && children[0 as keyof typeof children]}
				</Flex>
				{/* Right Content */}
				<Box
					display={{ base: 'none', md: 'flex' }}
					flexDirection="column"
					flexGrow={1}
					
				>
					{children && children[1 as keyof typeof children]}
				</Box>
			</Flex>
		</Flex>
	);
};

export default PageContent;
