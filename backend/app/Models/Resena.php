<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    protected $fillable = ['usuario_id', 'pelicula_id', 'comentario', 'calificacion'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function pelicula()
    {
        return $this->belongsTo(Pelicula::class);
    }
}
