<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Consultation;
use App\Mail\ConsultationThankYouMail;
use Illuminate\Support\Facades\Mail;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'phone_number'    => 'required|string|max:20',
            'preferred_date'  => 'required|date',
            'preferred_time'  => 'required|string|max:20',
            'session_type'    => 'required|in:Virtual,In-Person',
            'needs'           => 'nullable|string|max:2000',
        ]);

        $formattedTime = date("H:i:s", strtotime($validated['preferred_time']));

        $consultation = Consultation::create([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'phone_number'   => $validated['phone_number'],
            'preferred_date' => $validated['preferred_date'],
            'preferred_time' => $formattedTime,
            'session_type'   => $validated['session_type'],
            'needs'          => $validated['needs'] ?? null,
        ]);

        // Send thank you mail
        Mail::to($consultation->email)->send(new ConsultationThankYouMail($consultation));

        return response()->json([
            'status' => true,
            'message' => 'Consultation request submitted successfully'
        ], 200);
    }

    public function showConsultations()
    {
        $consultations = Consultation::orderByDesc('created_at')->get()->map(function($item) {
            $item->name = $item->first_name . ' ' . $item->last_name;
            return $item;
        });
        return response()->json([
            'status' => true,
            'total' => $consultations->count(),
            'data' => $consultations
        ]);
    }
    public function showConsultation($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->name = $consultation->first_name . ' ' . $consultation->last_name;
        return response()->json($consultation);
    }
    public function show($id)
    {
        $consultation = Consultation::findOrFail($id);
        return view('consultation_detail', compact('consultation'));
    }
    public function index()
    {
        $consultations = Consultation::orderByDesc('created_at')->get();
        $consultations->each(function($item) {
            $item->name = $item->first_name . ' ' . $item->last_name;
        });
        return view('consultations', compact('consultations'));
    }
    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->delete();

        return redirect()->route('consultations.index')->with('success', 'Consultation deleted successfully!');
    }   

}
