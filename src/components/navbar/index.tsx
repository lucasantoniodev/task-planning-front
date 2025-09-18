import { Group, Text, UnstyledButton } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { mdiAccount, mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
import { UserProfile } from './user-profile.tsx';

export function AppNavbar() {
  const user = auth.currentUser;

  if (!user) {
    console.warn('Nenhum usuário autenticado');
    return <></>;
  }

  const _updateUserPhoto = async () => {
    try {
      await updateProfile(user, {
        photoURL:
          'https://updateordie.com/wp-content/uploads/2024/04/Thumbnails-UoD-1146x758-5.webp',
      });
      console.log('photoURL atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar photoURL:', error);
    }
  };

  return (
    <Group bg="#009768" p="md" justify="space-between">
      <Group>
        <Icon color="white" path={mdiRobot} size={1} />
        <Text className="text-white text-4xl font-bold">PlanUp</Text>
      </Group>
      <UnstyledButton
        onClick={() =>
          openModal({
            size: 'lg',
            children: <UserProfile />,
          })
        }
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
  );
}
