import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};
// 3. extend the theme
const theme = extendTheme({
  config,
  styles: {
    global: ({ colorMode }) => ({
      // styles for the `body`
      body: {
        bg: colorMode === 'dark' ? '#36393f' : '#fafafa',
        color: colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },

  components: {
    Button: {
      baseStyle: {
        color: 'white',
      },
    },
    Input: {
      baseStyle: {
        color: mode('black', 'white'),
      },
    },
    Editable: {
      baseStyle: {},
    },
  },
});
export default theme;
