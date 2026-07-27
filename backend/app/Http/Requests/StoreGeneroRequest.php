<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGeneroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->nombre === 'Administrador';
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255', Rule::unique('generos', 'nombre')->ignore($this->route('genero'))],
            'descripcion' => ['nullable', 'string', 'max:255'],
        ];
    }
}
