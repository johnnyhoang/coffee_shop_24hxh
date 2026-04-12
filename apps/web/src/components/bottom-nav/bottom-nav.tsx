import clsx from 'clsx';
import {
  BuildingOffice2Icon,
  HomeIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { RiDrinks2Fill } from 'react-icons/ri';

import { bottomNavPaths } from '../sidebar/sidebar.constants';

const iconForPath = (path: string) => {
  switch (path) {
    case '/':
      return HomeIcon;
    case '/trading-today':
      return Squares2X2Icon;
    case '/drinks':
      return RiDrinks2Fill;
    case '/people':
      return UserGroupIcon;
    case '/locations':
      return BuildingOffice2Icon;
    default:
      return HomeIcon;
  }
};

type BottomNavProps = {
  className?: string;
};

export function BottomNav({ className }: BottomNavProps) {
  return (
    <nav
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-cream-200 bg-paper/95 pb-[env(safe-area-inset-bottom)] pt-1 shadow-nav backdrop-blur-md',
        className,
      )}
      aria-label="Điều hướng chính"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {bottomNavPaths.map(({ path, label, end }) => {
          const Icon = iconForPath(path);
          return (
            <li key={path} className="flex min-w-0 flex-1 justify-center">
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex min-h-[52px] w-full max-w-[5.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-medium leading-tight',
                    isActive
                      ? 'text-rust'
                      : 'text-espresso-500 hover:text-espresso-700',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={clsx(
                        'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                        isActive ? 'bg-cream-200 text-espresso-800' : '',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="line-clamp-2 text-center">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
