import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { menus } from './sidebar.constants';

type SidebarNavProps = {
  /** Hiển thị nhãn đầy đủ (desktop mở hoặc drawer) */
  showLabels: boolean;
  /** Đóng drawer sau khi chọn (mobile) */
  onNavigate?: () => void;
};

export function SidebarNav({ showLabels, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 overflow-y-auto pb-4">
      {menus.map((group) => (
        <div key={group.id} className="mb-2">
          {showLabels && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-400">
              {group.label}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ id, path, label, Icon }) => (
              <li key={id}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    clsx(
                      'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-espresso-700 text-paper shadow-card'
                        : 'text-espresso-700 hover:bg-cream-200',
                    )
                  }
                >
                  <Icon
                    className={clsx(
                      'h-5 w-5 shrink-0',
                      !showLabels && 'mx-auto',
                    )}
                  />
                  {showLabels && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
