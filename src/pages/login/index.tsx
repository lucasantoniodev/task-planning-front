import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import cartasIcon from '../../assets/cartas.png';
import { Form } from '../../components/form/form.tsx';
import { PasswordField } from '../../components/form/password-field.tsx';
import { TextField } from '../../components/form/text-field.tsx';
import { GoogleButton } from '../../components/login/google-button.tsx';
import { auth } from '../../firebase/firebase.ts';
import { useAuth } from '../../hooks/use-auth.ts';
import {
  type IUserLogin,
  UserLoginSchema,
} from '../../interfaces/user/user-login.inteface.ts';

export const LoginPage = () => {
  const user = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export const Component = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginWithEmailAndPassword = async (user: IUserLogin) => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-credential'
        ) {
          setLoginError(
            'Email ou senha incorretos. Verifique e tente novamente.',
          );
        } else {
          setLoginError(
            'Ocorreu um erro inesperado. Tente novamente mais tarde.',
          );
        }
      }
    }
  };

  return (
    <Flex
      h="100vh"
      direction={{ base: 'column', md: 'row' }}
      className="overflow-hidden"
    >
      {/* Left Section */}
      <Box
        w={{ base: '100%', md: '66.66%' }}
        bg="white"
        px={{ base: 'md', md: 'lg' }}
        py="xl"
      >
        <Flex align="center" direction="column" gap="sm">
          <div className="text-3xl mt-12 md:mt-24">
            <img src={cartasIcon} alt="Cartas" className="w-28 h-28 " />
          </div>
          <Title className="font-semibold text-[24px] md:text-[30px] text-[#383838] text-center">
            Olá, que bom ver você!
          </Title>
          <Text className="text-[16px] md:text-[20px] text-[#A6A6A6] text-center">
            Faça login com sua conta
          </Text>

          <GoogleButton />

          <Group w="100%" align="center" justify="center" wrap="nowrap" mt="md">
            <Divider w="100%" color="gray.3" size="xs" />
            <Text className="text-nowrap" c="gray.5" size="sm" mx="sm">
              ou email
            </Text>
            <Divider w="100%" color="gray.3" size="xs" />
          </Group>

          <Flex
            direction="column"
            gap="sm"
            className="w-full max-w-[562px] mt-4 px-2"
          >
            <Form<typeof UserLoginSchema, IUserLogin>
              schema={UserLoginSchema}
              onSubmit={(data) => handleLoginWithEmailAndPassword(data)}
            >
              <TextField name="email" label="Email" required />
              <PasswordField name="password" label="Senha" required />
              <Group justify="end" w="100%" mt={4}>
                <UnstyledButton
                  type="button"
                  onClick={() => alert('Funcionalidade não implementada.')}
                >
                  <Text className="font-semibold text-[#009768] hover:text-green-800">
                    Esqueceu sua senha?
                  </Text>
                </UnstyledButton>
              </Group>
              <Button
                type="submit"
                className="bg-[#009768] hover:bg-green-800 mt-10"
                w="100%"
              >
                Login
              </Button>
              {loginError && (
                <Text c="red" size="sm" mt="sm" ta="center">
                  {loginError}
                </Text>
              )}
            </Form>

            <Group w="100%" justify="center" gap={4}>
              <Text>Não tem uma conta?</Text>
              <UnstyledButton onClick={() => navigate({ to: '/register' })}>
                <Text className="font-semibold text-[#009768] hover:text-green-800">
                  Cadastre-se agora
                </Text>
              </UnstyledButton>
            </Group>
          </Flex>
        </Flex>
      </Box>

      {/* Right Section */}
      <Box
        w={{ base: '100%', md: '33.33%' }}
        bg="#009768"
        p="md"
        className="grid items-end h-full min-w-[382px]"
      >
        <div className="text-end w-full">
          <svg
            width="100%"
            height="150"
            viewBox="0 0 600 150"
            preserveAspectRatio="none"
          >
            <path
              d="M0,110 C200,0 550,210 630,110"
              stroke="white"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="10,10"
            />
          </svg>
          <Text className="!text-white text-8xl font-bold">PlanUp</Text>
        </div>
      </Box>
    </Flex>
  );
};
