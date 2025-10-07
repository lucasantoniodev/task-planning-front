import {
  ActionIcon,
  AppShell,
  Box,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import { openModal } from '@mantine/modals';
import { mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import { IconEye, IconMoodHeart } from '@tabler/icons-react';
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
      title: <Text className="text-white">{task.description}</Text>,
      fullScreen: true,
      classNames: {
        header: 'bg-[#009768] mb-4 text-black',
        content: 'bg-green-100',
        close: 'text-white',
      },
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
  const [ref, result] = useResizeObserver();
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

  // useEffect(() => {
  //   const mockPlayers: Player[] = Array.from({ length: 40 }).map((_, i) => ({
  //     id: `mock-${i}`,
  //     uid: i === 0 ? '8KJoWODXaBbKqI5vG0qrKDK8FTh1' : `mock-${i}`,
  //     name: `Player ${i + 1}`,
  //     photoUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  //     joinedAt: 0,
  //   }));
  //
  //   setTaskState((prev) => ({
  //     ...prev,
  //     players: mockPlayers,
  //     votes: mockPlayers.map((player) => ({ userUid: player.uid, vote: 0 })),
  //   }));
  // }, []);

  if (!user) return null;

  const handleVote = (value: number) => {
    socket?.emit(TaskPlanningEventsEnum.VOTE, {
      taskId: task.id,
      value,
    });
  };

  const totalActive = taskState.players.filter((p) => !p.isObserver).length;
  const votedCount = taskState.votes.filter((v) => {
    const player = taskState.players.find((p) => p.uid === v.userUid);
    return player && !player.isObserver;
  }).length;

  return (
    <div ref={ref} className="flex flex-col lg:flex-row h-full">
      {/* COLUNA JOGADORES */}
      <div className="lg:w-1/4 w-full lg:h-auto overflow-y-auto mb-6 lg:mb-0 lg:mr-4">
        <Card
          withBorder
          radius="lg"
          shadow="md"
          className="w-full h-auto lg:h-full lg:min-h-[850px] lg:max-h-[850px] max-h-[600px] bg-green-50 flex flex-col"
        >
          <Stack gap="sm" className="flex-shrink-0">
            {/* Header com contador */}
            <Group justify="space-between" align="center">
              <Title order={4} className="text-green-800">
                Jogadores
              </Title>
              <Box
                className={`px-2 rounded-md ${
                  votedCount === totalActive
                    ? 'bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Text className="text-white text-sm font-medium transition">
                  {votedCount}/{totalActive}
                </Text>
              </Box>
            </Group>

            {/* Usuário atual em destaque */}
            {taskState.players
              .filter((player) => player.uid === user.uid)
              .map((player) => {
                const currentVote = taskState.votes.find(
                  (v) => v.userUid === player.uid,
                );

                return (
                  <Card
                    key={player.id}
                    radius="md"
                    shadow="sm"
                    className="bg-green-100 border border-green-500 mx-auto w-fit px-6 py-4 relative"
                  >
                    {!player.isObserver && (
                      <button
                        onClick={() => {
                          socket?.emit(TaskPlanningEventsEnum.OBSERVER, {
                            taskId: task.id,
                          });
                        }}
                        className="absolute top-2 right-2"
                        title="Sair da votação (virar observador)"
                      >
                        <IconEye className="text-gray-600 hover:text-gray-800" />
                      </button>
                    )}

                    <Stack align="center" gap="xs">
                      <Text className="font-semibold text-green-800">
                        {player.name}
                      </Text>
                      <div className="relative">
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className={`w-20 h-20 rounded-full object-cover shadow-lg ${
                            player.isObserver
                              ? 'opacity-50 grayscale'
                              : 'ring-4 ring-green-500'
                          }`}
                        />
                        <span
                          className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow ${
                            currentVote ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                      </div>

                      <button
                        disabled={votedCount !== totalActive}
                        onClick={() => {
                          socket?.emit(TaskPlanningEventsEnum.REVEAL, {
                            taskId: task.id,
                          });
                        }}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium transition ${
                          votedCount === totalActive
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Revelar
                      </button>

                      {!player.isObserver && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex gap-2 mt-2 flex-wrap justify-center"
                          >
                            {[1, 2, 3, 5, 8, 13].map((num) => (
                              <motion.button
                                key={num}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-14 bg-white rounded-md shadow text-green-800 font-bold transition ${
                                  currentVote?.vote === num
                                    ? '!bg-green-400'
                                    : 'hover:bg-green-200'
                                }`}
                                onClick={() => handleVote(num)}
                              >
                                {num}
                              </motion.button>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </Stack>
                  </Card>
                );
              })}
          </Stack>

          {/* Outros jogadores com scroll */}
          <div className="mt-8 overflow-y-auto pr-2 flex-1">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
              {taskState.players
                .filter((player) => player.uid !== user.uid)
                .map((player) => {
                  const voted = taskState.votes.some(
                    (v) => v.userUid === player.uid,
                  );

                  return (
                    <Card
                      key={player.id}
                      radius="md"
                      shadow="sm"
                      className={`flex flex-col border border-green-500 items-center py-4 hover:shadow-md transition ${
                        player.isObserver
                          ? 'bg-gray-100 opacity-70'
                          : 'bg-white'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className={`w-12 h-12 rounded-full object-cover shadow-lg ${
                            player.isObserver
                              ? 'opacity-50 grayscale'
                              : 'ring-2 ring-green-500'
                          }`}
                        />
                        {!player.isObserver && (
                          <span
                            className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow ${
                              voted ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                        )}
                      </div>
                      <Text
                        size="sm"
                        className="font-semibold text-green-800 text-center mt-2"
                      >
                        {player.name}
                      </Text>
                      {player.isObserver && (
                        <Text size="xs" className="text-gray-500">
                          Observador
                        </Text>
                      )}
                    </Card>
                  );
                })}
            </div>
          </div>
        </Card>
      </div>

      {/* MESA CENTRAL */}
      <div className="flex-1 flex justify-center items-center px-2">
        <div className="relative w-96 h-96 md:w-[600px] md:h-[600px] bg-green-800 rounded-full shadow-lg flex items-center justify-center">
          <Stack gap={0} justify="center" align="center">
            <Text className="text-white text-4xl font-bold">PlanUp</Text>
            <Icon color="white" path={mdiRobot} size={1} />
          </Stack>

          <AnimatePresence>
            {taskState.votes.map((vote, index) => {
              const { width } = result;
              const angle = (index / taskState.votes.length) * 2 * Math.PI;
              const x = Math.cos(angle) * (width > 735 ? 300 : 180);
              const y = Math.sin(angle) * (width > 735 ? 300 : 180);
              const player = taskState.players.find(
                (p) => p.uid === vote.userUid,
              );

              return (
                <motion.div
                  key={vote.userUid}
                  initial={{ y: 250, opacity: 0, rotate: -20 }}
                  animate={{ x, y, opacity: 1, rotate: 0 }}
                  exit={{ y: 250, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="absolute w-12 h-16 md:w-14 md:h-20 bg-white rounded-md shadow-lg flex items-center justify-center"
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
      </div>
    </div>
  );
}
