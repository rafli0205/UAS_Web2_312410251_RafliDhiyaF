<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\Honeypot;

// tambahkan use untuk filter custom kamu
use App\Config\Filters\Cors;
use App\Config\Filters\AuthToken;

class Filters extends BaseConfig
{
    /**
     * Aliases untuk filter-filter yang bisa digunakan
     * di routes atau global.
     */
    public array $aliases = [
        'csrf'        => CSRF::class,
        'toolbar'     => DebugToolbar::class,
        'honeypot'    => Honeypot::class,

        // custom filter
        'cors'        => Cors::class,
        'authToken'   => AuthToken::class,
    ];

    /**
     * Filter global yang dijalankan untuk setiap request.
     */
    public array $globals = [
        'before' => [
            // 'honeypot',
            // 'csrf',
            'cors', // jalankan filter CORS sebelum request masuk ke controller
        ],
        'after' => [
            // 'toolbar',   // matikan dulu
            'cors', // tambahkan header CORS juga setelah response dibuat
        ],
    ];

    /**
     * Filter berdasarkan HTTP methods (opsional, tidak wajib diubah).
     */
    public array $methods = [
        // 'post' => ['csrf'],
    ];

    /**
     * Filter berdasarkan pola URI tertentu (opsional).
     */
    public array $filters = [
        // kalau mau pakai authToken per group di sini juga bisa,
        // tapi di jawaban sebelumnya kita pakai di Routes langsung.
        // 'authToken' => [
        //     'before' => ['kategori/*', 'barang/*'],
        // ],
    ];
}