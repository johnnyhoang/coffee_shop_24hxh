import type { DefaultOptions } from '@tanstack/react-query';

import { QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 20 * (60 * 1000),
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
