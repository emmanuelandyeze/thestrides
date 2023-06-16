import { ComponentStyleConfig } from '@chakra-ui/theme'

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: '8px',
        fontSize: '10pt',
        fontWeight: 700,
        _focus: {
            boxShadow: 'none'
        }
    },
    sizes: {
        sm: {
            fontSize: '8pt'
        },
        md: {
            fontSize: '10pt'
        },
    },
    variants: {
        solid: {
            color: 'white',
            bg: 'purple.900',
            _hover: {
                bg: 'purple.800'
            }
        },
        outline: {
            color: 'purple.900',
            border: '1px solid',
            borderColor: 'purple.900'
        },
        oauth: {
            height: '34px',
            border: '1px solid',
            borderColor: 'gray.300',
            _hover: {
                bg: 'gray.50'
            }
        }
    }
}