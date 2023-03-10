export type Listener<T> = {
  [key: string]: Callback<T>[];
};

export type Callback<T> = (event: Event<T>) => void;

export type Event<T> = {
  data: T;
  operation: Operation;
};

export enum Operation {
  Add,
  Delete,
  Update,
}
