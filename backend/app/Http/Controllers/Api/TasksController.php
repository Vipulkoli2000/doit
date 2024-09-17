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
            $tasks = Task::all();
               //i am sending realted users fron the resurce file
        } elseif($authUser == 'member'){
             $tasks = auth()->user()->tasks()->get();  //auth()->user()->tasks()->users()->get();   or auth()->user()->tasks()->with("users")->get();

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
        
        $authUser = auth()->user()->roles->pluck('name')->first();
          if($authUser == "admin"){
            if($request->has('assign_to')){
                $user_id = $request->input('assign_to');
                $task->users()->attach($user_id);
            }
          }elseif($authUser == "member"){
            $task->users()->attach($auth()->id);
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

    public function showProjectsTasks(string $projectId){
     
        $authUser = auth()->user()->roles->pluck('name')->first();
        if($authUser == 'admin'){
            $tasks = Task::with("users")
            ->where('project_id', $projectId)
            ->get();

        } elseif($authUser == 'member'){
             $tasks = auth()->user()->with("tasks.users")
             ->where('project_id', $projectId)
             ->get();  //auth()->user()->tasks()->users()->get();   or auth()->user()->tasks()->with("users")->get();

        }
           //should we give only one variable called data in every api?
        return $this->sendResponse(['Task'=> TaskResource::collection($tasks)], "Projects retrived successfuly");

    }


  
    public function search(Request $request)
    {
        // Retrieve query parameters
        $title = $request->query('title');
        $description = $request->query('description');
        $priority = $request->query('priority');
        $weight = $request->query('weight');
        $status = $request->query('status');

        $authUser = auth()->user()->roles->pluck("name")->first();
        if($authUser == "admin"){
            // Initialize query
            $query = Task::query();
        }
        elseif($authUser == "member"){
            $query = auth()->user()->tasks();
        }
       

        // Apply filters based on query parameters priority, weight status, start date and enddate
        if ($title) {
            $query->where('title', 'like', "%$title%");
        }

        if ($description) {
            $query->where('description', 'like', "%$description%");
        }

        if ($priority) {
            $query->where('priority', 'like', "%$priority%");
        }

        if ($weight) {
            $query->where('weight', 'like', "%$weight%");
        }

        if ($status) {
            $query->where('status', 'like', "%$status%");
        }

        // Execute query and get results
        $SearchedTask = $query->get();

        // Return results, possibly as JSON for an API response
       return $this->sendResponse(['SearchedTask'=> TaskResource::collection($SearchedTask)], 'data retrived successfully');
    }



}
