<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
             'project_id' => ['required', 'integer'],
             'title' => ['required', 'string'],
             'description' => ['nullable', 'string'],
             'status' => ['nullable', 'string'],
             'start_date'=> [ 'nullable','date'],
             'end_date' => [ 'nullable','date', 'after_or_equal:start_date'],
             'assign_to' => ['required'],
        ];
    }
}
