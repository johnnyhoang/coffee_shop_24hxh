import { useMatches } from 'react-router-dom';

import { findMatchTitle } from '../utils/router-utils';

/**
 * Tiêu đề trang nằm trong khối nội dung (không đặt trên thanh chrome) — chuẩn layout dashboard.
 */
export function PageHeading() {
  const matches = useMatches();
  const title = findMatchTitle(matches);

  if (!title) {
    return null;
  }

  return (
    <header className="mb-6 border-b border-cream-200/90 pb-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-espresso-900 sm:text-2xl">
        {title}
      </h1>
    </header>
  );
}
