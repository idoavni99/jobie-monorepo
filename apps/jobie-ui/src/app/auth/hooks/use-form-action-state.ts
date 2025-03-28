import { useActionState } from 'react';

export const useFormActionState = <T>(
  action: (state: Awaited<T>, payload: FormData) => T | Promise<T>,
  initialState: Awaited<T>
) => {
  return useActionState<T, FormData>(action, initialState);
};
