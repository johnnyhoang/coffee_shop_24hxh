import React from 'react';

const WelcomePage = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cream-200 bg-gradient-to-br from-paper via-cream-50 to-cream-100 p-6 shadow-card sm:p-10">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-caramel/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-sage/20 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-espresso-500">
          Coffee Shop 24HXH
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-espresso-800 sm:text-4xl">
          Chào mừng
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-espresso-600 sm:text-lg">
          Hệ thống quản lý đồ uống, bàn, khách hàng, chi nhánh và danh mục dùng
          chung — chọn mục trong menu để bắt đầu.
        </p>

        <p className="mt-10 text-sm text-espresso-500">
          Chúc một ca phục vụ suôn sẻ.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
