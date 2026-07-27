<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResenaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $name = $this->usuario?->name ?? 'Usuario';

        return [
            'id' => $this->id,
            'pelicula_id' => $this->pelicula_id,
            'pelicula_titulo' => $this->pelicula?->titulo,
            'comentario' => $this->comentario,
            'calificacion' => (float) $this->calificacion,
            'fecha' => $this->created_at?->format('Y-m-d'),
            'likes' => 0,
            'usuario' => [
                'id' => $this->usuario?->id,
                'nombre' => $name,
                'avatar' => collect(explode(' ', $name))->map(fn ($part) => $part[0] ?? '')->take(2)->join(''),
            ],
        ];
    }
}
