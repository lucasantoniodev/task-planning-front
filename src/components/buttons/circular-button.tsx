import { ActionIcon, Center } from '@mantine/core';
import type { PropsWithChildren } from 'react';

export function CircularActionIcon({ children }: PropsWithChildren) {
  return (
    <Center>
      <ActionIcon
        type="submit"
        size="xl"
        radius="xl"
        variant="filled"
        aria-label="Próxima página"
        className="bg-green-700 hover:bg-green-800"
      >
        {children}
      </ActionIcon>
    </Center>
  );
}
