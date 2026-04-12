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
import { PageListCard } from 'components/page-list';

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
      <PageListCard
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-1 flex-col flex-wrap gap-2 sm:flex-row sm:items-end">
              <Select
                isMulti
                width={180}
                placeholder="Quốc gia"
                options={countries}
                onChange={handleChangeCountry}
                value={selectedCountries}
                isLoading={isLoadingCountries}
              />
              <Select
                isMulti
                width={180}
                placeholder="Năm"
                options={years}
                onChange={handleChangeYear}
                value={selectedYears}
                isLoading={isLoadingYears}
              />
              <SearchField
                onClear={handleClearSearch}
                placeholder="Tìm ngày lễ hoặc quốc gia..."
                onSubmit={handleSubmitSearch}
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
              Thêm ngày lễ
            </Button>
          </div>
        }
      >
        {isLoadingHolidays ? (
          <Loading />
        ) : (
          <HolidayList
            holidays={holidays || []}
            key={JSON.stringify(queryParams)}
            queryParams={queryParams}
            onSelectRow={(holiday) => {
              toggle();
              setSelectedHoliday(holiday);
            }}
          />
        )}
      </PageListCard>
      <HolidayModal
        isOpen={isOpen}
        onOpenChange={(shouldRefetch: boolean) => {
          toggle();
          setSelectedHoliday(DEFAULT_HOLIDAY);
          if (shouldRefetch) {
            refetch();
          }
        }}
        title={selectedHoliday.holidayId ? 'Sửa ngày lễ' : 'Thêm ngày lễ'}
        holiday={selectedHoliday}
      />
    </>
  );
};
