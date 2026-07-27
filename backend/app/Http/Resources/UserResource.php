<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'nombre' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'role_id' => $this->role_id,
            'role' => $this->role?->nombre,
            'rol' => $this->role?->nombre,
            'peliculas' => $this->whenCounted('peliculas'),
            'resenas' => $this->whenCounted('resenas'),
            'activo' => true,
        ];
    }
}
