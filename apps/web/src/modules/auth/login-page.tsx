import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import logo from '../../assets/logo.png';

export const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch {
      setErrorMsg('Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.');
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-12 text-espresso-800">
      <div className="w-full max-w-sm rounded-2xl border border-cream-200 bg-paper p-8 shadow-card text-center">
        <div className="mb-6 flex flex-col items-center">
          <img
            src={logo}
            alt="Coffee Shop 24HXH"
            className="mb-3 h-16 w-auto object-contain"
          />
          <h1 className="font-display text-2xl font-bold tracking-tight text-espresso-800">
            24HXH Coffee Shop
          </h1>
          <p className="mt-1 text-sm text-espresso-500">
            Hệ thống quản lý chuỗi cà phê 24HXH
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSigningIn}
          className="flex w-full min-h-[48px] items-center justify-center gap-3 rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm font-semibold text-espresso-800 shadow-sm transition hover:bg-cream-50 active:scale-[0.99] disabled:opacity-60"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isSigningIn ? 'Đang chuyển hướng...' : 'Đăng nhập bằng Google'}</span>
        </button>

        <p className="mt-6 text-xs text-espresso-400">
          Chỉ nhân viên và quản lý được cấp quyền mới có thể truy cập hệ thống.
        </p>
      </div>
    </div>
  );
};
