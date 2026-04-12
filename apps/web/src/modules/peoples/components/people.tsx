import { useState } from 'react';
import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { useToggle } from 'hooks/use-toggle';
import { PeopleModal } from './people-modal';
import { useSessionQuery } from 'hooks/use-session-query';
import { SearchField } from 'components/search-field';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { usePeoples } from '../api/get-people';
import { PeopleList } from './people-list';
import { DEFAULT_PEOPLE } from '../types/type';
import { PageListCard } from 'components/page-list';

const KEY_LOCAL_STORAGE = 'peoplesParams';
const initialData = {
  q: '',
};

export const Peoples = () => {
  const { queryParams, setQueryParams, clearQueryParams } = useSessionQuery(KEY_LOCAL_STORAGE, initialData);
  const [search, setSearch] = useState(queryParams.q);
  const [isOpen, toggle] = useToggle(false);
  const [selectedPeople, setSelectedPeople] = useState(DEFAULT_PEOPLE);

  const { data: peoples, refetch, isLoading, isError } = usePeoples({ q: search });

  const handleClearData = () => {
    clearQueryParams();
    setSearch('');
  };

  const handleSearchSubmit = (search: string) => setQueryParams('q', search);

  const handleClearSearch = () => {
    setSearch('');
    setQueryParams('q', '');
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-cream-200 bg-paper px-4 py-6 text-center text-espresso-700">
        Không tải được danh sách khách. Kiểm tra API (cổng mặc định 3000) và{' '}
        <code className="text-sm">VITE_APP_API_BASE_URL</code> trong{' '}
        <code className="text-sm">apps/web/.env</code>.
      </div>
    );
  }

  return (
    <>
      <PageListCard
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-end">
              <SearchField
                onClear={handleClearSearch}
                placeholder="Tìm theo họ tên..."
                onSubmit={handleSearchSubmit}
                onChange={setSearch}
                value={search}
              />
              <Button
                className="btn-style inline-flex min-h-[44px] items-center gap-2 bg-espresso-800 hover:bg-espresso-700"
                onPress={handleClearData}
              >
                <AiOutlineClose />
                Xóa lọc
              </Button>
            </div>
            <Button
              className="btn-style inline-flex min-h-[44px] items-center gap-2 bg-rust hover:bg-[#5c3b2e]"
              onPress={toggle}
            >
              <AiOutlinePlus />
              Thêm khách
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <Loading />
        ) : (
          <PeopleList
            peoples={peoples || []}
            key={JSON.stringify(queryParams)}
            queryParams={queryParams}
            onSelectRow={(people) => {
              toggle();
              setSelectedPeople(people);
            }}
          />
        )}
      </PageListCard>

      <PeopleModal
        isOpen={isOpen}
        onOpenChange={(shouldRefetch: boolean) => {
          toggle();
          setSelectedPeople(DEFAULT_PEOPLE);
          if (shouldRefetch) refetch();
        }}
        title={selectedPeople.peopleId ? 'Sửa khách' : 'Thêm khách'}
        people={selectedPeople}
      />
    </>
  );
};
