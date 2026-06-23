<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;

class Seed extends BaseController
{
    public function admin()
    {
        $userModel = new UserModel();

        // cek apakah user admin sudah ada
        $existing = $userModel->where('username', 'admin')->first();
        if ($existing) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User admin sudah ada',
            ]);
        }

        // insert user admin default
        $userModel->insert([
            'username'   => 'admin',
            'password'   => password_hash('admin123', PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'User admin berhasil dibuat (admin / admin123)',
        ]);
    }
}