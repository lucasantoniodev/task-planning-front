import {
  AppShell,
  Box,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { planningRoomPage } from '../../router/router.tsx';
import { findPlanningRoomById } from './api.ts';

export const PlanningRoom = () => {
  const { id } = useParams({ from: planningRoomPage.id });

  const { data: currentRoom } = useQuery({
    queryKey: ['planningRoom', id],
    queryFn: () => findPlanningRoomById(id),
  });

  if (!currentRoom) {
    return <div>Página não encontrada!</div>;
  }

  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Group align="start" grow>
          {/* Lista de salas */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="w-full max-w-[400px]"
          >
            <Title order={3} className="mb-4 text-green-800">
              Salas Criadas
            </Title>
            <ScrollArea h={400}>
              <Stack>
                {[{ id: '', title: '' }]?.map((room) => (
                  <Card
                    key={room.id}
                    padding="sm"
                    radius="md"
                    shadow="xs"
                    withBorder
                  >
                    <Text fw={500}>{room.title}</Text>
                    <Text size="sm" c="dimmed">
                      ID: {room.id}
                    </Text>
                  </Card>
                )) || <Text size="sm">Nenhuma sala encontrada</Text>}
              </Stack>
            </ScrollArea>
          </Card>

          {/* Usuários da sala */}
          <Box className="flex-1">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} className="mb-4 text-green-800">
                Usuários em {currentRoom.title}
              </Title>
              <ScrollArea h={400}>
                <Stack>
                  {[].map((user: any) => (
                    <Card
                      key={user.id}
                      padding="sm"
                      radius="md"
                      shadow="xs"
                      withBorder
                    >
                      <Group justify="space-between">
                        <Text fw={500}>{user.name}</Text>
                        <Text size="sm" c="dimmed">
                          {user.role}
                        </Text>
                      </Group>
                    </Card>
                  )) || <Text size="sm">Nenhum usuário na sala</Text>}
                </Stack>
              </ScrollArea>
            </Card>
          </Box>
        </Group>
      </AppShell.Main>
    </AppShell>
  );
};
