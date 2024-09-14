<?php

namespace App\Models;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskSubmission extends Model
{
    use HasFactory;

    public function tasks(){
        return $this->belongsTo(Task::class, "task_id");
    }

    public function users(){
        return $this->belongsTo(User::class, "user_id");
    }

}
