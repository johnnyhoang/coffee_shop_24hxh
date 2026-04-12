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
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DrinksModal } from './drink-modal';
import { DrinksList } from './drink-list';
import { PageListCard } from 'components/page-list';

const KEY_LOCAL_STORAGE = 'drinksParams';
const initialData = {
  q: '',
};

/** Giải thích lỗi tải danh sách (CORS, sai URL, HTML thay vì JSON). */
function drinksListErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.startsWith('Máy chủ trả về')) {
    return error.message;
  }
  if (error instanceof Error && error.message.includes('không phải danh sách')) {
    return error.message;
  }
  if (isAxiosError(error)) {
    if (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error'
    ) {
      return 'Không kết nối được tới API (mạng, CORS, hoặc máy chủ tắt). Kiểm tra backend và CORS_ORIGINS trên API.';
    }
    const st = error.response?.status;
    if (st) {
      return `API trả về HTTP ${st}. Kiểm tra URL trong VITE_APP_API_BASE_URL và prefix /api/v1.`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Lỗi không xác định.';
}

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
  const {
    data: drinks,
    refetch,
    isLoading: isLoadingDrinks,
    isError,
    error,
  } = useQuery({
    queryKey: ['drinks', queryParams],
    queryFn: async (): Promise<TDrinkDTO[]> => {
      const response = await axios.get('drinks', { params: queryParams });
      const data = response.data;
      if (!Array.isArray(data)) {
        if (typeof data === 'string' && data.trimStart().startsWith('<')) {
          throw new Error(
            'Máy chủ trả về trang HTML thay vì JSON — thường do VITE_APP_API_BASE_URL trùng domain Vercel: mọi đường dẫn bị đưa về index.html. Hãy đặt biến này trỏ tới URL nơi Nest chạy (khác domain frontend), rồi build & deploy lại.',
          );
        }
        throw new Error('API trả về dữ liệu không phải danh sách.');
      }
      return data;
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
      <div className="rounded-xl border border-cream-200 bg-paper px-4 py-6 text-left text-espresso-700">
        <p className="mb-2 font-medium">Không tải được danh sách đồ uống.</p>
        <p className="mb-3 text-sm text-espresso-600">{drinksListErrorMessage(error)}</p>
        <p className="text-sm text-espresso-600">
          Biến <code className="text-sm">VITE_APP_API_BASE_URL</code> phải là URL backend Nest (có{' '}
          <code className="text-sm">/api/v1</code>, không dấu / cuối). Trên Vercel cần khai báo env rồi{' '}
          <strong>build lại</strong> (Vite gắn env lúc build). Local: file{' '}
          <code className="text-sm">apps/web/.env</code>.
        </p>
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
