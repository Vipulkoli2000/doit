<?php

namespace App\Http\Controllers\Api;

use Validator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\BaseController;

class UserController extends BaseController
{
     /**
     * Register User
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
             'name'=>'required|string|max:255',
             'email'=>['required', 'email:rfc,dns', 'unique:users'],
             'password'=>'required|string|min:6|confirmed',
             'password_confirmation'=>'required',
        ]);

      
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = new User();
        $user->name = $input['name'];
        $user->email = $input['email'];
        $user->password = $input['password'];
        $user->save();

        $memberRole = Role::where('name', 'member')->first();
        $user->assignRole($memberRole);
        //$role = $user->getRoleNames();

        return $this->sendResponse(['user'=>new UserResource($user)], 'User register successfully.');
    }

     /**
     * Login User
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'=>['required','email'],
            'password'=>['required','string','min:6'],
        ]);

        if($validator->fails()){
           return $this->sendError('Validation Error.', $validator->errors());
        }

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $token =  $user->createToken($user->name)->plainTextToken;

            return $this->sendResponse(['user'=>new UserResource($user), 'token'=>$token], 'User login successfully.');

        } else{
            return $this->sendError('Invalid Credentials.', ['error'=>'Invalid Credentials']);
        }
    }

     /**
     * Logout User
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->sendResponse([], 'User logged out successfully.');
    }


}
