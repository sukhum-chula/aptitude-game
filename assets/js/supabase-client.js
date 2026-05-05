// Initializes the Supabase client and exposes it as window.brainArenaSupabase.
// The publishable key is safe to ship to the browser — Row Level Security
// (configured in the Supabase dashboard) is what actually protects data.
// Never put service_role / sb_secret_* keys in this file.
(function () {
  const SUPABASE_URL = 'https://uxgszfjjrutpfwdlahbc.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WrsmHloIK8mJK5m50vHzzQ_t4tKcdY3';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[BrainArena] supabase-js not loaded — check the CDN <script> tag.');
    return;
  }

  window.brainArenaSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
})();
