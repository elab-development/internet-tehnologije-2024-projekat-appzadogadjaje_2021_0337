<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        $token = app('auth.password.broker')->createToken($user);

        Mail::raw("Reset link: " . config('app.frontend_url') . "/reset-password?token={$token}&email={$user->email}", function (Message $message) use ($user) {
            $message->to($user->email)
                    ->subject('Reset lozinke');
        });

        return response()->json([
            'message' => 'Reset link poslat na email.',
            'reset_link' => config('app.frontend_url') . "/reset-password?token={$token}&email={$user->email}" 
        ]);
    }
}
