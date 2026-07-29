<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResenaReaccion extends Model
{
    protected $fillable = ['resena_id', 'usuario_id', 'tipo'];
}
