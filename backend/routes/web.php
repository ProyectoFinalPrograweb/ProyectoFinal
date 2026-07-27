<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $frontendIndex = public_path('index.html');

    if (file_exists($frontendIndex)) {
        return response()->file($frontendIndex);
    }

    return view('welcome');
})->where('any', '.*');
