import {
  Badge,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const players = [
  { name: 'Júlia', voted: true },
  { name: 'Maicom', voted: true },
  { name: 'André', voted: false },
  { name: 'Carol', voted: true },
  { name: 'Paulo', voted: true },
];

const cards = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export const MockPage = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [_revealed, _setRevealed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [votesVisible, setVotesVisible] = useState(false);
  const [voteStarted, setVoteStarted] = useState(false);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev! > 1 ? prev! - 1 : 0));
      }, 1000);
    } else if (countdown === 0) {
      setVotesVisible(true);
      setCountdown(null);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleStartVote = () => {
    setVoteStarted(true);
    setVotesVisible(false);
    setCountdown(3);
  };

  const handleNewRound = () => {
    setSelectedCard(null);
    setVotesVisible(false);
    setVoteStarted(false);
    setCountdown(null);
  };

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between">
        <Group>
          <Badge color="green" size="lg" variant="dot">
            Online
          </Badge>
        </Group>

        <Group>
          <Button variant="light">📥 Baixar os votos</Button>
          <Button variant="light" onClick={openModal}>
            ➕ Convidar jogadores
          </Button>
        </Group>
      </Group>

      <Center>
        <Text size="lg" fw={600}>
          {players.filter((p) => p.voted).length} de {players.length} votos 👀
        </Text>
      </Center>

      <Grid justify="center" gutter="xs">
        {players.map((player) => (
          <Grid.Col span="auto" key={player.name}>
            <Card
              padding="md"
              shadow="sm"
              withBorder
              style={{
                width: 50,
                height: 100,
                backgroundColor:
                  votesVisible && player.voted ? '#2ecc71' : '#dcdcdc',
              }}
            />
            <Center mt={4}>
              <Text size="sm">{player.name}</Text>
            </Center>
          </Grid.Col>
        ))}
      </Grid>

      <Center>
        <Group wrap="wrap" justify="center">
          {cards.map((card) => (
            <Paper
              key={card}
              p="sm"
              radius="md"
              shadow="sm"
              withBorder
              style={{
                cursor: 'pointer',
                backgroundColor: selectedCard === card ? '#333' : 'white',
                color: selectedCard === card ? 'white' : 'black',
                width: 40,
                textAlign: 'center',
              }}
              onClick={() => setSelectedCard(card)}
            >
              <Text fw={600}>{card}</Text>
            </Paper>
          ))}
        </Group>
      </Center>

      <Center mt="xs">
        <Text>Escolha sua carta 👇</Text>
      </Center>

      <Center mt="lg">
        <Group>
          <Button color="teal" disabled={voteStarted} onClick={handleStartVote}>
            Iniciar votação
          </Button>
          <Button color="gray" onClick={handleNewRound}>
            Iniciar nova contagem
          </Button>
        </Group>
      </Center>

      {countdown !== null && (
        <Center mt="md">
          <Text size="xl" fw={700}>
            Revelando em... {countdown}
          </Text>
        </Center>
      )}

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Compartilhar sala"
      >
        <Text>Cole o link abaixo para compartilhar com os jogadores:</Text>
        <Paper mt="sm" p="sm" withBorder radius="md">
          <Text c="dimmed" size="sm">
            https://example.com/sala/123
          </Text>
        </Paper>
      </Modal>
    </Stack>
  );
};
