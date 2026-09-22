/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_APP_API_BASE_URL?: string;
  readonly DEV_SERVER_PORT?: string;
  readonly DEV_SERVER_HOST?: string;
  readonly DEV_OPEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
