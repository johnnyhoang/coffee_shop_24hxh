import { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';

import { holidaySchema } from '../constants';

import { THoliday } from '../types';
import { BaseModalProps } from 'types';

import { ConfirmationModal, Modal } from 'components/modal';
import { Dialog } from 'components/dialog';
import { Button } from 'components/button';
import { ValidationForm } from 'components/form';

import { useAddHoliday, useEditHoliday } from '../api';
import { Field } from 'components/field';
import { useDeleteHoliday } from '../api/delete-holiday';
import { toLocalCalendarDateFromUTC } from 'utils/date-utils';

export type HolidayModalProps = BaseModalProps & {
  holiday: THoliday;
};

export const HolidayModal = ({
  title,
  isOpen,
  holiday,
  onOpenChange,
}: HolidayModalProps) => {
  // const { data: countries } = useLocationData(LOCATION_DATA_TYPE.COUNTRY, {
  //   select: transformLocationData,
  // });

  const { mutate: addHoliday, isPending: isAddingHoliday } = useAddHoliday();
  const { mutate: editHoliday, isPending: isEditingHoliday } = useEditHoliday();
  const { mutate: deleteHoliday, isPending: isDeletingHoliday } =
    useDeleteHoliday();

  const mutateOptions = {
    onSuccess: () => {
      onOpenChange(true);
    },
  };

  const handleSubmit = (data: THoliday) => {
    if (holiday.holidayId) {
      editHoliday(data, mutateOptions);
    } else {
      delete data.holidayId;
      addHoliday(data, mutateOptions);
    }
  };

  const handleDelete = () => {
    const data = { ...holiday };
    deleteHoliday(String(data.holidayId), mutateOptions);
  };

  const isPendingMutate =
    isAddingHoliday || isEditingHoliday || isDeletingHoliday;

  /**
   * The default values for the holiday modal.
   * @type {Object}
   */
  const defaultValues = useMemo(() => {
    if (!holiday) return;

    return {
      ...holiday,
      holiday: toLocalCalendarDateFromUTC(holiday.holiday),
      country: holiday.country,
    };
  }, [holiday]);

  return (
    <Modal className="w-[600px]" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            <div className="flex justify-between">
              <h1 className="font-bold mb-4">{title}</h1>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={close} />
            </div>
            <ValidationForm<THoliday>
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              resolver={yupResolver(holidaySchema)}
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  <div className="grid gap-4 grid-cols-2 justify-between">
                    <Field
                      name="holiday"
                      label={<span className="reqfield-label">*Holiday</span>}
                      placeholder="Select a holiday date"
                      as="datepicker"
                    ></Field>
                    <Field
                      name="holidayName"
                      label={<span className="reqfield-label">*Name</span>}
                      placeholder="What's holiday name?"
                    />
                    {/* <Field
                      as="select-input"
                      name="country"
                      label={<span className="reqfield-label">*Country</span>}
                      placeholder="Luxembourg"
                      items={countries}
                      keyItem="key"
                      valItem="value"
                    /> */}
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
