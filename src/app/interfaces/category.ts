export interface ICategory {
  id: number;
  name: string;
  parentId?: number;
  children: ICategory[];
}