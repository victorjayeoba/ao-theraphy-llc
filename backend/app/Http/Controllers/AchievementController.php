<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AchievementController extends Controller
{
    //
    public function show()
    {
        return view('achievement');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'nullable|date',
            'picture'     => 'required|image|max:1024', // Only picture is required
        ]);

        $data = $request->only(['title', 'description', 'date']);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('achievements', 'public');
            $data['picture'] = asset('storage/' . $path);
        }

        \App\Models\Achievement::create($data);

        return redirect()->back()->with('success', 'Achievement added successfully!');
    }

    public function index()
    {
        $achievements = \App\Models\Achievement::orderByDesc('date')->get();
        return view('achievement', compact('achievements'));
    }

    public function edit($id)
    {
        $achievement = \App\Models\Achievement::findOrFail($id);
        return view('achievements.edit', compact('achievement'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'nullable|date',
            'picture'     => 'nullable|image|max:1024', // Only picture is required
        ]);

        $achievement = \App\Models\Achievement::findOrFail($id);
        $data = $request->only(['title', 'description', 'date']);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('achievements', 'public');
            $data['picture'] = asset('storage/' . $path);
        }

        $achievement->update($data);

        return redirect()->route('achievements.index')->with('success', 'Achievement updated successfully!');
    }

    public function destroy($id)
    {
        $achievement = \App\Models\Achievement::findOrFail($id);
        if ($achievement->picture) {
            \Storage::disk('public')->delete($achievement->picture);
        }
        $achievement->delete();

        return redirect()->route('achievements.index')->with('success', 'Achievement deleted successfully!');
    }

    public function apiIndex()
    {
        $achievements = \App\Models\Achievement::orderByDesc('date')->get();
        return response()->json($achievements);
    }
}