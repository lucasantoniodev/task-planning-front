import { Box, Button, Center, Group, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import cartasIcon from '../../assets/cartas.png';
import { CircularActionIcon } from '../../components/buttons/circular-button.tsx';
import { Form } from '../../components/form/form.tsx';
import { TextField } from '../../components/form/text-field.tsx';
import { createNewRoom } from './api.ts';
import {
  type NewPlanningRoom,
  NewPlanningRoomSchema,
  RedirectSchema,
} from './model.ts';

export const NewPlanningRoomPage = () => {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: createNewRoom,
    onSettled: async (data) => {
      if (data) {
        await navigate({
          to: `/${data.id}`,
        });
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
    <Group className="w-full" justify="center">
      <Center className="w-full" style={{ height: 'calc(100vh - 60px)' }}>
        <Box>
          <Form
            schema={RedirectSchema}
            onSubmit={async ({ id }) => {
              if (id) {
                await navigate({
                  to: `/${id}`,
                });
              }
            }}
          >
            <Group className="mb-20" justify="space-between" wrap="nowrap">
              <TextField
                name="id"
                className="w-full"
                styles={{
                  input: {
                    border: '3px solid #009768',
                    borderRadius: '100px',
                    boxShadow: 'none',
                  },
                }}
              />
              <CircularActionIcon>
                <IconArrowNarrowRight />
              </CircularActionIcon>
            </Group>
          </Form>
          <Box className="p-8 border-[3px] border-[#009768] rounded-2xl w-full min-w-[500px]">
            <Group justify="center">
              <img src={cartasIcon} alt="Cartas" className="w-28 h-28" />
            </Group>
            <Title className="font-semibold text-[24px] md:text-[30px] text-green-800 text-center mb-10">
              Planning room
            </Title>
            <Form<typeof NewPlanningRoomSchema, NewPlanningRoom>
              schema={NewPlanningRoomSchema}
              onSubmit={async (data) => {
                await mutateAsync(data);
              }}
            >
              <TextField
                name="title"
                label="Título"
                description="Título da sala que será exibido"
              />
              <Button
                type="submit"
                className="mt-4 w-full bg-[#009768] hover:bg-green-800"
              >
                Criar sala
              </Button>
            </Form>
          </Box>
        </Box>
      </Center>
    </Group>
  );
};
