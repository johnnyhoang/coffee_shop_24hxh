import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Heading } from 'react-aria-components';

import { Field } from 'components/field';
import { ConfirmationModal, Modal } from 'components/modal';
import { Dialog } from 'components/dialog';
import { Button } from 'components/button';
import { ValidationForm } from 'components/form';

import { ActionType, BaseModalProps } from 'types';


import { drinksDataSchema, TDrink } from './drinks.types';
import { useAddDrinks, useEditDrinks, useDeleteDrinks } from './drinks.crud.api';

export type TDrinksModal = BaseModalProps & {
  drink: TDrink;
};

export const DrinksModal = ({
  title,
  isOpen,
  drink,
  actionType,
  onOpenChange,
}: TDrinksModal) => {

  const { mutate: addDrinks, isPending: isAddingDrinks } =
    useAddDrinks();
  const { mutate: editDrinks, isPending: isEditingDrinks } =
    useEditDrinks();
  const { mutate: deleteDrinks, isPending: isDeletingDrinks } =
    useDeleteDrinks();

  const mutateOptions = {
    onSuccess: () => onOpenChange(false),
  };
  const handleSubmit = async (data: TDrink) => {
    data = { ...data };

    if (actionType === ActionType.Add) {
      delete data.drinkId;
      addDrinks(data, mutateOptions);
    } else {
      editDrinks(data, mutateOptions);
    }
  };

  const handleDelete = () => {
    const data = { ...drink };
    deleteDrinks(String(data.drinkId), mutateOptions);
  };

  const isPendingMutate =
    isAddingDrinks || isEditingDrinks || isDeletingDrinks;



  return (
    <Modal className="w-[600px]" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            <div className="flex justify-between">
              <Heading slot="title" className="font-bold mb-4">
                {title}
              </Heading>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={close} />
            </div>
            <ValidationForm<TDrink>
              defaultValues={drink}
              onSubmit={handleSubmit}
              resolver={yupResolver(drinksDataSchema)}
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  <div className="grid gap-4 grid-cols-2 justify-between">

                    <Field
                      name="drinkName"
                      label={<span className="reqfield-label">*Category</span>}
                      placeholder="Pick a category"
                    />
                    <Field
                      name="price"
                      label={<span className="reqfield-label">*Price</span>}
                      placeholder="Set a Value"
                    />
                    <Field
                      rows={2}
                      cols={2}
                      as="textarea"
                      name="description"
                      placeholder="Description of the category as detail as possible"
                      label="Description"
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex justify-end mt-6 gap-2">
                    <Button
                      type="submit"
                      isDisabled={
                        isPendingMutate || !isFormValid || !formChanged
                      }
                    >
                      {isPendingMutate ? 'Saving...' : 'Save'}
                    </Button>
                    <ConfirmationModal handler={handleDelete}>
                      <Button
                        className="bg-[#ee4823] hover:bg-[#9e240f]"
                        type="button"
                        isDisabled={
                          isPendingMutate || !isFormValid || formChanged
                        }
                      >
                        {isPendingMutate ? 'Deleting...' : 'Delete'}
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
