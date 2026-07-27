<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResenaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'comentario' => ['required', 'string', 'min:5', 'max:1000'],
            'calificacion' => ['required', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
