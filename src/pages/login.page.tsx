import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { Navigate } from '@tanstack/react-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase/firebase';
import { useAuth } from '../hooks/useAuth.ts';

export const LoginPage = () => {
  const user = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Flex h="100vh">
      <Box w="66.66%" bg="white" p="md">
        <Flex align="center" direction="column" gap="sm">
          <div className="text-3xl mt-24">👋</div>
          <Title className="font-semibold text-[30px] text-[#383838]">
            Olá, que bom ver você!
          </Title>
          <Text className="text-[20px] text-[#A6A6A6]">
            Faça login com sua conta
          </Text>
          <CustomGoogleButton />
          <Group w="100%" align="center" justify="center" wrap="nowrap">
            <Divider w="100%" color="gray.3" size="xs" />
            <Text className="text-nowrap" c="gray.5" size="sm" mx="sm">
              ou email
            </Text>
            <Divider w="100%" color="gray.3" size="xs" />
          </Group>
          <Flex direction="column" gap="sm" w="562px">
            <TextInput label="Email" required />
            <TextInput label="Senha" required />
            <Group justify="end" w="100%" mt={4}>
              <UnstyledButton
                onClick={() => alert('Funcionalidade não implementada.')}
              >
                <Text c="#009768" className="font-semibold">
                  Esqueceu sua senha?
                </Text>
              </UnstyledButton>
            </Group>
            <Button
              className="bg-[#009768] hover:bg-green-800 mt-10"
              w="100%"
              onClick={() => alert('Funcionalidade não implementada.')}
            >
              Login
            </Button>

            <Group w="100%" justify="center" gap={4}>
              <Text>Não tem uma conta?</Text>
              <UnstyledButton
                onClick={() => alert('Funcionalidade não implementada.')}
              >
                <Text c="#009768">Cadastre-se agora</Text>
              </UnstyledButton>
            </Group>
          </Flex>
        </Flex>
      </Box>
      <Box
        className="grid justify-end items-end"
        w="33.33%"
        bg="#009768"
        p="md"
      >
        <div>
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

export function CustomGoogleButton() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <Button
      leftSection={<FcGoogle size={20} />}
      className="text-[#383838] bg-transparent hover:bg-green-800 border-1 border-[#D9D9D9] w-[180px]"
      onClick={handleGoogleLogin}
    >
      Google
    </Button>
  );
}
