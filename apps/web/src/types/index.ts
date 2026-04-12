


export enum ActionType {
  Add = 'Add',
  Edit = 'Edit',
  Delete = 'Delete',
}

export type BaseModalProps = {
  title: string;
  isOpen: boolean;
  actionType?: ActionType;
  onOpenChange: (isOpen: boolean) => void;
};


