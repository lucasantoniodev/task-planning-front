import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { planningRoomPage } from '../../router/router.tsx';
import { findPlanningRoomById } from './api.ts';

export const PlanningRoom = () => {
  const { id } = useParams({ from: planningRoomPage.id });
  const { data } = useQuery({
    queryKey: ['planningRoom'],
    queryFn: () => {
      return findPlanningRoomById(id);
    },
  });

  if (!data) {
    return <div>Página não encontrada!</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
};
