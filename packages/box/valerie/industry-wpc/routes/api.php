<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryWpc\Http\Controllers\Api\V1\ServiceMatrixController;
use Valerie\Box\IndustryWpc\Http\Controllers\Api\V1\WpcConfigBridgeController;
use Valerie\Box\IndustryWpc\Http\Controllers\CalculatorController;

/*
|--------------------------------------------------------------------------
| API Routes - Valerie WPC Industry Package
|--------------------------------------------------------------------------
*/


Route::get('/stone/services-matrix', [ServiceMatrixController::class, 'index']);

// Временный api-мост для совместимости с легаси-виджетом летомаркет
Route::get('/products', [WpcConfigBridgeController::class, 'products']);
Route::get('/config/{type}', [WpcConfigBridgeController::class, 'config']);
Route::get('/settings', [WpcConfigBridgeController::class, 'settings']);
Route::get('/layouts', [WpcConfigBridgeController::class, 'layouts']);
