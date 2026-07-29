<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResenaRespuesta extends Model
{
    protected $fillable = ['resena_id', 'usuario_id', 'comentario'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function resena()
    {
        return $this->belongsTo(Resena::class);
    }
}
