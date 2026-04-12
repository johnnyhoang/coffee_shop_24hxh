import clsx from 'clsx';
import type { ReactNode } from 'react';

type PageListCardProps = {
  /** Thanh lọc / tìm kiếm / nút thêm */
  toolbar: ReactNode;
  /** Bảng hoặc Loading */
  children: ReactNode;
  className?: string;
};

/**
 * Khối danh sách thống nhất: viền cream, shadow nhẹ, toolbar gradient — dùng cho mọi trang CRUD dạng bảng.
 */
export function PageListCard({ toolbar, children, className }: PageListCardProps) {
  return (
    <section
      className={clsx(
        'overflow-hidden rounded-xl border border-cream-200 bg-paper shadow-card',
        className,
      )}
    >
      <div className="border-b border-cream-200/90 bg-gradient-to-br from-paper via-cream-50/90 to-cream-100/50 px-3 py-4 sm:px-4">
        {toolbar}
      </div>
      <div className="min-h-0 bg-paper">{children}</div>
    </section>
  );
}
