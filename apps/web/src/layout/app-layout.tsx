import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';

import { SideBar } from 'components/sidebar';
import { Loading } from '../components/loading';
import { Header } from './header';
import PrivateRoute from './private-route';

export const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const styles = {
    'ml-72': isOpen,
    'ml-14': !isOpen,
  };

  return (
    <PrivateRoute>
      <div className={clsx('sticky top-0 z-20', styles)}>
        <div className="flex text-sm items-center p-1 justify-between bg-white">
          <Header />
        </div>
      </div>
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className={clsx('p-2', isOpen ? 'ml-72' : 'ml-14')}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </PrivateRoute>
  );
};
