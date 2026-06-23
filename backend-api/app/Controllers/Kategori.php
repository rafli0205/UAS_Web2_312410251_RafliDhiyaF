<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\KategoriModel;
use CodeIgniter\HTTP\ResponseInterface;

class Kategori extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new KategoriModel();
    }

    // GET /kategori
    public function index()
    {
        $data = $this->model->findAll();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data,
        ]);
    }

    // GET /kategori/{id}
    public function show($id = null)
    {
        $kategori = $this->model->find($id);

        if (!$kategori) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Kategori tidak ditemukan',
                ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $kategori,
        ]);
    }

    // POST /kategori
    public function create()
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            $input = $this->request->getPost();
        }

        if (!isset($input['nama_kategori']) || trim($input['nama_kategori']) === '') {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Nama kategori wajib diisi',
                ]);
        }

        $data = [
            'nama_kategori' => $input['nama_kategori'],
            'created_at'    => date('Y-m-d H:i:s'),
        ];

        $this->model->insert($data);

        return $this->response
            ->setStatusCode(ResponseInterface::HTTP_CREATED)
            ->setJSON([
                'status'  => true,
                'message' => 'Kategori berhasil dibuat',
                'data'    => $data,
            ]);
    }

    // PUT /kategori/{id}
    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            parse_str($this->request->getBody(), $input);
        }

        $kategori = $this->model->find($id);
        if (!$kategori) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Kategori tidak ditemukan',
                ]);
        }

        $data = [];

        if (isset($input['nama_kategori'])) {
            $data['nama_kategori'] = $input['nama_kategori'];
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
            'message' => 'Kategori berhasil diupdate',
        ]);
    }

    // DELETE /kategori/{id}
    public function delete($id = null)
    {
        $kategori = $this->model->find($id);
        if (!$kategori) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Kategori tidak ditemukan',
                ]);
        }

        $this->model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}