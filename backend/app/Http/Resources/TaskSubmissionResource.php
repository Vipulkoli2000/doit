<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class taskSubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {   
          $submitted_by = new UserResource($this->users);
        
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            "user_id" => $this->user_id,
            'submitted' => $this->submitted,
            'comments' => $this->comments,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
            'attachment' => $this->attachment,
            // 'submitted_by' => new UserResource($this->whenLoaded('users')), //not working
            "submitted_by" => $submitted_by,
        ];   
    }
}
