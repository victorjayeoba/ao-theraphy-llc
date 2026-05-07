<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Support;
use App\Mail\SupportInquiryMail;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
        ]);

        $inquiry = Support::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'preferred_contact_method' => $request->preferred_contact_method,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_active' => false
        ]);

        // Send email to admin
        Mail::to(config('mail.admin_address'))->send(new SupportInquiryMail($inquiry));

        return response()->json(['message' => 'Thank you for contacting us! Your inquiry has been submitted successfully.']);
    }    
    public function showinquiries()
    {
        $inquiries = Support::orderByDesc('created_at')->get();
        return response()->json([
            'status' => true,
            'total' => $inquiries->count(),
            'data' => $inquiries
        ]);
    }    
    public function showInquiry($id)
    {
        $inquiry = \App\Models\Support::findOrFail($id);
        $inquiry->is_active = true;
        $inquiry->save();
        return response()->json($inquiry);
    }
    public function index()
    {
        $inquiries = Support::orderByDesc('created_at')->get();
        return view('support', compact('inquiries'));
    }
    public function activateInquiry($id)
    {
        $inquiry = \App\Models\Support::findOrFail($id);
        if (!$inquiry->is_active) {
            $inquiry->is_active = true;
            $inquiry->save();
        }
        return response()->json(['success' => true]);
    }
}
