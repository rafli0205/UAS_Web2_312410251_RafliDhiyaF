// components/Login.js
import { api } from './services.js';

export const Login = {
  name: 'Login',
  data() {
    return {
      username: 'admin',
      password: 'admin123',
      loading: false,
      error: '',
    };
  },
  methods: {
    async doLogin() {
      this.error = '';
      this.loading = true;
      try {
        const res = await api.post('/login', {
          username: this.username,
          password: this.password,
        });

        if (res.data && res.data.status) {
          const user = res.data.data.user;
          const token = res.data.data.token;

          localStorage.setItem('api_token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');

          this.$router.push({ name: 'dashboard' });
        } else {
          this.error = res.data.message || 'Login gagal';
        }
      } catch (e) {
        this.error = e.response?.data?.message || 'Login gagal';
      } finally {
        this.loading = false;
      }
    },
  },
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-soft px-8 py-10 border border-slate-100">
        <div class="flex flex-col items-center mb-8">
          <div class="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-500/40">
            📦
          </div>
          <p class="mt-4 text-sm font-semibold tracking-wide text-brand-600 uppercase">
            InventoriKu
          </p>
          <h1 class="mt-1 text-xl font-semibold text-slate-900">
            Log in to your account
          </h1>
          <p class="mt-1 text-xs text-slate-500">
            Masuk dengan akun admin bawaan (admin / admin123).
          </p>
        </div>

        <form @submit.prevent="doLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-700">Username</label>
            <input
              v-model="username"
              type="text"
              class="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              placeholder="admin"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-700">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              placeholder="admin123"
            />
          </div>

          <div v-if="error" class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full inline-flex items-center justify-center rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 mt-1 disabled:opacity-70"
          >
            <span v-if="!loading">Masuk</span>
            <span v-else class="flex items-center gap-2">
              <span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              <span>Memproses...</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  `,
};