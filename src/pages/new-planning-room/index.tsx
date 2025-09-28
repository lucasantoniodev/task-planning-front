import { Button, Card, Center, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import cartasIcon from '../../assets/cartas.png';
import { Form } from '../../components/form/form.tsx';
import { TextField } from '../../components/form/text-field.tsx';
import { createNewRoom } from './api.ts';
import {
  type NewPlanningRoom,
  NewPlanningRoomSchema,
  RedirectSchema,
} from './model.ts';

// @ts-ignore
const MotionCard = motion(Card);

export const NewPlanningRoomPage = () => {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: createNewRoom,
    onSettled: async (data) => {
      if (data) {
        await navigate({ to: `/${data.id}` });
      }
    },
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Desejamos uma ótima planning para vocês!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Falha ao tentar criar sala',
        message:
          'Houve uma falha na tentativa de criar uma sala, tente novamente em alguns instantes.',
        color: 'red',
      });
    },
  });

  return (
    <Center className="w-full px-4">
      <Stack className="w-full max-w-[600px]">
        {/* Header */}
        <Center className="flex-col mb-8">
          <motion.img
            src={cartasIcon}
            alt="Cartas"
            className="w-24 h-24 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          />
          <Title className="text-center text-green-900 font-bold text-[28px] md:text-[32px]">
            Planning Room
          </Title>
          <p className="text-gray-600 mt-2 text-center">
            Entre em uma sala existente ou crie uma nova para começar
          </p>
        </Center>

        <MotionCard
          shadow="lg"
          padding="xl"
          radius="2xl"
          className="bg-green-50 border-[2px] border-green-600"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
          whileHover={{
            scale: 1.03,
            boxShadow: '0px 15px 30px rgba(16,185,129,0.5)',
          }}
        >
          <Title
            order={4}
            className="text-green-800 text-center font-semibold mb-4"
          >
            Entrar em uma sala
          </Title>
          <Form
            schema={RedirectSchema}
            onSubmit={async ({ id }) => {
              if (id) {
                await navigate({ to: `/${id}` });
              }
            }}
          >
            <TextField
              name="id"
              placeholder="Digite o ID da sala"
              className="w-full"
              styles={{
                input: {
                  border: '2px solid #009768',
                  boxShadow: 'none',
                },
              }}
            />
            <Button
              type="submit"
              className="mt-4 w-full bg-[#009768] hover:bg-green-800"
            >
              Entrar
            </Button>
          </Form>
        </MotionCard>

        <MotionCard
          shadow="lg"
          padding="xl"
          radius="2xl"
          className="bg-green-50 border-[2px] border-green-600"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            type: 'spring',
            bounce: 0.3,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: '0px 15px 30px rgba(16,185,129,0.5)',
          }}
        >
          <Title
            order={4}
            className="text-green-800 text-center font-semibold mb-4"
          >
            Criar nova sala
          </Title>
          <Form<typeof NewPlanningRoomSchema, NewPlanningRoom>
            schema={NewPlanningRoomSchema}
            onSubmit={async (data) => {
              await mutateAsync(data);
            }}
          >
            <TextField
              name="title"
              label="Título da sala"
              placeholder="Digite o título da sala"
              description="Esse título será exibido para todos os participantes"
              styles={{
                input: {
                  border: '2px solid #009768',
                  boxShadow: 'none',
                },
              }}
            />
            <Button
              type="submit"
              className="mt-4 w-full bg-[#009768] hover:bg-green-800"
            >
              Criar sala
            </Button>
          </Form>
        </MotionCard>
      </Stack>
    </Center>
  );
};
