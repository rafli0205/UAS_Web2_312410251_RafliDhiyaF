// components/Dashboard.js
import { api } from './services.js';

export const Dashboard = {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      stats: {
        totalBarang: null,
        totalKategori: null,
      },
      loading: false,
      error: '',
    };
  },
  async created() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
    }

    this.loading = true;
    try {
      const [barangRes, kategoriRes] = await Promise.all([
        api.get('/barang'),
        api.get('/kategori'),
      ]);
      const barangData = barangRes.data.data || barangRes.data;
      const kategoriData = kategoriRes.data.data || kategoriRes.data;
      this.stats.totalBarang = Array.isArray(barangData) ? barangData.length : 0;
      this.stats.totalKategori = Array.isArray(kategoriData) ? kategoriData.length : 0;
    } catch (e) {
      this.error = 'Gagal memuat statistik.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    doLogout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('api_token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'login' });
    },
  },
  template: `
    <div class="min-h-screen flex bg-slate-50">
      <!-- Sidebar -->
      <aside class="hidden md:flex md:flex-col w-64 border-r border-slate-200 bg-white/90 fixed inset-y-0 left-0 z-30">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-xl">
              📦
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">InventoriKu</p>
              <p class="text-[11px] text-slate-400">E-Inventory SaaS</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <router-link
            to="/dashboard"
            class="block px-3 py-2 rounded-lg text-sm"
            active-class="bg-brand-50 text-brand-700"
          >
            Dashboard
          </router-link>
          <router-link
            to="/dashboard/barang"
            class="block px-3 py-2 rounded-lg text-sm"
            active-class="bg-brand-50 text-brand-700"
          >
            Stok Barang
          </router-link>
        </nav>

        <div class="border-t border-slate-100 px-4 py-3">
          <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50">
            <div>
              <p class="text-xs font-semibold text-slate-800">
                {{ user?.username || 'Administrator' }}
              </p>
            </div>
            <button
              @click="doLogout"
              class="text-[11px] font-medium text-rose-500 hover:text-rose-600"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col md:pl-64 min-h-screen">
        <header class="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div class="px-4 sm:px-6 h-14 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wide">InventoriKu</p>
              <p class="text-sm font-semibold text-slate-800">Dashboard</p>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 sm:px-6 py-4 sm:py-6">
          <router-view></router-view>
        </main>
      </div>
    </div>
  `,
};