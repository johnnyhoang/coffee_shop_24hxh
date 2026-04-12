import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

import logo from 'assets/logo.png';

type MobileAppBarProps = {
  onOpenMenu: () => void;
};

/**
 * Thanh trên chỉ hiện trên mobile: mở menu + nhận diện thương hiệu gọn (không trùng vai trò với tiêu đề trang).
 */
export function MobileAppBar({ onOpenMenu }: MobileAppBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-cream-200 bg-paper/95 px-4 backdrop-blur-md lg:hidden">
      <button
        type="button"
        className="rounded-xl p-2 text-espresso-700 hover:bg-cream-200"
        aria-label="Mở menu"
        onClick={onOpenMenu}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <Link
        to="/"
        className="flex min-w-0 flex-1 items-center gap-2.5"
        aria-label="Về trang chủ"
      >
        <img src={logo} alt="" className="h-9 w-auto object-contain" />
        <span className="font-display truncate text-base font-semibold text-espresso-800">
          Coffee Shop <span className="text-rust">24HXH</span>
        </span>
      </Link>
    </header>
  );
}
