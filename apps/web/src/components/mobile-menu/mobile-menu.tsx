import { XMarkIcon } from '@heroicons/react/24/outline';

import logo from 'assets/logo.png';
import { SidebarNav } from '../sidebar/sidebar-nav';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-espresso-900/45 backdrop-blur-sm lg:hidden"
        aria-label="Đóng menu"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,19rem)] flex-col border-r border-cream-200 bg-paper shadow-lift lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt=""
              className="h-9 w-auto object-contain"
            />
            <div>
              <p className="font-display text-lg font-semibold text-espresso-800">
                24HXH
              </p>
              <p className="text-xs text-espresso-500">Coffee Shop</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-espresso-600 hover:bg-cream-200"
            aria-label="Đóng"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-2">
          <SidebarNav showLabels onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
