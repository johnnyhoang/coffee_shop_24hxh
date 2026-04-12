import { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BaseModalProps } from 'types';
import { ConfirmationModal, Modal } from 'components/modal';
import { Dialog } from 'components/dialog';
import { Button } from 'components/button';
import { ValidationForm } from 'components/form';
import { Field } from 'components/field';
import { useDeletePeople } from '../api/delete-people';
import { useAddPeople } from '../api/add-people';
import { useEditPeople } from '../api/edit-people';
import { TPeople, peopleSchema } from '../types/type';
import { yupResolver } from '@hookform/resolvers/yup';

// Define modal component props
export type PeopleModalProps = BaseModalProps & {
  people: TPeople;
};

export const PeopleModal = ({ title, isOpen, people, onOpenChange }: PeopleModalProps) => {
  const { mutate: addPeople, isPending: isAddingPeople } = useAddPeople();
  const { mutate: editPeople, isPending: isEditingPeople } = useEditPeople();
  const { mutate: deletePeople, isPending: isDeletingPeople } = useDeletePeople();

  // Combine pending states
  const isPending = isAddingPeople || isEditingPeople || isDeletingPeople;

  const mutateOptions = {
    onSuccess: () => onOpenChange(false), // Close modal after success
  };

  // Handle form submission: edit if person exists, add if new
  const handleSubmit = (data: TPeople) => {
    if (people.peopleId) {
      editPeople(data, mutateOptions); // Edit existing person
    } else {
      delete data.peopleId; // Remove ID for new person
      addPeople(data, mutateOptions); // Add new person
    }
  };

  // Handle deletion
  const handleDelete = () => {
    deletePeople(String(people.peopleId), mutateOptions); // Delete person
  };

  // Memoize form default values
  const defaultValues = useMemo(() => {
    return people ? { ...people } : {};
  }, [people]);

  return (
    <Modal className="w-[600px]" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            {/* Modal Header */}
            <div className="flex justify-between">
              <h1 className="font-bold mb-4">{title}</h1>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={close} />
            </div>

            {/* Form */}
            <ValidationForm<TPeople>
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              resolver={yupResolver(peopleSchema)}
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  {/* Form Fields */}
                  <div className="grid gap-4 grid-cols-2">
                    <Field name="peopleName" label="*Họ tên" placeholder="Họ và tên" />
                    <Field name="age" label="*Tuổi" placeholder="Tuổi" />
                    <Field name="gender" label="*Giới tính" placeholder="Nam / Nữ / Khác" />
                    <Field name="idNumber" label="*CMND/CCCD" placeholder="Số giấy tờ" />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end mt-6 gap-2">
                    {/* Save Button */}
                    <Button
                      type="submit"
                      isDisabled={isPending || !isFormValid || !formChanged}
                    >
                      {isPending ? 'Đang lưu...' : 'Lưu'}
                    </Button>

                    {/* Delete Button with Confirmation */}
                    <ConfirmationModal handler={handleDelete}>
                      <Button
                        className="bg-[#ee4823] hover:bg-[#9e240f]"
                        type="button"
                        isDisabled={isPending || !isFormValid || formChanged}
                      >
                        {isPending ? 'Đang xóa...' : 'Xóa'}
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
