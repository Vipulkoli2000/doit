<?php

namespace App\Models;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\TaskSubmission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $casts = [
        'project_id' => 'integer',
        "start_date" => "date",
        "end_date" => "date",
    ];

    public function projects(){
        return $this->belongsTo(Project::class, "project_id"); //mabeProject::class not sure
    }

    public function users(){
        return $this->belongsToMany(User::class, "task_user");  //for task assign to users
    }

    public function taskSubmissions(){
        return $this->hasMany(TaskSubmission::class, "task_id");
    }

}
