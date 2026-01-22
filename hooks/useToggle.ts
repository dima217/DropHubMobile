import { useState } from 'react';

export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState<boolean>(initialState);

  const open = () => setState(true);
  const close = () => setState(false);
  const toggle = () => setState((prev) => !prev);

  return { state, open, close, toggle };
}
