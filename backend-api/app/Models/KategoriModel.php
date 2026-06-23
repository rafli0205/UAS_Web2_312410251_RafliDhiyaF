<?php

namespace App\Models;

use CodeIgniter\Model;

class KategoriModel extends Model
{
    protected $table      = 'kategori';
    protected $primaryKey = 'id';

    protected $allowedFields = ['nama_kategori', 'created_at'];

    protected $useTimestamps = false;
}