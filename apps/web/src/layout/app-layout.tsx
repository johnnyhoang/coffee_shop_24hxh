import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';

import { SideBar } from 'components/sidebar';
import { Loading } from '../components/loading';
import PrivateRoute from './private-route';
import { BottomNav } from '../components/bottom-nav/bottom-nav';
import { MobileMenu } from '../components/mobile-menu/mobile-menu';
import { MobileAppBar } from './mobile-app-bar';
import { PageHeading } from './page-heading';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PrivateRoute>
      <div className="flex min-h-[100dvh] flex-col bg-paper text-espresso-800">
        <MobileAppBar onOpenMenu={() => setMobileMenuOpen(true)} />

        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          <div
            className={clsx(
              'hidden shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex',
              sidebarOpen ? 'lg:w-72' : 'lg:w-[4.5rem]',
            )}
          >
            <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          </div>

          <MobileMenu
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          <main
            className={clsx(
              'min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8',
              sidebarOpen ? 'lg:ml-72' : 'lg:ml-[4.5rem]',
              'transition-[margin] duration-200 ease-out',
            )}
          >
            <div className="mx-auto max-w-6xl">
              <PageHeading />
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>

        <BottomNav className="lg:hidden" />
      </div>
    </PrivateRoute>
  );
};
