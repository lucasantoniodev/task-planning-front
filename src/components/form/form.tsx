import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mantine/core';
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  type Resolver,
  useForm,
} from 'react-hook-form';
import type { FormProps } from 'react-hook-form/';
import type { ZodObject, ZodType } from 'zod';

interface Props<TSchema extends ZodType, TData extends FieldValues>
  extends Omit<FormProps<TData>, 'onSubmit'> {
  schema: TSchema;
  defaultValues?: DefaultValues<TData>;
  onSubmit: (values: TData) => void;
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
}

export function Form<TSchema extends ZodType, TData extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  mode,
  ...formOptions
}: Props<TSchema, TData>) {
  const methods = useForm<TData>({
    resolver: zodResolver(
      schema as unknown as ZodObject<TData>,
    ) as unknown as Resolver<TData, unknown, TData>,
    defaultValues,
    mode: mode ?? 'onSubmit',
    ...formOptions,
  });

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </Box>
    </FormProvider>
  );
}
