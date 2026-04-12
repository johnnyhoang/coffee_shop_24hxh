import { ActionType, BaseModalProps } from 'types';
import { ComboBoxItem } from 'components/combobox';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Field } from 'components/field';
import { ValidationForm } from 'components/form';
import { ConfirmationModal } from 'components/modal';
import { Modal, Dialog, Button } from 'react-aria-components';
import { useAddLocation, useDeleteLocation, useEditLocation } from './location.crud.api';
import { locationSchema, TLocation } from './location.type';
import { regionsList as regions } from './location.type'

export type LocationModalProps = BaseModalProps & {
  location: TLocation;
};

export const LocationModal = ({
  title,
  isOpen,
  location,
  actionType,
  onOpenChange,
}: LocationModalProps) => {

  //thành công thì đóng form lại
  const mutateOptions = {
    onSuccess: () => onOpenChange(false),
  };

  const { mutate: addLocation, isPending: isAddingLocation } = useAddLocation();
  const { mutate: editLocation, isPending: isEditingLocation } =
    useEditLocation();
  const { mutate: deleteLocation, isPending: isDeletingLocation } =
    useDeleteLocation();

  const handleSubmit = async (data: TLocation) => {
    const cloneData = { ...data };
    if (actionType === ActionType.Add) {
      delete cloneData.locationId;
      addLocation(cloneData, mutateOptions);
    } else {
      editLocation(cloneData, mutateOptions);
    }
  };

  const handleDelete = () => {
    const data = { ...location };
    deleteLocation(String(data.locationId), mutateOptions);
  };

  const isPendingMutate =
    isAddingLocation || isEditingLocation || isDeletingLocation;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            <div className="flex justify-between">
              <h1 className="font-bold mb-4">{title}</h1>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={close} />
            </div>
            <ValidationForm<TLocation>
              defaultValues={location}
              onSubmit={handleSubmit}
              resolver={yupResolver(locationSchema)}
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  <div className="grid gap-4 grid-cols-2 justify-between">
                    <Field
                      name="location"
                      label={<span className="reqfield-label">*Location</span>}
                      placeholder="Luxembourg City"
                    />
                    <Field
                      name="locationCode"
                      label={
                        <span className="reqfield-label">*Location Code</span>
                      }
                      placeholder="LUXC"
                    />
                    <Field
                      name="country"
                      label={<span className="reqfield-label">*Location Code</span>}
                      placeholder="Luxembourg"
                    />
                    <Field
                      as="select"
                      name="region"
                      label={<span className="reqfield-label">*Region</span>}
                      placeholder="Europe"
                      items={regions}
                    >
                      {regions?.map(({ key, value, label: label }) => (
                        <ComboBoxItem key={key} id={value} textValue={value}>
                          {label}
                        </ComboBoxItem>
                      ))}
                    </Field>
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

