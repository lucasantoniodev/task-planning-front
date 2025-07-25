import { Button } from '@mantine/core';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase.ts';

export const PlannerPage = () => {
  return <Button onClick={() => signOut(auth)}>Sair</Button>;
};
