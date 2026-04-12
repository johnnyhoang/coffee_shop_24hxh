import { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AppLayout } from './layout/app-layout';
import { queryClient } from './lib/react-query';
import { Loading } from './components/loading';
import WelcomePage from 'modules/welcome/welcome';
import PageNotFound from 'modules/welcome/page-not-found';
import { Peoples } from 'modules/peoples/components/people';
import MasterData from 'modules/masters/master-data.page';
import Locations from 'modules/locations/locations.page';
import { Drinks } from 'modules/drinks/drinks.page';
import ExamplePage from 'modules/example/example';



const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WelcomePage />} />
          <Route
            path="locations"
            element={<Locations />}
            handle={{
              title: 'Location',
            }}
          />
          <Route
            path="people"
            element={<Peoples />}
            handle={{
              title: 'People',
            }}
          />
          <Route
            path="example"
            element={<ExamplePage />}
            handle={{
              title: 'Example Page',
            }}
          />
          {/* <Route
            path="holidays"
            element={<Holidays />}
            handle={{
              title: 'Holiday',
            }}
          /> */}
          <Route
            path="drinks"
            element={<Drinks />}
            handle={{
              title: 'Drink',
            }}
          />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="masters"
            element={<MasterData />}
            handle={{
              title: 'Master Data',
            }}
          />
        </Route>
      </>,
    ),
  );
  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </Suspense>
  );
};

export default App;
