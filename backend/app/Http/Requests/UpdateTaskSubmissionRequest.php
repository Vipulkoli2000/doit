<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'submitted' => ['boolean'],
            'comments' => ['nullable', 'string'],
            'attachment' => ['nullable','file', 'mimes:jpg,png,jpeg,pdf,doc,webp', 'max:2048'],
        ];
    }
}
