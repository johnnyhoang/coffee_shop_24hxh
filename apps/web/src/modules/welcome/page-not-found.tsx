import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-cream-200 bg-gradient-to-b from-paper to-cream-50 px-6 py-16 text-center shadow-card">
      <p className="font-display text-7xl font-semibold text-rust">404</p>
      <h1 className="mt-4 font-display text-2xl text-espresso-800">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 max-w-md text-espresso-600">
        Đường dẫn có thể đang được phát triển hoặc không tồn tại. Thử quay lại
        trang chủ.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-espresso-700 px-6 text-sm font-medium text-paper shadow-card transition hover:bg-espresso-600"
      >
        Về trang chủ
      </Link>
    </div>
  );
};

export default PageNotFound;
