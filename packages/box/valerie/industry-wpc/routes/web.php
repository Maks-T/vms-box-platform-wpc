<?php
use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryWpc\Http\Controllers\CalculatorController;

Route::get('/calculator/{type?}', [CalculatorController::class, 'show'])
  ->name('calculator.show');
