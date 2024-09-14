<?php

namespace App\Http\Controllers\Api;

use File;
use Illuminate\Http\Request;
use Response;
use App\Models\TaskSubmission;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\TaskSubmissionResource;
use App\Http\Requests\StoreTaskSubmissionRequest;
use App\Http\Requests\UpdateTaskSubmissionRequest;

class TaskSubmissionsController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $authUser = auth()->user()->roles->pluck("name")->first();

        if($authUser == "admin"){
        //    $taskSubmission = TaskSubmission::with("users")->get();   
           $taskSubmission = TaskSubmission::all();   //this also gonna display users cause we are sending users from resource.  
        }else if($authUser == "member"){
            $taskSubmission = auth()->user()->with("taskSubmissions.users")->get();
        }

        return $this->sendResponse(['TaskSubmissions'=> TaskSubmissionResource::collection($taskSubmission)], "Task Submissions retrived successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskSubmissionRequest $request): JsonResponse
    {
        if($request->hasFile('attachment')){
            //get original file name
            $FileNameWithExtention = $request->file('attachment')->getClientOriginalName();
             // Extract the filename without extension
            $Filename = pathinfo($FileNameWithExtention, PATHINFO_FILENAME);
            $fileExtention = $request->file('attachment')->getClientOriginalExtension();
            $FileNameToStore = $Filename.'_'.time().'.'.$fileExtention;
            $filePath = $request->file('attachment')->storeAs('public/TaskSubmissions', $FileNameToStore);
         }

        $taskSubmission = new TaskSubmission();
        $taskSubmission->task_id = $request->input("task_id");
        $taskSubmission->user_id = auth()->user()->id;
        $taskSubmission->submitted = $request->input("submitted");
        $taskSubmission->comments = $request->input("comments");
        if($request->hasFile("attachment")){
            $taskSubmission->attachment = $FileNameToStore;
        }
        $taskSubmission->save();
        return $this->sendResponse(["TaskSubmission"=> new TaskSubmissionResource($taskSubmission)], "TaskSubmission Stored Successfully");

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $taskSubmission = TaskSubmission::find($id);

        if(!$taskSubmission){
            return $this->sendError("Task Submission not found", ["error"=> "taskSubmission not found"]);
        }
        // $taskSubmission->load("users");  //no need i think
        return $this->sendResponse(["TaskSubmission"=> new TaskSubmissionResource($taskSubmission)], "TaskSubmisson Retrived Successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskSubmissionRequest $request, string $id): JsonResponse
    {
        $taskSubmission = TaskSubmission::find($id);

        if(!$taskSubmission){
            return $this->sendError(["Task Submission not found"], "Task Submission not found");
        }

        if($request->hasFile('attachment')){

            if(!empty($taskSubmission->attachment) && Storage::exists('public/TaskSubmissions/'.$taskSubmission->attachment)) {
                Storage::delete('public/TaskSubmissions/'.$taskSubmission->attachment);
            }
            
           //get original file name
            $FileNameWithExtention = $request->file('attachment')->getClientOriginalName();
             // Extract the filename without extension
            $Filename = pathinfo($FileNameWithExtention, PATHINFO_FILENAME);
            $fileExtention = $request->file('attachment')->getClientOriginalExtension();
            $FileNameToStore = $Filename.'_'.time().'.'.$fileExtention;
            $filePath = $request->file('attachment')->storeAs('public/TaskSubmissions', $FileNameToStore);
         }

        $taskSubmission->submitted = $request->input("submitted");
        $taskSubmission->comments = $request->input("comments");
        if($request->hasFile("attachment")){
            $taskSubmission->attachment = $FileNameToStore;
        }
        $taskSubmission->save();
        // $taskSubmission->load("users"); 
        return $this->sendResponse(["taskSubmission"=> new TaskSubmissionResource($taskSubmission)], "TaskSubmisson Updated Successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id):JsonResponse
    {
        $taskSubmission = TaskSubmission::find($id);

        if(!$taskSubmission){
            return $this->sendError("Task Submission not found", ["error"=> "taskSubmission not found"]);
        }

         if(!empty($taskSubmission->attachment) && Storage::exists('public/TaskSubmissions/'.$taskSubmission->attachment)) {
            Storage::delete('public/TaskSubmissions/'.$taskSubmission->attachment);
        }

        $taskSubmission->delete();

        return $this->sendResponse([], "TaskSubmisson Deleted Successfully");

    }

    public function showFiles(string $files){

        $location = ['app/public/TaskSubmissions/'];
    
        foreach($location as $loc){
            $path = storage_path($loc.$files);
            if(file_exists($path)){
                break;
            }
        }
    
        $file = File::get($path);
        $type = \File::mimeType($path);
    
        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);
        $response->header('Content-Disposition', 'inline; filename="' . $files . '"');
    
        return $response;
    
    }


}
