import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Heading } from 'react-aria-components';

import { Field } from 'components/field';
import { ConfirmationModal, Modal } from 'components/modal';
import { Dialog } from 'components/dialog';
import { Button } from 'components/button';
import { ValidationForm } from 'components/form';

import { ActionType, BaseModalProps } from 'types';

import { ComboBoxItem } from 'components/combobox';
import { useAddMasterData, useDeleteMasterData, useEditMasterData } from './master-data.crud.api';
import { masterDataSchema, TMasterData } from './master-data.types';
import { axios } from 'lib/axios';
import { useQuery } from '@tanstack/react-query';
import { DropdownItem } from 'common/types';

export type TMasterDataModal = BaseModalProps & {
  masterItem: TMasterData;
};

export const MasterDataModal = ({
  title,
  isOpen,
  masterItem,
  actionType,
  onOpenChange,
}: TMasterDataModal) => {

  const { data: categories, } = useQuery<DropdownItem[]>({
    queryKey: ['master-data-categories'],  // queryKey is now correctly passed as part of an object
    queryFn: () =>
      axios.get('master-data/categories').then((response) => response.data),
  });

  const { data: parentList } = useQuery<DropdownItem[]>({
    queryKey: ['master-data-parent'],  // No dynamic params in queryKey
    queryFn: () => axios.get('master-data/data').then((res) => res.data),
  });

  const { mutate: addMasterData, isPending: isAddingMasterData } =
    useAddMasterData();
  const { mutate: editMasterData, isPending: isEditingMasterData } =
    useEditMasterData();
  const { mutate: deleteMasterData, isPending: isDeletingMasterData } =
    useDeleteMasterData();

  //thành công thì đóng form lại
  const mutateOptions = {
    onSuccess: () => onOpenChange(false),
  };

  const handleSubmit = async (data: TMasterData) => {
    if (actionType === ActionType.Add) {
      addMasterData(data, mutateOptions);
    } else {
      editMasterData(data, mutateOptions);
    }
  };

  const handleDelete = () => {
    const data = { ...masterItem };
    deleteMasterData(String(data.dataId), mutateOptions);
  };

  const isPendingMutate =
    isAddingMasterData || isEditingMasterData || isDeletingMasterData;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            <div className="flex justify-between p-4">
              <Heading className="text-lg font-bold">{title}</Heading>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={close} />
            </div>
            <ValidationForm<TMasterData>
              defaultValues={masterItem}
              onSubmit={handleSubmit}
              resolver={yupResolver(masterDataSchema)}
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  <div className="grid gap-4 grid-cols-2 p-4">
                    <Field
                      as="select"
                      name="parentDataId"
                      label="Danh mục cha"
                      placeholder="Chọn danh mục cha"
                      items={parentList}
                    >
                      {parentList?.map(({ key, value, label }) => (
                        <ComboBoxItem key={key} id={value}>
                          {value}-{label}
                        </ComboBoxItem>
                      ))}
                    </Field>
                    <Field
                      as="select-input"
                      name="category"
                      placeholder="Pick a category"
                      keyItem="value"
                      label="Category"
                      items={categories}
                    />
                    <Field
                      name="value"
                      label="Giá trị"
                      placeholder="Nhập giá trị hiển thị"
                    />
                    <Field
                      type="number"
                      name="code"
                      placeholder="Mã số"
                      label="Mã"
                    />
                    <Field
                      rows={2}
                      as="textarea"
                      name="description"
                      placeholder="Mô tả (tuỳ chọn)"
                      label="Mô tả"
                    />
                  </div>
                  <div className="flex justify-end p-4 gap-2">
                    <Button
                      type="submit"
                      isDisabled={isPendingMutate || !isFormValid || !formChanged}
                    >
                      {isPendingMutate ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    <ConfirmationModal handler={handleDelete}>
                      <Button
                        className="bg-red-500 hover:bg-red-700"
                        type="button"
                        isDisabled={isPendingMutate || !isFormValid || formChanged}
                      >
                        {isPendingMutate ? 'Đang xóa...' : 'Xóa'}
                      </Button>
                    </ConfirmationModal>
                  </div>
                </>
              )}
            </ValidationForm>
          </>
        )}
      </Dialog>
    </Modal>
  );
};
