<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\TaskSubmission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory, softDeletes;


    protected $casts = [
        'project_id' => 'integer',
        "start_date" => "date:Y-m-d",
        "end_date" => "date:Y-m-d",
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

    // public function setStartDateAttribute($value)
    // {
    //         $this->attributes['start_date'] = $value ? Carbon::createFromFormat('Y/m/d', $value)->format('Y-m-d') : null;
    // }

    // public function getStartDateAttribute($value)
    // {
    //         return $value ? Carbon::parse($value)->format('Y-m-d') : null;   
    // }   
    
    // public function setEndDateAttribute($value)
    // {
    //         $this->attributes['end_date'] = $value ? Carbon::createFromFormat('Y/m/d', $value)->format('Y-m-d') : null;
    // }

    // public function getEndDateAttribute($value)
    // {
    //         return $value ? Carbon::parse($value)->format('Y-m-d') : null;   
    // }   

}
