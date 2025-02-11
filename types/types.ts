export type Id = string | number;
export interface Column {
  id: Id;
  title: string;
  color?: string;
  _id?: string;
  tasks?: Task[];
}

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  label?: string;
};
