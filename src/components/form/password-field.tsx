import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string;
} & PasswordInputProps;

export function PasswordField({ name, ...props }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return <PasswordInput {...register(name)} error={error} {...props} />;
}
