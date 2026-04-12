import clsx from 'clsx';
import ChevronDoubleRightIcon from '@heroicons/react/24/outline/ChevronDoubleRightIcon';

import logo from 'assets/logo.png';
import { SidebarNav } from './sidebar-nav';
import { SideBarProps } from './sidebar.type';

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
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

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="mt-auto flex min-h-[48px] items-center justify-center border-t border-cream-200 text-espresso-500 hover:bg-cream-200/80"
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
