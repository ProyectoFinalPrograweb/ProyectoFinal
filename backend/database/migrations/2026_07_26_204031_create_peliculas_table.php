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
    Schema::create('peliculas', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->string('director');
        $table->integer('anio');
        $table->text('sinopsis');
        $table->string('imagen')->nullable();
        // Llaves foráneas
        $table->foreignId('genero_id')->constrained('generos')->onDelete('cascade');
        $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade'); // Usuario que la publicó
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peliculas');
    }
};
