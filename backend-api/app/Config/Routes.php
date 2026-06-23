<?php

namespace Config;

use CodeIgniter\Router\RouteCollection;
use Config\Services;

/**
 * @var RouteCollection $routes
 */
$routes = Services::routes();

/*
 |--------------------------------------------------------------------
 | Router Setup
 |--------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

/*
 |--------------------------------------------------------------------
 | Route Definitions
 |--------------------------------------------------------------------
 */

// Root API info
$routes->get('/', function () {
    return json_encode([
        'status'  => true,
        'message' => 'API InventoriKu siap (CodeIgniter 4)',
    ]);
});

// Seeder & test (opsional)
$routes->get('seed-admin', 'Seed::admin');
$routes->get('test', 'Test::index');

// LOGIN
$routes->get('login', 'Auth::loginInfo');   // GET /login hanya info
$routes->post('login', 'Auth::login');      // POST /login proses login

// KATEGORI
$routes->group('kategori', function ($routes) {
    // publik
    $routes->get('/', 'Kategori::index');
    $routes->get('(:num)', 'Kategori::show/$1');

    // butuh token
    $routes->post('/', 'Kategori::create', ['filter' => 'authToken']);
    $routes->put('(:num)', 'Kategori::update/$1', ['filter' => 'authToken']);
    $routes->delete('(:num)', 'Kategori::delete/$1', ['filter' => 'authToken']);
});

// BARANG
$routes->group('barang', function ($routes) {
    // publik
    $routes->get('/', 'Barang::index');
    $routes->get('(:num)', 'Barang::show/$1');

    // butuh token
    $routes->post('/', 'Barang::create', ['filter' => 'authToken']);
    $routes->put('(:num)', 'Barang::update/$1', ['filter' => 'authToken']);
    $routes->delete('(:num)', 'Barang::delete/$1', ['filter' => 'authToken']);
});

/*
 |--------------------------------------------------------------------
 | Additional Routing
 |--------------------------------------------------------------------
 */
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}