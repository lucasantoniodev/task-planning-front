import { createTheme, Text, TextInput } from '@mantine/core';

export const theme = createTheme({
  components: {
    Text: Text.extend({
      styles: {
        root: {
          color: '#383838',
        },
      },
    }),
    TextInput: TextInput.extend({
      styles: {
        label: {
          color: '#383838',
        },
      },
    }),
  },
});
