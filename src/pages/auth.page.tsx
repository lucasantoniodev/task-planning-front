import {
  Button,
  Divider,
  Grid,
  Group,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { FcGoogle } from 'react-icons/fc';

export const AuthPage = () => {
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-3xl mt-24">👋</div>
        <Title className="font-semibold text-[30px] text-[#383838]">
          Olá, que bom ver você!
        </Title>
        <Text className="text-[20px] text-[#A6A6A6]">
          Faça login com sua conta
        </Text>
        <CustomGoogleButton />
        <Group justify="center" w="100%">
          <Group w="100%" align="center" justify="center" wrap="nowrap">
            <Divider w="100%" color="gray.3" size="xs" />
            <Text className="text-nowrap" c="gray.5" size="sm" mx="sm">
              ou email
            </Text>
            <Divider w="100%" color="gray.3" size="xs" />
          </Group>
          <Grid>
            <Grid.Col p={0}>
              <TextInput label="Email" required />
            </Grid.Col>
            <Grid.Col p={0}>
              <TextInput label="Senha" required />
            </Grid.Col>
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
          </Grid>
          <Group w="100%" justify="center" gap={4}>
            <Text>Não tem uma conta?</Text>
            <UnstyledButton
              onClick={() => alert('Funcionalidade não implementada.')}
            >
              <Text c="#009768">Cadastre-se agora</Text>
            </UnstyledButton>
          </Group>
        </Group>
      </div>
      <Group className="bg-[#009768] flex items-end justify-end relative overflow-hidden">
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
      </Group>
    </div>
  );
};

export function CustomGoogleButton() {
  return (
    <Button
      leftSection={<FcGoogle size={20} />}
      className="text-[#383838] bg-transparent hover:bg-green-800 border-1 border-[#D9D9D9]"
      onClick={() => alert('Funcionalidade não implementada.')}
    >
      Google
    </Button>
  );
}
