import { useState } from 'react';
import { DEFAULT_LOCATION, TLocation, TLocationDTO, transformLocations } from './location.type';
import { ActionType } from 'types';
import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { useToggle } from 'hooks/use-toggle';
import { LocationModal } from './location.modal';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';
import { Select } from 'components/select';
import { SearchField } from 'components/search-field';
import { DropdownItem } from 'common/types';
import { MultiValue } from 'react-select';
import { regionsList as regions } from './location.type';
import { LocationList } from './location.list';



const Locations = () => {

  //1. Search, filter Bar
  const [dropdownSelectedRegions, setDropdownSelectedRegions] = useState<DropdownItem[]>([]);
  const [q, setSearchKey] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');

  //khi input box search, cap nhat gia tri search q
  const handleSearch = (key: string) => {
    setSearchKey(key);
  };

  // Khi user chọn các mục trong dropdown, cập nhật regionFilter và dropdownSelectedRegions
  const handleDropdownChange = (selected: MultiValue<DropdownItem>) => {
    setDropdownSelectedRegions([...selected]);
    const selectedRegions = selected.map((item) => item.value).join(',');
    setRegionFilter(selectedRegions);
  };

  const handleClearSearch = () => {
    setSearchKey('');
    setRegionFilter('');
  };


  //2. Data for main list
  const { data: locationList, isFetching: isLoading } = useQuery<TLocation[]>({
    queryKey: ['locations', q, regionFilter],
    queryFn: async () => {
      const response = await axios.get('locations', { params: { q, regionFilter } });
      return response.data;
    },
    select: (data: TLocationDTO[]): TLocation[] => {
      return transformLocations(data);
    },
  });


  //6. MODAL
  const [isModalOpen, toggle] = useToggle(false);

  return (
    <>
      <div className="p-2 border-[#dedede] border-t border-l border-r rounded-t-md">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-2 w-full flex-1 mr-2">
            <Select
              isMulti
              name="region"
              placeholder="Vùng / khu vực"
              options={regions}
              value={dropdownSelectedRegions}
              onChange={handleDropdownChange}
            />

            <SearchField
              placeholder="Tìm theo tên, mã, quốc gia..."
              onChange={handleSearch}
              value={q}
            />

            <Button
              className="btn-style bg-[#1c1c1c] hover:bg-[#3DA2D6] pressed:bg-[#3DA2D6]"
              onPress={handleClearSearch}
            >
              <AiOutlineClose />{/* Clear search */}
            </Button>
          </div>

          <Button
            className="btn-style bg-[#3DA2D6] hover:bg-[#FCB912] pressed:bg-[#3DA2D6]"
            onPress={toggle}
          >
            <AiOutlinePlus />
            Thêm chi nhánh
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <LocationList
            locations={locationList}
          />
        </>
      )}
      <LocationModal
        isOpen={isModalOpen}
        title="Thêm chi nhánh"
        onOpenChange={toggle}
        location={DEFAULT_LOCATION}
        actionType={ActionType.Add}
      />
    </>
  );
};

export default Locations;
