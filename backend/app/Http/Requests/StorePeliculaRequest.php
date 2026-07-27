<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeliculaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->nombre === 'Administrador';
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:255'],
            'director' => ['required', 'string', 'max:255'],
            'anio' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 5)],
            'sinopsis' => ['required', 'string', 'min:10'],
            'imagen' => ['nullable', 'string', 'max:255'],
            'genero_id' => ['required', 'integer', 'exists:generos,id'],
        ];
    }
}
