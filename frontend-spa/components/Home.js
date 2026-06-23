// components/Home.js
import { api } from './services.js';

export const Home = {
  name: 'Home',
  data() {
    return {
      totalBarang: null,
      totalKategori: null,
      loading: false,
      error: '',
    };
  },
  async created() {
    this.loading = true;
    this.error = '';
    try {
      const [barangRes, kategoriRes] = await Promise.all([
        api.get('/barang'),
        api.get('/kategori'),
      ]);
      const barangData = barangRes.data.data || barangRes.data;
      const kategoriData = kategoriRes.data.data || kategoriRes.data;
      this.totalBarang = Array.isArray(barangData) ? barangData.length : 0;
      this.totalKategori = Array.isArray(kategoriData) ? kategoriData.length : 0;
    } catch (e) {
      this.error = 'Gagal memuat ringkasan data.';
    } finally {
      this.loading = false;
    }
  },
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
      <div class="max-w-xl bg-white rounded-2xl shadow-soft border border-slate-100 p-8 space-y-4">
        <h1 class="text-2xl font-semibold text-slate-900 text-center">
          InventoriKu - Sistem Manajemen Inventaris
        </h1>
        <p class="text-sm text-slate-500 text-center">
          Aplikasi ini digunakan untuk mengelola data barang dan kategori secara terpusat.
        </p>

        <div v-if="loading" class="text-center text-sm text-slate-500">
          Memuat ringkasan data...
        </div>

        <div v-else class="grid grid-cols-2 gap-4">
          <div class="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Total Barang</p>
            <p class="mt-1 text-xl font-semibold text-slate-900">{{ totalBarang ?? '-' }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Total Kategori</p>
            <p class="mt-1 text-xl font-semibold text-slate-900">{{ totalKategori ?? '-' }}</p>
          </div>
        </div>

        <p v-if="error" class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          {{ error }}
        </p>

        <div class="pt-2 text-center">
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            Masuk sebagai Admin
          </router-link>
        </div>
      </div>
    </div>
  `,
};