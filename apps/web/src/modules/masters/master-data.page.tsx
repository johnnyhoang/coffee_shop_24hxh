import { useState } from 'react';
import { Loading } from 'components/loading';
import { useToggle } from 'hooks/use-toggle';
import { DEFAULT_MASTER_ITEM, transformMasterData, TMasterDataDTO, TMasterData } from './master-data.types';
import { SearchField } from 'components/search-field';
import { DropdownItem } from 'common/types';
import { MultiValue } from 'react-select';
import { MasterDataList } from './master-data-list';
import { useSessionQuery } from 'hooks/use-session-query';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Select } from 'components/select';
import { Button } from 'components/button';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { MasterDataModal } from './master-data-modal';
import { ActionType } from 'types';

const KEY_LOCAL_STORAGE = 'masterDataList'; //key LocalStorage lưu trữ trên browser dung useSessionQuery
const initialData = {
  q: '',
  cats: '',
};

const MasterData = () => {
  //1 . Chuẩn bị bộ data queryParam
  const { queryParams, setQueryParams, clearQueryParams } = useSessionQuery(KEY_LOCAL_STORAGE, initialData); // useSessionQuery là tính năng cao cấp, có thể mở ra xem, tìm hiểu sau

  //2. Chuẩn bị bộ data list, data sẽ tự load khi querykey master-data thay đổi
  const { data: masterDataList, refetch, isLoading, isError, error } = useQuery({
    queryKey: ['master-data', queryParams],
    queryFn: async (): Promise<TMasterDataDTO[]> => {
      const response = await axios.get('master-data', { params: queryParams });
      return response.data;  // Trả về dữ liệu
    },
    select: (data: TMasterDataDTO[]): TMasterData[] => {
      return transformMasterData(data);
    },
  });

  // 3. xử lý thanh search khi thay đổi
  const [searchBoxValue, setSearchBoxValue] = useState<string>(queryParams.q);
  const handleSearchChange = (key: string) => {
    setSearchBoxValue(key);
    setTimeout(() => { // Set timeout for updating query params
      setQueryParams('q', key);
    }, 1000);
  };

  const { data: categories, isLoading: isLoadingCategories } = useQuery<DropdownItem[]>({
    queryKey: ['master-data-categories'],  // queryKey is now correctly passed as part of an object
    queryFn: () => axios.get('/master-data/categories').then((response) => response.data),  // queryFn with no params
  });

  // Biến này để giữ giá trị đã chọn trong dropdown
  const [dropdownSelectedCategories, setDropdownSelectedCategories] = useState<DropdownItem[]>([]);

  // Khi user chọn các mục trong dropdown, cập nhật selectedCategories và queryParams.cats
  const handleCategoryChange = (selected: MultiValue<DropdownItem>) => {
    setDropdownSelectedCategories([...selected]); // Cập nhật selectedCategories khi người dùng chọn các mục
    const selectedValues = selected.map((item) => item.value).join(',');  // Ghép các giá trị đã chọn thành chuỗi (ví dụ: 'cat1,cat3') và cập nhật queryParams.cats
    setQueryParams('cats', selectedValues);  // Cập nhật queryParams cats thành chuỗi 'cat1,cat3'
  };

  //5. button clear all search data and reset filters
  const handleClearData = () => {
    clearQueryParams(); //reset về initialState
    setSearchBoxValue('');
    setDropdownSelectedCategories([]);
  };

  //6. Khi bấm vào 1 dòng Modal sẽ bật lên với dòng được chọn
  const [isModalOpen, toggle] = useToggle(false);
  const [selectedMasterItem, setSelectedMasterItem] = useState(DEFAULT_MASTER_ITEM);

  // RENDER
  if (isError) return <div>Error loading master data: {error.message}</div>;
  if (isLoading) { return <div>Loading...</div>; }
  return (
    <>
      <div className="p-2 border-[#dedede] border-t border-l border-r rounded-t-md">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-2 w-full flex-1 mr-2">
            {/* Dropdown filter for category */}
            {<Select
              isMulti
              name="category"
              placeholder="Category"
              options={categories}
              value={dropdownSelectedCategories}
              isLoading={isLoadingCategories}
              onChange={handleCategoryChange}
            />}

            {/* Search field */}
            <SearchField
              placeholder="Search by various info..."
              onChange={handleSearchChange}
              value={searchBoxValue}
            />

            {/* Clear search button */}
            <Button
              className="btn-style bg-[#1c1c1c] hover:bg-[#3DA2D6] pressed:bg-[#3DA2D6]"
              onPress={handleClearData}
            >
              <AiOutlineClose />
            </Button>
          </div>

          {/* Add master data button */}
          <Button
            className="btn-style bg-[#3DA2D6] hover:bg-[#FCB912] pressed:bg-[#3DA2D6]"
            onPress={toggle}
          >
            <AiOutlinePlus />
            Add Master Data
          </Button>
          <MasterDataModal
            isOpen={isModalOpen}
            onOpenChange={(shouldRefetch: boolean) => {
              toggle();
              setSelectedMasterItem(DEFAULT_MASTER_ITEM);
              if (shouldRefetch)
                refetch();
            }}
            actionType={selectedMasterItem.dataId ? ActionType.Edit : ActionType.Add}
            title={selectedMasterItem.dataId ? 'Edit Master Data' : 'Add Master Data'}
            masterItem={selectedMasterItem}
          />
        </div>
      </div>

      {/* Display loading indicator or list of master data */}
      {isLoading ? (
        <Loading />
      ) : (
        <MasterDataList
          masterDataList={masterDataList}
          queryParams={queryParams}
          key={JSON.stringify(queryParams)}
          onSelectRow={(selectedMasterItem) => {
            toggle();
            setSelectedMasterItem(selectedMasterItem); // Set selected item
          }}
        />
      )}
    </>
  );
};

export default MasterData;
