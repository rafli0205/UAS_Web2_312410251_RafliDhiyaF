<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class Auth extends BaseController
{
    // GET /login – hanya info supaya tidak 404 di browser
    public function loginInfo()
    {
        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Endpoint login siap, gunakan POST /login untuk autentikasi.',
        ]);
    }

    // POST /login – dipakai frontend & Postman
    public function login()
    {
        // Ambil dari POST form
        $input = $this->request->getPost();

        // Kalau kosong, coba JSON body
        if (!$input || count($input) === 0) {
            try {
                $json = $this->request->getJSON(true);
            } catch (\Throwable $e) {
                $json = null;
            }

            if ($json) {
                $input = $json;
            }
        }

        $username = $input['username'] ?? null;
        $password = $input['password'] ?? null;

        if (!$username || !$password) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Username dan password wajib diisi',
                ]);
        }

        $userModel = new UserModel();
        $user      = $userModel->where('username', $username)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Username atau password salah',
                ]);
        }

        // Generate token random
        $token = bin2hex(random_bytes(32));

        // Simpan token di cache 1 jam
        $cache = cache();
        $cache->save('token_' . $token, $user['id'], 3600);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Login berhasil',
            'data'    => [
                'user' => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                ],
                'token'      => $token,
                'expires_in' => 3600,
            ],
        ]);
    }
}