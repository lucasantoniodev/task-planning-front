import { createTheme, PasswordInput, Text, TextInput } from '@mantine/core';

export const theme = createTheme({
  components: {
    Text: Text.extend({
      classNames: {
        root: 'text-[#383838]',
      },
    }),
    TextInput: TextInput.extend({
      styles: {
        label: {
          color: '#383838',
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      styles: {
        label: {
          color: '#383838',
        },
      },
    }),
  },
});
