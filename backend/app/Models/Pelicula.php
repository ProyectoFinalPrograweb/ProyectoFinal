<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    protected $fillable = ['titulo', 'director', 'anio', 'sinopsis', 'imagen', 'genero_id', 'usuario_id'];

    public function genero()
    {
        return $this->belongsTo(Genero::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function resenas()
    {
        return $this->hasMany(Resena::class);
    }

    public function marcadosPorUsuarios()
    {
        return $this->belongsToMany(User::class, 'favoritos', 'pelicula_id', 'usuario_id')->withTimestamps();
    }
}