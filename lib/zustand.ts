import { useSyncExternalStore } from "react";

type StateCreator<T extends object> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void,
  get: () => T
) => T;

type Listener<T> = (state: T) => void;

export interface StoreApi<T extends object> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
  subscribe: (listener: Listener<T>) => () => void;
}

export type UseStore<T extends object> = {
  (): T;
  <U>(selector: (state: T) => U): U;
} & StoreApi<T>;

export function create<T extends object>(creator: StateCreator<T>): UseStore<T> {
  let state: T;
  const listeners = new Set<Listener<T>>();

  const setState: StoreApi<T>["setState"] = (partial, replace) => {
    const nextState =
      typeof partial === "function" ? { ...(partial as (state: T) => Partial<T>)(state) } : { ...partial };
    if (replace) {
      state = nextState as T;
    } else {
      state = { ...state, ...nextState };
    }
    listeners.forEach((listener) => listener(state));
  };

  const getState = () => state;

  const subscribe: StoreApi<T>["subscribe"] = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = creator((partial, replace) => setState(partial, replace), getState);

  const useStore = <U>(selector?: (state: T) => U): U | T => {
    const sel = selector ?? ((s) => s as unknown as U);
    return useSyncExternalStore(
      subscribe,
      () => sel(state),
      () => sel(state)
    ) as U | T;
  };

  const boundUseStore = useStore as UseStore<T>;
  boundUseStore.getState = getState;
  boundUseStore.setState = setState;
  boundUseStore.subscribe = subscribe;

  return boundUseStore;
}
