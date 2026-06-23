// components/Barang.js
import { api } from './services.js';

export const Barang = {
  name: 'Barang',
  data() {
    return {
      list: [],
      loading: false,
      error: '',
      showForm: false,
      formTitle: 'Tambah Barang',
      form: {
        id: null,
        nama_barang: '',
        kategori_id: '',
        stok: 0,
        harga: 0,
        supplier: '',
      },
      // tambahan: daftar kategori untuk dropdown
      kategoriList: [],
      kategoriLoading: false,
    };
  },
  async created() {
    await Promise.all([this.loadData(), this.loadKategori()]);
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = '';
      try {
        const res = await api.get('/barang');
        const data = res.data.data || res.data;
        this.list = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = 'Gagal memuat data barang.';
      } finally {
        this.loading = false;
      }
    },
    async loadKategori() {
      this.kategoriLoading = true;
      try {
        const res = await api.get('/kategori');
        const data = res.data.data || res.data;
        this.kategoriList = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Gagal memuat kategori.', e);
      } finally {
        this.kategoriLoading = false;
      }
    },
    openForm(barang = null) {
      if (barang) {
        this.formTitle = 'Edit Barang';
        this.form = {
          id: barang.id,
          nama_barang: barang.nama_barang,
          kategori_id: barang.kategori_id,
          stok: barang.stok,
          harga: barang.harga,
          supplier: barang.supplier,
        };
      } else {
        this.formTitle = 'Tambah Barang';
        this.form = {
          id: null,
          nama_barang: '',
          kategori_id: '',
          stok: 0,
          harga: 0,
          supplier: '',
        };
      }
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    async simpan() {
      if (!this.form.nama_barang || !this.form.kategori_id) {
        alert('Nama barang dan kategori wajib diisi.');
        return;
      }
      try {
        if (this.form.id) {
          await api.put('/barang/' + this.form.id, {
            nama_barang: this.form.nama_barang,
            kategori_id: this.form.kategori_id,
            stok: this.form.stok,
            harga: this.form.harga,
            supplier: this.form.supplier,
          });
        } else {
          await api.post('/barang', {
            nama_barang: this.form.nama_barang,
            kategori_id: this.form.kategori_id,
            stok: this.form.stok,
            harga: this.form.harga,
            supplier: this.form.supplier,
          });
        }
        this.showForm = false;
        await this.loadData();
      } catch (e) {
        alert(e.response?.data?.message || 'Gagal menyimpan data.');
      }
    },
    async hapus(id) {
      if (!confirm('Yakin ingin menghapus data ini?')) return;
      try {
        await api.delete('/barang/' + id);
        await this.loadData();
      } catch (e) {
        alert(e.response?.data?.message || 'Gagal menghapus data.');
      }
    },
    // bantu: cari nama kategori dari id untuk ditampilkan di tabel
    kategoriNama(kategori_id) {
      const k = this.kategoriList.find((x) => String(x.id) === String(kategori_id));
      return k ? k.nama_kategori || k.nama || k.label : kategori_id;
    },
  },
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Data Barang</h1>
          <p class="text-sm text-slate-500">
            Kelola master data barang di gudang.
          </p>
        </div>
        <button
          @click="openForm()"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-2 text-xs font-medium hover:bg-brand-700"
        >
          + Tambah Barang
        </button>
      </div>

      <div v-if="loading" class="text-sm text-slate-500">Memuat data...</div>
      <div v-if="error" class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
        {{ error }}
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-slate-200">
          <thead class="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th class="px-3 py-2 text-left">ID</th>
              <th class="px-3 py-2 text-left">Nama</th>
              <th class="px-3 py-2 text-left">Kategori</th>
              <th class="px-3 py-2 text-right">Stok</th>
              <th class="px-3 py-2 text-right">Harga</th>
              <th class="px-3 py-2 text-left">Supplier</th>
              <th class="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in list" :key="b.id">
              <td class="px-3 py-2">{{ b.id }}</td>
              <td class="px-3 py-2">{{ b.nama_barang }}</td>
              <td class="px-3 py-2">{{ kategoriNama(b.kategori_id) }}</td>
              <td class="px-3 py-2 text-right">{{ b.stok }}</td>
              <td class="px-3 py-2 text-right">{{ b.harga }}</td>
              <td class="px-3 py-2">{{ b.supplier }}</td>
              <td class="px-3 py-2 text-center space-x-2">
                <button
                  @click="openForm(b)"
                  class="text-xs text-brand-600 hover:text-brand-700"
                >
                  Edit
                </button>
                <button
                  @click="hapus(b.id)"
                  class="text-xs text-rose-600 hover:text-rose-700"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="!loading && list.length === 0">
              <td colspan="7" class="px-3 py-4 text-center text-xs text-slate-500">
                Belum ada data barang.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Form -->
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">{{ formTitle }}</h2>
            <button
              @click="closeForm"
              class="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              ✕
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="space-y-1">
              <label class="font-medium text-slate-700">Nama Barang</label>
              <input v-model="form.nama_barang" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div class="space-y-1">
              <label class="font-medium text-slate-700">Kategori</label>
              <select
                v-model="form.kategori_id"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
              >
                <option value="" disabled>Pilih kategori</option>
                <option
                  v-for="k in kategoriList"
                  :key="k.id"
                  :value="k.id"
                >
                  {{ k.nama_kategori || k.nama || ('ID ' + k.id) }}
                </option>
              </select>
              <p v-if="kategoriLoading" class="mt-1 text-[11px] text-slate-400">
                Memuat daftar kategori...
              </p>
            </div>
            <div class="space-y-1">
              <label class="font-medium text-slate-700">Stok</label>
              <input v-model.number="form.stok" type="number" class="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div class="space-y-1">
              <label class="font-medium text-slate-700">Harga</label>
              <input v-model.number="form.harga" type="number" class="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div class="space-y-1 col-span-2">
              <label class="font-medium text-slate-700">Supplier</label>
              <input v-model="form.supplier" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              @click="closeForm"
              class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-white"
            >
              Batal
            </button>
            <button
              @click="simpan"
              class="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs hover:bg-brand-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};