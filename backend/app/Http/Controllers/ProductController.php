<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Category; // Make sure you have this model
// Store a new product
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Show all products
    public function index()
    {
        $products = Products::all();
        $categories = \App\Models\Category::all();
        return view('product', compact('products', 'categories'));
    }

    // Show form to create a product
    public function create()
    {
        $categories = Category::all();
        return view('products.create', compact('categories'));
    }


    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'nullable|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'rating'      => 'nullable|numeric|between:0,5',
            'review_count'=> 'nullable|integer|min:0',
            'picture'     => 'required|image|max:1024', // 1MB Max
        ]);
        // dd('Validation passed!');

        $data = $request->only(['name', 'category', 'description', 'price', 'rating', 'review_count']);

        // ✅ Store image with full URL
        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('products', 'public');
            $data['picture'] = asset('storage/' . $path);
        }

        Products::create($data);

        return redirect()->route('products.index')->with('success', 'Product added successfully!');
    }


    // Show form to edit a product
    public function edit($id)
    {
        $product = Products::findOrFail($id);
        $categories = Category::all();
        return view('products.edit', compact('product', 'categories'));
    }

    // Update a product
    public function update(Request $request, $id)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'nullable|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'rating'      => 'nullable|numeric|between:0,5',
            'review_count'=> 'nullable|integer|min:0',
            'picture'     => 'nullable|image|max:1024',
        ]);

        $product = Products::findOrFail($id);
        $data = $request->only(['name', 'category', 'description', 'price', 'rating', 'review_count']);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('products', 'public');
            $data['picture'] = asset('storage/' . $path);
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Products::findOrFail($id);
        if ($product->picture) {
            \Storage::disk('public')->delete($product->picture);
        }
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }

    // Get a single product (API or detail view)
    public function show($id)
    {
        $product = Products::findOrFail($id);
        return view('products.show', compact('product'));
    }


    public function showAllProducts()
    {
        $products = Products::all();
        return response()->json([
            'status' => true,
            'total' => $products->count(),
            'data' => $products
        ]);
    }

    public function showProduct($slug)
    {
        $product = Products::where('slug', $slug)->firstOrFail();
        return response()->json($product);
    }
}
