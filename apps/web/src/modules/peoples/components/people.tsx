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

  if (isError) return <div>Error loading people data</div>;

  return (
    <>
      {/* Search and Add People Controls */}
      <div className="p-2 border border-[#dedede] rounded-t-md">
        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            <SearchField
              onClear={handleClearSearch}
              placeholder="Full name..."
              onSubmit={handleSearchSubmit}
              onChange={setSearch}
              value={search}
            />
            <Button className="btn-style bg-[#1c1c1c]" onPress={handleClearData}>
              <AiOutlineClose />
            </Button>
          </div>
          <Button className="btn-style bg-[#3DA2D6]" onPress={toggle}>
            <AiOutlinePlus />
          </Button>
        </div>
      </div>

      {/* Loading or People List */}
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

      {/* People Modal for Add/Edit */}
      <PeopleModal
        isOpen={isOpen}
        onOpenChange={(shouldRefetch: boolean) => {
          toggle();
          setSelectedPeople(DEFAULT_PEOPLE);
          if (shouldRefetch) refetch();
        }}
        title={selectedPeople.peopleId ? 'Edit People' : 'Add People'}
        people={selectedPeople}
      />
    </>
  );
};
