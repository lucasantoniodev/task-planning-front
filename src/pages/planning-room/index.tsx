import { useParams } from '@tanstack/react-router';
import { planningRoomPage } from '../../router/router.tsx';

export const PlanningRoom = () => {
  const { id } = useParams({ from: planningRoomPage.id });

  return <div>{id}</div>;
};
