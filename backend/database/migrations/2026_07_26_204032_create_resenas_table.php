<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();
            $table->text('comentario');
            $table->decimal('calificacion', 3, 1);
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('pelicula_id')->constrained('peliculas')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['usuario_id', 'pelicula_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};
