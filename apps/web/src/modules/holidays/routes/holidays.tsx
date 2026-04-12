import { useMemo, useState } from 'react';
import { DEFAULT_HOLIDAY } from '../constants';
import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { HolidayList } from '../components';
import { useToggle } from 'hooks/use-toggle';
import { HolidayModal } from '../components/holiday-modal';
import { Select } from 'components/select';
import { useCountries, useHolidays, useYears } from '../api';
import { useSessionQuery } from 'hooks/use-session-query';
import { DropdownItem } from 'common/types';
import { MultiValue } from 'react-select';
import { SearchField } from 'components/search-field';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { findBy } from 'utils';

const KEY_LOCAL_STORAGE = 'holidaysParams';

const initialData = {
  country: '',
  years: '',
  q: '',
};


export const Holidays = () => {
  const { queryParams, setQueryParams, clearQueryParams } =
    useSessionQuery(KEY_LOCAL_STORAGE, initialData);
  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const { data: years, isLoading: isLoadingYears } = useYears();
  const [search, setSearch] = useState(queryParams.q);
  const [isOpen, toggle] = useToggle(false);
  const [selectedHoliday, setSelectedHoliday] = useState(DEFAULT_HOLIDAY);

  const { data: holidays, refetch, isLoading: isLoadingHolidays, isError } = useHolidays({ queryParams });

  const handleChangeCountry = (selected: MultiValue<DropdownItem>) => {
    const nextSelected = selected.map((s) => s.key).join(',');
    setQueryParams('country', nextSelected);
  };

  const selectedCountries = useMemo(() => {
    if (!countries || !queryParams.country) return [];

    const countryValues = queryParams.country.split(',');

    return countryValues.map((countryValue) =>
      findBy(countries, 'key', countryValue),
    );
  }, [queryParams.country, countries]);

  const handleChangeYear = (selected: MultiValue<DropdownItem>) => {
    const nextSelected = selected.map((s) => s.value).join(',');
    setQueryParams('years', nextSelected);
  };

  const selectedYears = useMemo(() => {
    if (!years || !queryParams.years) return [];

    const yearValues = queryParams.years.split(',');

    return yearValues.map((year) => findBy(years, 'value', year));
  }, [queryParams.years, years]);

  const handleClearData = () => {
    clearQueryParams();
    setSearch('');
  };

  const handleSubmitSearch = (search: string) => setQueryParams('q', search);

  const handleClearSearch = () => {
    setSearch('');
    setQueryParams('q', '');
  };

  if (isError) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  }

  return (
    <>
      <div className="p-2 border-[#dedede] border-t border-l border-r rounded-t-md">
        <div className="flex items-end justify-between">
          <div className="flex gap-2">
            <Select
              isMulti
              width={180}
              placeholder="Country"
              options={countries}
              onChange={handleChangeCountry}
              value={selectedCountries}
              isLoading={isLoadingCountries}
            />
            <Select
              isMulti
              width={180}
              placeholder="Year"
              options={years}
              onChange={handleChangeYear}
              value={selectedYears}
              isLoading={isLoadingYears}
            />
            <SearchField
              onClear={handleClearSearch}
              placeholder="Holiday or Country..."
              onSubmit={handleSubmitSearch}
              onChange={setSearch}
              value={search}
            />
            <Button
              className="btn-style bg-[#1c1c1c] hover:bg-[#3DA2D6] pressed:bg-[#3DA2D6]"
              onPress={handleClearData}
            >
              <AiOutlineClose />{/* Clear search */}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              className="btn-style bg-[#3DA2D6] hover:bg-[#FCB912] pressed:bg-[#3DA2D6]"
              onPress={toggle}
            >
              <AiOutlinePlus />
              Add Holiday
            </Button>
          </div>
        </div>
      </div>
      {isLoadingHolidays ? (
        <Loading />
      ) : (
        <HolidayList
          holidays={holidays || []}
          key={JSON.stringify(queryParams)} // Use JSON.stringify for a more stable key
          queryParams={queryParams}
          onSelectRow={(holiday) => {
            toggle();
            setSelectedHoliday(holiday);
          }}
        />
      )}
      <HolidayModal
        isOpen={isOpen}
        onOpenChange={(shouldRefetch: boolean) => {
          toggle();
          setSelectedHoliday(DEFAULT_HOLIDAY);
          if (shouldRefetch) {
            refetch();
          }
        }}
        title={selectedHoliday.holidayId ? 'Edit Holiday' : 'Add Holiday'}
        holiday={selectedHoliday}
      />
    </>
  );
};
