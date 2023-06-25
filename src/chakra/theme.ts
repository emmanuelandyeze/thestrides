import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/nunito/400.css'
import { Button } from './button';

export const theme = extendTheme({
	initialColorMode: 'system',
	useSystemColorMode: true,
	colors: {
		brand: {
			100: '#3B0764',
		},
	},
	fonts: {
		body: 'Nunito, sans-serif',
	},
	styles: {
		global: () => ({
			body: {
				bg: 'white',
			},
		}),
	},
	components: {
		Button,
	},
});
