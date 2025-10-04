import {
  ActionIcon,
  AppShell,
  Box,
  Card,
  Center,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconMoodHeart } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth.ts';
import { useSocket } from '../../hooks/use-socket.ts';
import { planningRoomPage } from '../../router/router.tsx';
import { findPlanningRoomById } from './api.ts';
import { TaskStatusEnum } from './enums/task-status.enum.ts';
import { PlanningRoomEvents, TaskPlanningEventsEnum } from './events.enum.ts';
import type { Player, Task, TaskState } from './model.ts';

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
  }, [currentRoom, socket]);

  socket?.on(PlanningRoomEvents.TASK_LIST, setTasks);
  socket?.on(PlanningRoomEvents.ROOM_STATE, (data) => {
    setPlayers(data.players);
  });

  const handleOnClickVote = (task: Task) => {
    openModal({
      title: <Text className="mb-4 text-green-800">{task.description}</Text>,
      fullScreen: true,
      children: <TaskPlanning task={task} />,
      onClose: () => {
        socket?.emit(TaskPlanningEventsEnum.LEAVE, { taskId: task.id });
      },
    });
  };

  return !currentRoom ? (
    <div>Página não encontrada!</div>
  ) : (
    <AppShell padding="md">
      <AppShell.Main>
        <Group justify="space-between" align="start">
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
                {tasks
                  .filter((task) => task.status === TaskStatusEnum.PENDING)
                  .map((task) => (
                    <Card
                      key={task.id}
                      padding="sm"
                      radius="md"
                      shadow="xs"
                      withBorder
                    >
                      <Text fw={500}>{task.description}</Text>
                      <Text size="sm" c="dimmed">
                        ID: {task.id}
                      </Text>

                      <Group justify="end" className="mt-2">
                        <Tooltip label="Votar">
                          <ActionIcon
                            variant="transparent"
                            className="text-green-700 hover:text-green-800"
                            onClick={() => handleOnClickVote(task)}
                          >
                            <IconMoodHeart />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
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

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="w-full max-w-[400px]"
          >
            <Title order={3} className="mb-4 text-green-800">
              Atividades concluídas
            </Title>
            <ScrollArea h={400}>
              <Stack>
                {tasks
                  .filter((task) => task.status === TaskStatusEnum.COMPLETED)
                  .map((room) => (
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
        </Group>
      </AppShell.Main>
    </AppShell>
  );
};

interface TaskPlanningProps {
  task: Task;
}

export function TaskPlanning({ task }: TaskPlanningProps) {
  const user = useAuth();

  const { socket } = useSocket();
  const [taskState, setTaskState] = useState<TaskState>({
    id: task.id,
    votes: [],
    status: TaskStatusEnum.PENDING,
    players: [],
  });

  useEffect(() => {
    socket?.emit(TaskPlanningEventsEnum.JOIN, { taskId: task.id });
  }, [socket, task.id]);

  useEffect(() => {
    socket?.on(`${TaskPlanningEventsEnum.TASK_BY_ID}${task.id}`, setTaskState);
    return () => {
      socket?.off(`${TaskPlanningEventsEnum.TASK_BY_ID}${task.id}`);
    };
  }, [socket, task.id]);

  if (!user) {
    return <></>;
  }

  const handleVote = (value: string) => {
    socket?.emit(TaskPlanningEventsEnum.VOTE, {
      taskId: task.id,
      value,
    });
  };

  const hasVoted = (userUid: string) =>
    taskState.votes.some((v) => v.userUid === userUid);

  const currentVote = taskState.votes.find((v) => v.userUid === user.uid);

  return (
    <Center className="relative w-full flex-1">
      <Stack className="h-full" align="center" justify="space-between">
        {/* MESA CENTRAL */}
        <div className="relative w-96 h-96 bg-green-800 rounded-full shadow-lg flex items-center justify-center">
          <Text className="text-white font-bold text-xl">Mesa</Text>

          {/* Cartas jogadas */}
          <AnimatePresence>
            {taskState.votes.map((vote, index) => {
              const angle = (index / taskState.votes.length) * 2 * Math.PI;
              const x = Math.cos(angle) * 190;
              const y = Math.sin(angle) * 130;

              const player = taskState.players.find(
                (p) => p.uid === vote.userUid,
              );

              return (
                <motion.div
                  key={vote.userUid}
                  initial={{ y: 250, opacity: 0, rotate: -20 }}
                  animate={{
                    x,
                    y,
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{ y: 250, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="absolute w-14 h-20 bg-white rounded-md shadow-lg flex items-center justify-center"
                >
                  {player && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-md bg-gray-200">
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Text className="text-green-800 font-bold text-lg">❓</Text>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* JOGADORES */}
        <Group wrap="wrap" justify="center" className="w-full p-4">
          {taskState.players.map((player) => {
            const isCurrentUser = player.uid === user.uid;
            const voted = hasVoted(player.uid);

            return (
              <Stack
                key={player.id}
                align="center"
                className="m-2 min-w-[100px]"
              >
                <img
                  src={player.photoUrl}
                  alt="profile"
                  className={`w-14 h-14 rounded-full object-cover shadow-md ${
                    isCurrentUser ? 'ring-2 ring-green-600' : ''
                  }`}
                />
                <Text size="sm" className="font-medium text-center">
                  {player.name}
                </Text>

                {isCurrentUser ? (
                  <AnimatePresence>
                    {!currentVote && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex gap-2 mt-1"
                      >
                        {['1', '2', '3', '5', '8'].map((num) => (
                          <motion.button
                            key={num}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-12 bg-white rounded-md shadow text-green-800 font-bold"
                            onClick={() => handleVote(num)}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <Text size="xs" c="dimmed">
                    {voted ? 'Votou ✅' : 'Aguardando...'}
                  </Text>
                )}
              </Stack>
            );
          })}
        </Group>
      </Stack>
    </Center>
  );
}
