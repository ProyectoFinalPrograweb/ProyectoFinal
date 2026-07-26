<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('resenas', function (Blueprint $table) {
        $table->id();
        $table->text('comentario');
        $table->decimal('calificacion', 3, 1); // Ejemplo: 9.5
        // Llaves foráneas
        $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('pelicula_id')->constrained('peliculas')->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};
