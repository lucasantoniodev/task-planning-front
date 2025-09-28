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
import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/use-socket.ts';
import { planningRoomPage } from '../../router/router.tsx';
import { findPlanningRoomById } from './api.ts';
import { PlanningRoomEvents } from './events.enum.ts';
import type { Player, Task } from './model.ts';

export const PlanningRoom = () => {
  const { id } = useParams({ from: planningRoomPage.id });
  const { socket } = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const { data: currentRoom } = useQuery({
    queryKey: ['planningRoom', id],
    queryFn: () => findPlanningRoomById(id),
  });

  useEffect(() => {
    if (currentRoom) {
      socket?.emit('room:join', {
        roomId: currentRoom.id,
      });
    }
  }, [currentRoom, socket?.emit]);

  socket?.on(PlanningRoomEvents.TASK_LIST, setTasks);
  socket?.on(PlanningRoomEvents.ROOM_STATE, (data) => {
    setPlayers(data.players);
  });

  return !currentRoom ? (
    <div>Página não encontrada!</div>
  ) : (
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
              Atividades pendentes
            </Title>
            <ScrollArea h={400}>
              <Stack>
                {tasks.map((room) => (
                  <Card
                    key={room.id}
                    padding="sm"
                    radius="md"
                    shadow="xs"
                    withBorder
                  >
                    <Text fw={500}>{room.description}</Text>
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
                Participantes
              </Title>
              <ScrollArea h={400}>
                <Stack>
                  {players.map((user: Player) => (
                    <Card
                      key={user.id}
                      padding="sm"
                      radius="md"
                      shadow="xs"
                      withBorder
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Text fw={500}>{user.name}</Text>
                        <img
                          src={user.photoUrl}
                          alt="profile"
                          className="w-10 h-10 object-cover rounded-full"
                        />
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
