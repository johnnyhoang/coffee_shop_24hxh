import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Heading } from 'react-aria-components';

import { Field } from 'components/field';
import { ComboBoxItem } from 'components/combobox';
import { ConfirmationModal, Modal } from 'components/modal';
import { Dialog } from 'components/dialog';
import { Button } from 'components/button';
import { ValidationForm } from 'components/form';

import { Resolver } from 'react-hook-form';
import { ActionType, BaseModalProps } from 'types';
import {
  DEFAULT_STAFF_ASSIGNMENT,
  staffAssignmentSchema,
  TStaffAssignmentForm,
} from './staff-assignment.types';
import {
  useAddStaffAssignment,
  useDeleteStaffAssignment,
  useEditStaffAssignment,
} from './staff-branch-role.crud.api';
import { STAFF_ROLE_LABELS, STAFF_ROLES } from './staff-role.constants';

type TLocationOption = {
  locationId: number;
  location: string | null;
  locationCode: string | null;
};

type TPeopleOption = {
  peopleId: number;
  peopleName: string | null;
};

export type StaffAssignmentModalProps = BaseModalProps & {
  form: TStaffAssignmentForm;
  actionType: ActionType;
  peopleLabelReadonly?: string;
  locationOptions: TLocationOption[];
  peopleOptions: TPeopleOption[];
};

export function StaffAssignmentModal({
  title,
  isOpen,
  form,
  actionType,
  onOpenChange,
  peopleLabelReadonly,
  locationOptions,
  peopleOptions,
}: StaffAssignmentModalProps) {
  const { mutate: addRow, isPending: isAdding } = useAddStaffAssignment();
  const { mutate: editRow, isPending: isEditing } = useEditStaffAssignment();
  const { mutate: deleteRow, isPending: isDeleting } = useDeleteStaffAssignment();

  const mutateOptions = { onSuccess: () => onOpenChange(false) };

  const handleSubmit = (data: TStaffAssignmentForm) => {
    if (actionType === ActionType.Add) {
      addRow(
        {
          peopleId: Number(data.peopleId),
          locationId: Number(data.locationId),
          role: data.role,
        },
        mutateOptions,
      );
      return;
    }
    if (data.staffBranchRoleId) {
      editRow(
        {
          staffBranchRoleId: data.staffBranchRoleId,
          locationId: Number(data.locationId),
          role: data.role,
        },
        mutateOptions,
      );
    }
  };

  const handleDelete = () => {
    if (form.staffBranchRoleId) {
      deleteRow(form.staffBranchRoleId, mutateOptions);
    }
  };

  const isPending = isAdding || isEditing || isDeleting;

  return (
    <Modal className="w-[560px]" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        {({ close }) => (
          <>
            <div className="flex justify-between">
              <Heading slot="title" className="font-display text-lg font-semibold text-espresso-900">
                {title}
              </Heading>
              <XMarkIcon className="h-6 w-6 cursor-pointer text-espresso-600" onClick={close} />
            </div>

            <ValidationForm<TStaffAssignmentForm>
              defaultValues={form}
              onSubmit={handleSubmit}
              resolver={
                yupResolver(staffAssignmentSchema) as Resolver<TStaffAssignmentForm>
              }
              mode="onChange"
            >
              {(isFormValid, formChanged) => (
                <>
                  <div className="mt-4 grid gap-4">
                    {actionType === ActionType.Edit && peopleLabelReadonly ? (
                      <p className="text-sm text-espresso-700">
                        <span className="font-medium text-espresso-900">Nhân viên: </span>
                        {peopleLabelReadonly}
                      </p>
                    ) : null}

                    {actionType === ActionType.Add ? (
                      <Field
                        as="select"
                        name="peopleId"
                        label={<span className="reqfield-label">*Nhân viên</span>}
                        placeholder="Chọn người"
                        items={peopleOptions.map((p) => ({
                          key: String(p.peopleId),
                          id: String(p.peopleId),
                          value: p.peopleId,
                          label: p.peopleName ?? `#${p.peopleId}`,
                        }))}
                      >
                        {peopleOptions.map((p) => (
                          <ComboBoxItem
                            key={p.peopleId}
                            id={String(p.peopleId)}
                            textValue={p.peopleName ?? ''}
                          >
                            {p.peopleName ?? `#${p.peopleId}`}
                          </ComboBoxItem>
                        ))}
                      </Field>
                    ) : null}

                    <Field
                      as="select"
                      name="locationId"
                      label={<span className="reqfield-label">*Chi nhánh</span>}
                      placeholder="Chọn chi nhánh"
                      items={locationOptions.map((loc) => ({
                        key: String(loc.locationId),
                        id: String(loc.locationId),
                        value: loc.locationId,
                        label: [loc.location, loc.locationCode].filter(Boolean).join(' — ') || `#${loc.locationId}`,
                      }))}
                    >
                      {locationOptions.map((loc) => (
                        <ComboBoxItem
                          key={loc.locationId}
                          id={String(loc.locationId)}
                          textValue={[loc.location, loc.locationCode].filter(Boolean).join(' ')}
                        >
                          {[loc.location, loc.locationCode].filter(Boolean).join(' — ') ||
                            `#${loc.locationId}`}
                        </ComboBoxItem>
                      ))}
                    </Field>

                    <Field
                      as="select"
                      name="role"
                      label={<span className="reqfield-label">*Vai trò tại chi nhánh này</span>}
                      placeholder="Chọn vai trò"
                      items={STAFF_ROLES.map((code) => ({
                        key: code,
                        id: code,
                        value: code,
                        label: STAFF_ROLE_LABELS[code],
                      }))}
                    >
                      {STAFF_ROLES.map((code) => (
                        <ComboBoxItem key={code} id={code} textValue={STAFF_ROLE_LABELS[code]}>
                          {STAFF_ROLE_LABELS[code]}
                        </ComboBoxItem>
                      ))}
                    </Field>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      type="submit"
                      className="btn-style bg-rust hover:bg-[#5c3b2e]"
                      isDisabled={isPending || !isFormValid || (actionType === ActionType.Edit && !formChanged)}
                    >
                      {isPending ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    {actionType === ActionType.Edit && form.staffBranchRoleId ? (
                      <ConfirmationModal handler={handleDelete}>
                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          isDisabled={isPending}
                        >
                          {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                      </ConfirmationModal>
                    ) : null}
                  </div>
                </>
              )}
            </ValidationForm>
          </>
        )}
      </Dialog>
    </Modal>
  );
}
