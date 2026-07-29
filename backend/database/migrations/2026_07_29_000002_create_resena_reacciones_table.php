<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resena_reacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resena_id')->constrained('resenas')->cascadeOnDelete();
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete();
            $table->string('tipo', 12);
            $table->timestamps();

            $table->unique(['resena_id', 'usuario_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resena_reacciones');
    }
};
