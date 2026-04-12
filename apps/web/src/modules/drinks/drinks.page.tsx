import { useState } from 'react';
import { Button } from 'components/button';
import { Loading } from 'components/loading';
import { useToggle } from 'hooks/use-toggle';
import { ActionType } from 'types';
import { DEFAULT_DRINK, TDrink, TDrinkDTO, transformDrinks } from './drinks.types';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { SearchField } from 'components/search-field';
import { useSessionQuery } from 'hooks/use-session-query';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DrinksModal } from './drink-modal';
import { DrinksList } from './drink-list';

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

  if (isError) return <div>Loading Drinks list is not sucessfull</div>;

  return (
    <>
      <div className="p-2 border-[#dedede] border-t border-l border-r rounded-t-md">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-2 w-full flex-1 mr-2">

            <SearchField
              onClear={handleClearSearch}
              placeholder="Search..."
              onSubmit={handleSubmitSearch}
              onChange={setSearchBoxValue}
              value={searchBoxValue}
            />
            <Button
              className="btn-style bg-[#1c1c1c] hover:bg-[#3DA2D6] pressed:bg-[#3DA2D6]"
              onPress={handleClearData}
            >
              <AiOutlineClose />{/* Clear search */}
            </Button>
          </div>

          <Button
            className="btn-style bg-[#3DA2D6] hover:bg-[#FCB912] pressed:bg-[#3DA2D6]"
            onPress={toggle}
          >
            <AiOutlinePlus />{/* Add */}
          </Button>
        </div>
      </div>
      {isLoadingDrinks ? (
        <Loading />
      ) : (
        <DrinksList
          drinks={drinks}
          onSelectRow={handleSelectRow}
        />
      )}

      <DrinksModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        drink={selectedDrink}
        actionType={selectedDrink.drinkId ? ActionType.Edit : ActionType.Add}
        title={selectedDrink.drinkId ? 'Edit Drink Data' : 'Add Drink Data'}
      />
    </>
  );
};
