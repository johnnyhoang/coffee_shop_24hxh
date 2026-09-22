import clsx from 'clsx';
import ChevronDoubleRightIcon from '@heroicons/react/24/outline/ChevronDoubleRightIcon';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';

import logo from 'assets/logo.png';
import { SidebarNav } from './sidebar-nav';
import { SideBarProps } from './sidebar.type';
import { useAuth } from '../../contexts/auth-context';

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const { user, signOut } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split('@')[0] ||
    'Tài khoản';
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const email = user?.email || '';

  return (
    <div
      id="sidebar"
      className={clsx(
        'hidden h-full min-h-0 flex-col border-r border-cream-200 bg-gradient-to-b from-paper to-cream-50 lg:flex',
        {
          'w-72': isOpen,
          'w-[4.5rem]': !isOpen,
        },
      )}
    >
      <div
        className={clsx(
          'flex shrink-0 items-center gap-3 border-b border-cream-200/80 px-4 py-5',
          !isOpen && 'justify-center px-2',
        )}
      >
        <img
          src={logo}
          alt="Coffee Shop 24HXH"
          className={clsx('h-10 w-auto object-contain', !isOpen && 'h-9')}
        />
        {isOpen && (
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-tight text-espresso-800">
              24HXH
            </p>
            <p className="truncate text-xs text-espresso-500">Coffee Shop</p>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-4">
        <SidebarNav showLabels={isOpen} />
      </div>

      {user && (
        <div
          className={clsx(
            'border-t border-cream-200/80 p-3',
            !isOpen && 'flex flex-col items-center',
          )}
        >
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-cream-300"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espresso-700 text-sm font-semibold text-paper">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-espresso-800">
                  {displayName}
                </p>
                <p className="truncate text-xs text-espresso-500">{email}</p>
              </div>
            )}
            {isOpen && (
              <button
                type="button"
                onClick={signOut}
                title="Đăng xuất"
                className="rounded-lg p-1.5 text-espresso-500 hover:bg-cream-200 hover:text-espresso-800 transition"
                aria-label="Đăng xuất"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          {!isOpen && (
            <button
              type="button"
              onClick={signOut}
              title="Đăng xuất"
              className="mt-2 rounded-lg p-1.5 text-espresso-500 hover:bg-cream-200 hover:text-espresso-800 transition"
              aria-label="Đăng xuất"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex min-h-[48px] items-center justify-center border-t border-cream-200 text-espresso-500 hover:bg-cream-200/80"
        aria-label={isOpen ? 'Thu gọn menu' : 'Mở rộng menu'}
      >
        <ChevronDoubleRightIcon
          className={clsx('h-5 w-5 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </button>
    </div>
  );
};
