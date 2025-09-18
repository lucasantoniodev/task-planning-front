import { Avatar, Box, Button, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { mdiAccountEdit } from '@mdi/js';
import Icon from '@mdi/react';
import { sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import {
  type IUserProfile,
  UserProfileSchema,
} from '../../interfaces/user/user-profile.interface';
import { Form } from '../form/form';
import { TextField } from '../form/text-field.tsx';

export function UserProfile() {
  const user = auth.currentUser;

  if (!user) {
    return <></>;
  }

  const isAuthByGoogle = user.providerData[0].providerId === 'google.com';

  const handleChangePassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email!);
      alert('Enviamos um link para seu email para redefinir a senha.');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar email de redefinição.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    modals.closeAll();
  };

  const handleUpdateProfile = async (displayName: string) => {
    await updateProfile(user, {
      displayName,
    });
    modals.closeAll();
  };

  return (
    <Stack gap="lg">
      <Group justify="center">
        <Avatar
          src={user.photoURL || undefined}
          alt={user.displayName || 'Usuário'}
          size={120}
          radius="50%"
          color="green"
        >
          {!user.photoURL && <Icon path={mdiAccountEdit} size={2} />}
        </Avatar>
      </Group>

      <Box ta="center">
        <Text fw={700} fz="lg">
          {user.displayName || 'Sem nome definido'}
        </Text>
        <Text c="dimmed">{user.email}</Text>
      </Box>

      <Stack gap="xs">
        <Form<typeof UserProfileSchema, IUserProfile>
          schema={UserProfileSchema}
          onSubmit={(values) => handleUpdateProfile(values.displayName)}
        >
          <TextField
            name="displayName"
            label="Nome de exibição"
            defaultValue={user.displayName || ''}
          />
          <Group justify="center" mt="md">
            <Button
              type="submit"
              className="mt-4 w-full bg-[#009768] hover:bg-green-800"
            >
              Atualizar perfil
            </Button>
            {!isAuthByGoogle && (
              <Button color="green" onClick={handleChangePassword}>
                Trocar senha
              </Button>
            )}
          </Group>
        </Form>
      </Stack>

      <Group justify="center" mt="md">
        <Button color="red" onClick={handleSignOut}>
          Sair da conta
        </Button>
      </Group>
    </Stack>
  );
}
