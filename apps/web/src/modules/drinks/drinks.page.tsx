import { useState } from 'react';
import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { useToggle } from 'hooks/use-toggle';
import { ActionType } from 'types';
import { DEFAULT_DRINK, TDrink, TDrinkDTO, transformDrinks } from './drinks.types';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { SearchField } from 'components/search-field';
import { useSessionQuery } from 'hooks/use-session-query';
import { axios } from 'lib/axios';
import { useQuery } from '@tanstack/react-query';
import { DrinksModal } from './drink-modal';
import { DrinksList } from './drink-list';
import { PageListCard } from 'components/page-list';

const KEY_LOCAL_STORAGE = 'drinksParams';
const initialData = {
  q: '',
};

export const Drinks = () => {
  //URL
  const { queryParams, setQueryParams, clearQueryParams } = useSessionQuery(
    KEY_LOCAL_STORAGE,
    initialData
  );

  // FILTER BAX
  const [searchBoxValue, setSearchBoxValue] = useState(queryParams.q);
  const handleSubmitSearch = (value: string) => setQueryParams('q', value);
  const handleClearData = () => {
    clearQueryParams();
    setSearchBoxValue('');
  };
  const handleClearSearch = () => {
    setSearchBoxValue('');
    setQueryParams('q', '');
  };

  // DATA LIST
  const { data: drinks, refetch, isLoading: isLoadingDrinks, isError } = useQuery({
    queryKey: ['drinks', queryParams],
    queryFn: async (): Promise<TDrinkDTO[]> => {
      const response = await axios.get('drinks', { params: queryParams });
      return response.data;  // Trả về dữ liệu
    },
    select: (data: TDrinkDTO[]): TDrink[] => {
      return transformDrinks(data);
    },
  });

  const handleSelectRow = (selectedDrink: TDrink) => {
    toggle();
    setSelectedDrink(selectedDrink);
  };

  // MODAL
  const [isModalOpen, toggle] = useToggle(false);
  const [selectedDrink, setSelectedDrink] = useState(DEFAULT_DRINK);
  const handleModalOpenChange = (shouldRefetch: boolean) => {
    toggle();
    setSelectedDrink(DEFAULT_DRINK);
    if (shouldRefetch) refetch();
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-cream-200 bg-paper px-4 py-6 text-center text-espresso-700">
        Không tải được danh sách đồ uống. Kiểm tra API đang chạy và{' '}
        <code className="text-sm">VITE_APP_API_BASE_URL</code> trong{' '}
        <code className="text-sm">apps/web/.env</code> (mặc định cổng 3000).
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
                placeholder="Tìm theo tên đồ uống..."
                onSubmit={handleSubmitSearch}
                onChange={setSearchBoxValue}
                value={searchBoxValue}
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
              Thêm đồ uống
            </Button>
          </div>
        }
      >
        {isLoadingDrinks ? (
          <Loading />
        ) : (
          <DrinksList drinks={drinks} onSelectRow={handleSelectRow} />
        )}
      </PageListCard>

      <DrinksModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        drink={selectedDrink}
        actionType={selectedDrink.drinkId ? ActionType.Edit : ActionType.Add}
        title={selectedDrink.drinkId ? 'Sửa đồ uống' : 'Thêm đồ uống'}
      />
    </>
  );
};
