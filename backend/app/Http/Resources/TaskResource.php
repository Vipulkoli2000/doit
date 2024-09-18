<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
          $users = UserResource::collection($this->users);
          $projects = $this->projects;

        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'weight' => $this->weight,
            'status' => $this->status,
            'start_date' => $this->start_date ? $this->start_date->format("Y-m-d") : null,
            'end_date' => $this->end_date ? $this->end_date->format("Y-m-d") : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            "assign_to" => $users->pluck("name"),
            'project' => $projects ? [$projects->name]: [null],
        ];

    }
}
