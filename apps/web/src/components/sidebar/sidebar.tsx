import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { menus } from './sidebar.constants';
import { SideBarProps } from './sidebar.type';
import logo from 'assets/logo.png';
import ChevronDoubleRightIcon from '@heroicons/react/24/outline/ChevronDoubleRightIcon';

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  return (
    <div
      id="sidebar"
      className={clsx(
        'fixed left-0 top-0 bottom-0',
        'flex flex-col p-2.5 h-screen bg-[#f4f5f7]',
        {
          'w-72': isOpen,
          'w-14': !isOpen,
        },
      )}
    >
      <div className="flex gap-2 items-center justify-center p-4">
        <img src={logo} alt="logo" className="w-[100px]" />
        {isOpen && (
          <h1 className="text-xl font-semibold">Coffee App</h1>
        )}
      </div>
      <nav className="mt-4 flex flex-col h-full overflow-auto">
        {menus.map((group) => (
          <div key={group.id}>
            <span className="text-sm font-bold">
              {isOpen ? group.label : ''}
            </span>
            {isOpen &&
              group.items.map(({ id, path, label, Icon }) => (
                <NavLink
                  key={id}
                  to={path}
                  className={({ isActive }) =>
                    clsx(
                      'font-medium flex gap-2 items-center pl-6 p-2 rounded-md',
                      {
                        'bg-[#d1d4dc]': isActive,
                        'hover:bg-[#091e4214]': !isActive,
                      },
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span className="text-sm">{label}</span>}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
      {/* Toggle Button at the Bottom */}
      <button
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className="mt-auto inline-flex items-center justify-end w-full p-2"
      >
        <ChevronDoubleRightIcon
          className={clsx('w-5 h-5 transition-transform', {
            'rotate-180': isOpen,
          })}
          // Modify the d attribute to swap the direction of the arrow
          d="M15 19l-7-7 7-7"
        />
      </button>
    </div>
  );
};
