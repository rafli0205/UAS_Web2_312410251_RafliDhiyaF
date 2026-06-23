<?php

namespace App\Models;

use CodeIgniter\Model;

class BarangModel extends Model
{
    protected $table      = 'barang';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'kategori_id',
        'nama_barang',
        'stok',
        'harga',
        'supplier',
        'created_at',
    ];

    protected $useTimestamps = false;
}