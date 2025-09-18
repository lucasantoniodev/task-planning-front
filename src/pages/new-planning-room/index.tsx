import { Box, Button, Group, Stack, Title } from '@mantine/core';
import cartasIcon from '../../assets/cartas.png';
import { Form } from '../../components/form/form.tsx';
import { TextField } from '../../components/form/text-field.tsx';
import {
  type NewPlanningRoom,
  NewPlanningRoomSchema,
} from './new-planning-room.interface.ts';
import './new-room.css';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Snowflakes } from '../../components/snowflakes';
import { createNewRoom } from './api.ts';

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
        message: 'Certifique-se dos campos obrigatórios e tente novamente!',
        color: 'red',
      });
    },
  });

  return (
    <Stack gap={0} className="overflow-hidden">
      <Snowflakes />
      <Group className="h-screen bg-green-50 p-4" justify="center">
        <Box className="p-8 border-[3px] border-[#009768] rounded-2xl w-1/3 min-w-[284px]">
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
              className="name-field"
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
      </Group>
    </Stack>
  );
};
