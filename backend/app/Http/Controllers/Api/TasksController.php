<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Controllers\Api\BaseController;

class TasksController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $authUser = auth()->user()->roles->pluck('name')->first();
        if($authUser == 'admin'){
            $tasks = Task::with("users")->get();

        } elseif($authUser == 'member'){
             $tasks = auth()->user()->with("tasks.users")->get();  //auth()->user()->tasks()->users()->get();   or auth()->user()->tasks()->with("users")->get();

        }
           //should we give only one variable called data in every api?
        return $this->sendResponse(['Task'=> TaskResource::collection($tasks)], "Projects retrived successfuly");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = new Task();
        $task->project_id = $request->input('project_id');
        $task->title = $request->input('title');
        $task->description = $request->input("description");
        $task->priority = $request->input('priority'); 
        $task->weight = $request->input('weight');
        $task->status = $request->input('status');
        $task->start_date = $request->input('start_date');
        $task->end_date = $request->input('end_date');
        $task->save();

        if($request->has('assign_to')){
            $user_id = $request->input('assign_to');
            $task->users()->attach($user_id);
        }

        return $this->sendResponse(['Task'=> new TaskResource($task)], "Tasks Stored Successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $task = Task::find($id);
        if(!$task){
            return $this->sendError("Task not found", ['error'=>'Task not found']);
        }

        // $task->load("users");
        return $this->sendResponse(['Task'=> new TaskResource($task)], "task Retrived Successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, string $id): JsonResponse
    {

        $task = Task::find($id);
        if(!$task){
            return $this->sendError("Task not found", ['error'=>'Task not found']);
        }

        // $task->project_id = $request->input('project_id');
        $task->title = $request->input('title');
        $task->description = $request->input("description");
        $task->priority = $request->input('priority'); 
        $task->weight = $request->input('weight');
        $task->status = $request->input('status');
        $task->start_date = $request->input('start_date');
        $task->end_date = $request->input('end_date');
        $task->save();

        if($request->has("assign_to")){
            $user_id = $request->input("assign_to");
            $task->users()->sync($user_id);
        }
        else{
            $task->users()->detach();
        }

        return $this->sendResponse(['Task'=> new TaskResource($task)], "Tasks Updated Successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $task = Task::find($id);
        if(!$task){
            return $this->sendError("Task not found", ['error'=>'Task not found']);
        }

        $task->delete();

        return $this->sendResponse([], "Task Deleted Successfully");
    }
}
