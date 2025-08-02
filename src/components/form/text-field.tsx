import { TextInput, type TextInputProps } from '@mantine/core';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string;
} & TextInputProps;

export function TextField({ name, ...props }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return <TextInput {...register(name)} error={error} {...props} />;
}
