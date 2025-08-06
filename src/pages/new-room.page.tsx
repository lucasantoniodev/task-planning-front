import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { mdiAccount, mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import cartasIcon from '../assets/cartas.png';
import { Form } from '../components/form/form.tsx';
import { TextField } from '../components/form/text-field.tsx';
import { NewRoomSchema } from '../interfaces/room.interface.ts';
import './styles/new-room.css';
import { updateProfile } from 'firebase/auth';
import { Snowflakes } from '../components/snowflakes';
import { auth } from '../firebase/firebase.ts';

export const NewRoomPage = () => {
  const user = auth.currentUser;

  const updateUserPhoto = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          photoURL:
            'https://updateordie.com/wp-content/uploads/2024/04/Thumbnails-UoD-1146x758-5.webp',
        });
        console.log('photoURL atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar photoURL:', error);
      }
    } else {
      console.warn('Nenhum usuário autenticado');
    }
  };

  return (
    <Stack gap={0} className="overflow-hidden">
      <Snowflakes />
      <Group bg="#009768" p="md" justify="space-between">
        <Group>
          <Icon color="white" path={mdiRobot} size={1} />
          <Text className="text-white text-4xl font-bold">PlanUp</Text>
        </Group>
        <UnstyledButton
          onClick={updateUserPhoto}
          className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center overflow-hidden"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Icon path={mdiAccount} size={2.5} color="white" />
          )}
        </UnstyledButton>
      </Group>
      <Group className="h-screen bg-green-50 p-4" justify="center">
        <Box className="p-8 border-[3px] border-[#009768] rounded-2xl w-1/3 min-w-[284px]">
          <Group justify="center">
            <img src={cartasIcon} alt="Cartas" className="w-28 h-28" />
          </Group>
          <Title className="font-semibold text-[24px] md:text-[30px] text-green-800 text-center mb-10">
            Planning room
          </Title>
          <Form schema={NewRoomSchema} onSubmit={() => {}}>
            <TextField
              className="name-field"
              name="name"
              label="Nome"
              description="Título da sala"
            />
            <Button className="mt-4 w-full bg-[#009768] hover:bg-green-800">
              Criar sala
            </Button>
          </Form>
        </Box>
      </Group>
    </Stack>
  );
};
