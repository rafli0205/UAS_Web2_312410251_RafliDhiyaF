<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\BarangModel;
use App\Models\KategoriModel;
use CodeIgniter\HTTP\ResponseInterface;

class Barang extends BaseController
{
    protected $model;
    protected $kategoriModel;

    public function __construct()
    {
        $this->model         = new BarangModel();
        $this->kategoriModel = new KategoriModel();
    }

    // GET /barang
    public function index()
    {
        $barang = $this->model
            ->select('barang.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = barang.kategori_id', 'left')
            ->findAll();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $barang,
        ]);
    }

    // GET /barang/{id}
    public function show($id = null)
    {
        $data = $this->model
            ->select('barang.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = barang.kategori_id', 'left')
            ->where('barang.id', $id)
            ->first();

        if (!$data) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Barang tidak ditemukan',
                ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data,
        ]);
    }

    // POST /barang
    public function create()
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            $input = $this->request->getPost();
        }

        $required = ['kategori_id', 'nama_barang', 'stok', 'harga'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status'  => false,
                        'message' => "Field {$field} wajib diisi",
                    ]);
            }
        }

        // cek kategori
        $kategori = $this->kategoriModel->find($input['kategori_id']);
        if (!$kategori) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Kategori tidak valid',
                ]);
        }

        $data = [
            'kategori_id' => $input['kategori_id'],
            'nama_barang' => $input['nama_barang'],
            'stok'        => (int) $input['stok'],
            'harga'       => (float) $input['harga'],
            'supplier'    => $input['supplier'] ?? null,
            'created_at'  => date('Y-m-d H:i:s'),
        ];

        $this->model->insert($data);

        return $this->response
            ->setStatusCode(ResponseInterface::HTTP_CREATED)
            ->setJSON([
                'status'  => true,
                'message' => 'Barang berhasil dibuat',
                'data'    => $data,
            ]);
    }

    // PUT /barang/{id}
    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            parse_str($this->request->getBody(), $input);
        }

        $barang = $this->model->find($id);
        if (!$barang) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Barang tidak ditemukan',
                ]);
        }

        $data = [];

        if (isset($input['kategori_id'])) {
            $kategori = $this->kategoriModel->find($input['kategori_id']);
            if (!$kategori) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status'  => false,
                        'message' => 'Kategori tidak valid',
                    ]);
            }
            $data['kategori_id'] = $input['kategori_id'];
        }

        if (isset($input['nama_barang'])) {
            $data['nama_barang'] = $input['nama_barang'];
        }

        if (isset($input['stok'])) {
            $data['stok'] = (int) $input['stok'];
        }

        if (isset($input['harga'])) {
            $data['harga'] = (float) $input['harga'];
        }

        if (isset($input['supplier'])) {
            $data['supplier'] = $input['supplier'];
        }

        if (empty($data)) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Tidak ada data yang diupdate',
                ]);
        }

        $this->model->update($id, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Barang berhasil diupdate',
        ]);
    }

    // DELETE /barang/{id}
    public function delete($id = null)
    {
        $barang = $this->model->find($id);
        if (!$barang) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Barang tidak ditemukan',
                ]);
        }

        $this->model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Barang berhasil dihapus',
        ]);
    }
}