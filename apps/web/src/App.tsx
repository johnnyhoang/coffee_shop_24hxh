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
import StaffAssignmentsPage from 'modules/staff-branch-roles/staff-assignments.page';
import { Drinks } from 'modules/drinks/drinks.page';
import TradingTodayPage from 'modules/trading/trading-today.page';



const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WelcomePage />} />
          <Route
            path="trading-today"
            element={<TradingTodayPage />}
            handle={{ title: 'Tình hình trong ngày' }}
          />
          <Route
            path="locations"
            element={<Locations />}
            handle={{ title: 'Chi nhánh' }}
          />
          <Route
            path="people"
            element={<Peoples />}
            handle={{ title: 'Khách / People' }}
          />
          <Route
            path="staff-assignments"
            element={<StaffAssignmentsPage />}
            handle={{ title: 'Nhân viên & chi nhánh' }}
          />
          <Route
            path="drinks"
            element={<Drinks />}
            handle={{ title: 'Đồ uống' }}
          />
          <Route
            path="masters"
            element={<MasterData />}
            handle={{ title: 'Danh mục dùng chung' }}
          />
          <Route path="*" element={<PageNotFound />} />
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#3d2d24',
            color: '#faf6f0',
            borderRadius: '12px',
          },
        }}
      />
    </Suspense>
  );
};

export default App;
