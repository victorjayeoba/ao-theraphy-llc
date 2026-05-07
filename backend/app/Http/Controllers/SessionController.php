<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SessionController extends Controller
{
    // Add a new session from web form    
    public function addSessionFromWeb(Request $request)
    {
        $validated = $request->validate([
            'type'         => 'required|string|max:100',
            'name'         => 'required|string|max:100',
            'duration'     => 'required|string|max:50',
            'price'        => 'nullable|numeric',
            'description'  => 'nullable|string|max:1000',
            'features'     => 'nullable|array',
            'features.*'   => 'nullable|string|max:255',
        ]);

        \App\Models\Session::create([
            'type'        => $validated['type'],
            'name'        => $validated['name'],
            'duration'    => $validated['duration'],
            'price'       => $validated['price'] ?? null,
            'description' => $validated['description'] ?? null,
            'features'    => $validated['features'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Session added successfully!');
    }
    public function editsession($id)
    {
        $session = \App\Models\Session::findOrFail($id);
        return view('sessions.edit', compact('session'));
    }

    public function updateSession(Request $request, $id)
    {
        $validated = $request->validate([
            'type'         => 'required|string|max:100',
            'name'         => 'required|string|max:100',
            'duration'     => 'required|string|max:50',
            'price'        => 'nullable|numeric',
            'description'  => 'nullable|string|max:1000',
            'features'     => 'nullable|array',
            'features.*'   => 'nullable|string|max:255',
        ]);

        $session = \App\Models\Session::findOrFail($id);
        $session->update([
            'type'        => $validated['type'],
            'name'        => $validated['name'],
            'duration'    => $validated['duration'],
            'price'       => $validated['price'] ?? null,
            'description' => $validated['description'] ?? null,
            'features'    => $validated['features'] ?? null,
        ]);

        return redirect()->route('sessions.index')->with('success', 'Session updated successfully!');
    }

    public function deletesession($id)
    {
        $session = \App\Models\Session::findOrFail($id);
        $session->delete();

        return redirect()->back()->with('success', 'Session deleted successfully!');
    }

    public function show($id)
    {
        $session = \App\Models\Session::findOrFail($id);
        return view('sessions.show', compact('session'));
    }

    public function showSessions()
    {
        $sessions = \App\Models\Session::all();
        return view('sessions', compact('sessions'));
    }

    public function showSessionsAPI()
    {
        $sessions = \App\Models\Session::orderByRaw("
                CASE 
                    WHEN name = 'Free Consultations' THEN 0
                    ELSE 1
                END
            ")
            ->get();

        return response()->json([
            'status' => true,
            'total' => $sessions->count(),
            'data' => $sessions
        ]);
    }
}
