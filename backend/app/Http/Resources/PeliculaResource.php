<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeliculaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'director' => $this->director,
            'anio' => $this->anio,
            'sinopsis' => $this->sinopsis,
            'imagen' => $this->imagen ?: '/movie_posters.png',
            'genero_id' => $this->genero_id,
            'genero' => $this->genero?->nombre,
            'calificacion_promedio' => round((float) ($this->calificacion_promedio ?? 0), 1),
            'vistas' => (int) ($this->favoritos_count ?? 0),
            'duracion' => 'N/A',
            'estreno' => (int) $this->anio >= 2021 ? 'Reciente' : null,
            'tags' => array_values(array_filter([$this->genero?->nombre])),
            'enMiLista' => (bool) ($this->en_mi_lista ?? false),
            'vista' => (bool) ($this->vista ?? false),
            'resenas_count' => (int) ($this->resenas_count ?? 0),
            'resenas' => ResenaResource::collection($this->whenLoaded('resenas')),
            'relacionadas' => PeliculaResource::collection($this->whenLoaded('relacionadas')),
        ];
    }
}
