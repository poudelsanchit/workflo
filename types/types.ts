export type Id = string | number;
export interface Column {
  id: Id;
  title: string;
  color?: string;
  _id?: string;
}

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
