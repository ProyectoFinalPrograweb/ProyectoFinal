<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'method' => ['nullable', 'in:email,whatsapp'],
            'telefono' => ['required_if:method,whatsapp', 'nullable', 'regex:/^\d{10}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Escribe el correo asociado a tu cuenta.',
            'email.email' => 'Escribe un correo electronico valido.',
            'email.exists' => 'No encontramos una cuenta registrada con ese correo.',
            'method.in' => 'Elige un metodo de recuperacion valido.',
            'telefono.required_if' => 'Escribe un numero de WhatsApp para enviar el enlace.',
            'telefono.regex' => 'El numero debe tener 10 digitos de Mexico, sin espacios ni signos.',
        ];
    }
}
