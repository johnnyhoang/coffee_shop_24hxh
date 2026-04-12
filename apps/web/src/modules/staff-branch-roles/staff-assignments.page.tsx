import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';

import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { SearchField } from 'components/search-field';
import { useToggle } from 'hooks/use-toggle';
import { axios } from 'lib/axios';
import { ActionType } from 'types';

import { StaffAssignmentList } from './staff-assignment-list';
import { StaffAssignmentModal } from './staff-assignment-modal';
import { PageListCard } from 'components/page-list';
import {
  DEFAULT_STAFF_ASSIGNMENT,
  mapStaffAssignmentRow,
  TStaffAssignmentDTO,
  TStaffAssignmentForm,
  TStaffAssignmentRow,
} from './staff-assignment.types';
import type { TLocation } from 'modules/locations/location.type';
import type { TPeopleDTO } from 'modules/peoples/types/type';

const StaffAssignmentsPage = () => {
  const [q, setSearchKey] = useState('');
  const [locationIdFilter, setLocationIdFilter] = useState<number | ''>('');

  const { data: locationOptions = [], isLoading: loadingLocations } = useQuery({
    queryKey: ['locations', 'for-staff'],
    queryFn: async () => {
      const res = await axios.get<TLocation[]>('locations');
      return res.data ?? [];
    },
  });

  const { data: peopleOptions = [], isLoading: loadingPeople } = useQuery({
    queryKey: ['peoples', 'for-staff'],
    queryFn: async () => {
      const res = await axios.get<TPeopleDTO[]>('peoples', { params: { q: '' } });
      return res.data ?? [];
    },
  });

  const { data: rows = [], isFetching } = useQuery({
    queryKey: ['staff-branch-roles', q, locationIdFilter],
    queryFn: async (): Promise<TStaffAssignmentRow[]> => {
      const res = await axios.get<TStaffAssignmentDTO[]>('staff-branch-roles', {
        params: {
          q: q.trim() || undefined,
          locationId: locationIdFilter === '' ? undefined : locationIdFilter,
        },
      });
      return (res.data ?? []).map(mapStaffAssignmentRow);
    },
  });

  const [isModalOpen, toggleModal] = useToggle(false);
  const [modalAction, setModalAction] = useState<ActionType>(ActionType.Add);
  const [form, setForm] = useState<TStaffAssignmentForm>(DEFAULT_STAFF_ASSIGNMENT);
  const [peopleReadonlyLabel, setPeopleReadonlyLabel] = useState('');

  const openAdd = () => {
    setModalAction(ActionType.Add);
    setForm(DEFAULT_STAFF_ASSIGNMENT);
    setPeopleReadonlyLabel('');
    toggleModal();
  };

  const handleSelectRow = (row: TStaffAssignmentRow) => {
    setModalAction(ActionType.Edit);
    setForm({
      staffBranchRoleId: row.staffBranchRoleId,
      peopleId: row.peopleId,
      locationId: row.locationId,
      role: row.role,
    });
    setPeopleReadonlyLabel(row.peopleName);
    toggleModal();
  };

  const handleClearSearch = () => {
    setSearchKey('');
    setLocationIdFilter('');
  };

  const branchFilterOptions = useMemo(() => {
    const all: { value: number | ''; label: string }[] = [
      { value: '', label: 'Tất cả chi nhánh' },
    ];
    const rest = locationOptions
      .filter((loc): loc is TLocation & { locationId: number } => typeof loc.locationId === 'number')
      .map((loc) => ({
        value: loc.locationId,
        label:
          [loc.location, loc.locationCode].filter(Boolean).join(' — ') || `#${loc.locationId}`,
      }));
    return all.concat(rest);
  }, [locationOptions]);

  const locationOptionsForModal = useMemo(
    () =>
      locationOptions.filter(
        (loc): loc is TLocation & { locationId: number } => typeof loc.locationId === 'number',
      ),
    [locationOptions],
  );

  const peopleOptionsForModal = useMemo(
    () =>
      peopleOptions.filter(
        (p): p is TPeopleDTO & { peopleId: number } => typeof p.peopleId === 'number',
      ),
    [peopleOptions],
  );

  const isLoading = loadingLocations || loadingPeople || isFetching;

  return (
    <>
      <PageListCard
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
              <label className="flex min-w-[200px] flex-col gap-1 text-sm text-espresso-700">
                Chi nhánh
                <select
                  className="min-h-[44px] rounded-lg border border-cream-300 bg-paper px-3 py-2 text-espresso-900"
                  value={locationIdFilter === '' ? '' : String(locationIdFilter)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLocationIdFilter(v === '' ? '' : Number(v));
                  }}
                >
                  {branchFilterOptions.map((o) => (
                    <option key={String(o.value)} value={o.value === '' ? '' : String(o.value)}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <SearchField
                placeholder="Tìm theo tên nhân viên, chi nhánh..."
                onChange={setSearchKey}
                value={q}
              />
              <Button
                className="btn-style inline-flex min-h-[44px] items-center gap-2 bg-espresso-800 hover:bg-espresso-700"
                onPress={handleClearSearch}
              >
                <AiOutlineClose />
                Xóa lọc
              </Button>
            </div>
            <Button
              className="btn-style inline-flex min-h-[44px] items-center gap-2 bg-rust hover:bg-[#5c3b2e]"
              onPress={openAdd}
            >
              <AiOutlinePlus />
              Thêm phân công
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <Loading />
        ) : (
          <StaffAssignmentList rows={rows} onSelectRow={handleSelectRow} />
        )}
      </PageListCard>

      <StaffAssignmentModal
        key={`${form.staffBranchRoleId ?? 'new'}-${form.peopleId}-${form.locationId}`}
        isOpen={isModalOpen}
        onOpenChange={toggleModal}
        title={modalAction === ActionType.Add ? 'Thêm phân công nhân viên' : 'Sửa phân công'}
        form={form}
        actionType={modalAction}
        peopleLabelReadonly={peopleReadonlyLabel}
        locationOptions={locationOptionsForModal}
        peopleOptions={peopleOptionsForModal}
      />
    </>
  );
};

export default StaffAssignmentsPage;
