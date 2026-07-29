<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResenaRespuestaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $name = $this->usuario?->name ?? 'Usuario';

        return [
            'id' => $this->id,
            'comentario' => $this->comentario,
            'fecha' => $this->created_at?->format('Y-m-d'),
            'usuario' => [
                'id' => $this->usuario?->id,
                'nombre' => $name,
                'avatar' => $this->usuario?->avatar,
                'iniciales' => collect(explode(' ', $name))->map(fn ($part) => $part[0] ?? '')->take(2)->join(''),
            ],
        ];
    }
}
