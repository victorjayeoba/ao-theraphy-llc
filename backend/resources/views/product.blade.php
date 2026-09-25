@extends('layout.sidebar')

@section('content')
@include('layout.header')

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
    .product-wrapper {
        padding: 30px;
        margin-top: 40px;
        max-height: 80vh;
        overflow-y: auto;
    }
    .product-card {
        /* background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05); */
        /* padding: 25px 30px; */
        margin-bottom: 32px;
    }
    .product-header {
        color: #1e6fa7;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .new-product-btn {
        background: linear-gradient(135deg, #2bb7a7, #1e6fa7);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 28px;
        font-size: 1.08rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(30,111,167,0.08);
        transition: background 0.2s;
    }
    .new-product-btn:hover {
        background: #1e6fa7;
    }
    /* Table container keeps rounded corners and shadow; table itself can scroll */
    .table-card {
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(30,111,167,0.07);
        width: 100%;
    }
    .table-responsive {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .product-table {
        width: 100%;
        border-collapse: separate;
        text-align: left;
        border-spacing: 0;
        background: transparent;
        min-width: 900px; /* ensures horizontal scrollbar on small screens */
    }
        .product-table thead {
        background: linear-gradient(135deg, #1e6fa7, #2bb7a7);
        color: #fff;
    }
    .product-table th, .product-table td {
        padding: 14px 12px;
        font-size: 0.98rem;
        border-bottom: 1px solid #eef2f7;
        text-align: center;
        vertical-align: middle;
    }
    .product-table th {
        font-weight: 700;
    }
    .product-table tbody tr:hover {
        background: #f0f8ff;
        transition: 0.3s;
    }
    .product-img-thumb {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #e0e7ef;
        background: #f7fafc;
        display: block;
        margin: 0 auto;
    }
    .product-action-btn {
        background: none;
        border: none;
        color: #2176ae;
        font-size: 1.25rem;
        cursor: pointer;
        margin: 0 4px;
        transition: color 0.2s;
        padding: 6px;
        border-radius: 6px;
    }
    .product-action-btn:hover {
        background: #eaf7fa;
        color: #1e6fa7;
    }
    .product-actions-cell {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: center;
    }
    /* Modal Styles */
    .modal-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(30,111,167,0.13);
        z-index: 9999;
        align-items: center;
        justify-content: center;
    }
    .modal-content {
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(30,111,167,0.18);
        padding: 36px 38px 28px 38px;
        max-width: 400px;
        width: 100%;
        position: relative;
        animation: modalFadeIn 0.3s;
        max-height: 90vh;
        overflow-y: auto;
    }
    @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    .modal-close {
        position: absolute;
        top: 18px;
        right: 22px;
        background: none;
        border: none;
        font-size: 1.7rem;
        color: #2bb7a7;
        cursor: pointer;
        transition: color 0.2s;
    }
    .modal-close:hover {
        color: #1e6fa7;
    }
    .modal-header {
        color: #2176ae;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 18px;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center !important;
        text-align: center !important;
    }
    .modal-form label {
        font-weight: 600;
        color: #2176ae;
        display: block;
        margin-bottom: 6px;
    }
    .modal-form input[type="text"],
    .modal-form input[type="number"],
    .modal-form textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #e0e7ef;
        border-radius: 8px;
        font-size: 1rem;
        background: #f7fafc;
        margin-bottom: 16px;
        box-sizing: border-box;
    }
    .modal-form input[type="file"] {
        margin-bottom: 16px;
    }
    .modal-form button {
        background: linear-gradient(135deg, #2bb7a7, #1e6fa7);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 28px;
        font-size: 1.08rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(30,111,167,0.08);
        transition: background 0.2s;
        width: 100%;
    }
    .modal-form button:hover {
        background: #1e6fa7;
    }
    /* View Details Modal */
    .view-modal-content {
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(30,111,167,0.18);
        padding: 36px 38px 28px 38px;
        max-width: 480px;
        width: 100%;
        position: relative;
        animation: modalFadeIn 0.3s;
    }
    .view-modal-header {
        color: #2176ae;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 18px;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .view-modal-row {
        margin-bottom: 13px;
        display: flex;
        align-items: flex-start;
    }
    .view-modal-label {
        font-weight: 600;
        color: #1e6fa7;
        min-width: 110px;
        display: inline-block;
    }
    .view-modal-value {
        color: #2176ae;
        font-weight: 400;
        margin-left: 8px;
        word-break: break-word;
    }
    .view-modal-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #e0e7ef;
        background: #f7fafc;
        margin-bottom: 18px;
    }
    select[name="category"] {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #e0e7ef;
        border-radius: 8px;
        font-size: 1rem;
        background: #f7fafc;
        margin-bottom: 16px;
        color: #2176ae;
    }

    @media (max-width: 900px) {
       .product-wrapper {
        padding: 15px;
    }

    .new-product-btn {
    border-radius: 7px;
    padding: 10px 15px;
    font-size: 14px;
}
    }
</style>

<div class="product-wrapper">
    <div class="product-card">
        <div class="product-header">
            <span>Product Management</span>
            <button class="new-product-btn" onclick="openProductModal()">+ New Product</button>
        </div>
        {{-- Product List --}}
        <div class="table-card">
            <div class="table-responsive">
                <table class="product-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Category</th>
                    {{-- <th>Description</th> --}}
                    <th>Price</th>
                    <th>Rating</th>
                    <th style="min-width:140px;">Actions</th>
                </tr>
            </thead>
            <tbody>
            @foreach($products as $i => $product)
                <tr>
                    <td>{{ $i+1 }}</td>
                    <td>
                        @if($product->picture)
                            <img src="{{ $product->picture }}" class="product-img-thumb">
                        @else
                            <span style="color:#bbb;">No Image</span>
                        @endif
                    </td>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->category ?? '' }}</td>
                    {{-- <td>{{ $product->description }}</td> --}}
                    <td>${{ number_format($product->price, 2) }}</td>
                    <td>
                        @if(!is_null($product->rating))
                            <i class="fa-solid fa-star" style="color:#f5b301;"></i> {{ number_format($product->rating, 1) }}
                            <span style="color:#888;">({{ $product->review_count ?? 0 }})</span>
                        @else
                            <span style="color:#bbb;">&mdash;</span>
                        @endif
                    </td>
                    <td class="product-actions-cell">
                        <button class="product-action-btn" title="Edit"
                            onclick="showEditModal(
                                '{{ $product->id }}',
                                '{{ addslashes($product->name) }}',
                                '{{ addslashes($product->category) }}',
                                `{{ e($product->description) }}`,
                                '{{ $product->price }}',
                                '{{ $product->picture ? $product->picture : '' }}',
                                '{{ $product->rating }}',
                                '{{ $product->review_count }}'
                            )">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="product-action-btn" title="Delete"
                            onclick="showDeleteProductModal('{{ $product->id }}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="product-action-btn" title="View Details"
                            onclick="showViewModal(
                                '{{ addslashes($product->name) }}',
                                '{{ addslashes($product->category) }}',
                                `{{ e($product->description) }}`,
                                '{{ $product->price }}',
                                '{{ $product->picture ? $product->picture : '' }}',
                                '{{ $product->rating }}',
                                '{{ $product->review_count }}'
                            )">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </td>
                </tr>
            @endforeach
            @if(count($products) == 0)
                <tr>
                    <td colspan="7" style="text-align:center;">No products found.</td>
                </tr>
            @endif
            </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Modal for Add Product -->
<div class="modal-overlay" id="productModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeProductModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-plus-circle"></i> Add New Product
        </div>
        <form class="modal-form" action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <label>Name:</label>
            <input type="text" name="name" required>
            <label>Category:</label>
            <select name="category" required>
                <option value="" selected>Select Category</option>
                @foreach($categories as $category)
                    <option value="{{ $category->name }}">{{ $category->name }}</option>
                @endforeach
            </select>
            <label>Description:</label>
            <textarea name="description" required></textarea>
            <label>Price:</label>
            <input type="number" name="price" step="0.01" min="0" required
                   oninput="validatePrice(this)" id="addPriceInput"
                   onkeydown="return allowOnlyPositiveNumber(event, this)">
            <div id="addPriceError" style="color:#e74c3c;font-size:0.97rem;margin-top:-10px;margin-bottom:10px;display:none;"></div>
            <label>Rating (0&ndash;5, optional):</label>
            <input type="number" name="rating" step="0.1" min="0" max="5" placeholder="e.g. 4.6">
            <label>Review count (optional):</label>
            <input type="number" name="review_count" step="1" min="0" placeholder="e.g. 128">
            <label>Picture:</label>
            <input type="file" name="picture" accept="image/*" id="addPictureInput" onchange="validateImageSize(this, 'addPictureError')">
            <div id="addPictureError" style="color:#e74c3c;font-size:0.97rem;margin-top:-10px;margin-bottom:10px;display:none;"></div>
            <button type="submit">Add Product</button>
        </form>
    </div>
</div>

<!-- Modal for Edit Product -->
<div class="modal-overlay" id="editModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeEditModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-pen-to-square"></i> Edit Product
        </div>
        <form class="modal-form" id="editProductForm" method="POST" enctype="multipart/form-data" action="">
            @csrf
            @method('PATCH')
            <label>Name:</label>
            <input type="text" name="name" id="editName" required>
            <label>Category:</label>
            <select name="category" id="editCategory" required>
                <option value="">Select Category</option>
                @foreach($categories as $category)
                    <option value="{{ $category->name }}"
                        @if(isset($product) && $product->category == $category->name) selected @endif>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
            <label>Description:</label>
            <textarea name="description" id="editDescription" required></textarea>
            <label>Price:</label>
            <input type="number" name="price" id="editPrice" step="0.01" min="0" required
                   oninput="validatePrice(this, 'editPriceError')"
                   onkeydown="return allowOnlyPositiveNumber(event, this)">
            <div id="editPriceError" style="color:#e74c3c;font-size:0.97rem;margin-top:-10px;margin-bottom:10px;display:none;"></div>
            <label>Rating (0&ndash;5, optional):</label>
            <input type="number" name="rating" id="editRating" step="0.1" min="0" max="5" placeholder="e.g. 4.6">
            <label>Review count (optional):</label>
            <input type="number" name="review_count" id="editReviewCount" step="1" min="0" placeholder="e.g. 128">
            <label>Picture:</label>
            <input type="file" name="picture" id="editPicture" accept="image/*" onchange="validateImageSize(this, 'editPictureError')">
            <div id="editPictureError" style="color:#e74c3c;font-size:0.97rem;margin-top:-10px;margin-bottom:10px;display:none;"></div>
            <div id="editImgWrap" style="text-align:center;">
                <img id="editImg" class="view-modal-img" src="" alt="Product Image" style="display:none;">
            </div>
            <button type="submit">Update Product</button>
        </form>
    </div>
</div>

<!-- Modal for View Details -->
<div class="modal-overlay" id="viewModal">
    <div class="view-modal-content" style="max-width:480px;">
        <button class="modal-close" onclick="closeViewModal()">&times;</button>
        <div class="view-modal-header" style="font-size:1.5rem;">
            <i class="fa-solid fa-box" style="color:#2176ae;"></i>
            <span style="margin-left:8px;">Product Details</span>
        </div>
        <div id="viewModalImgWrap" style="text-align:center;">
            <img id="viewModalImg" class="view-modal-img" src="" alt="Product Image" style="display:none;box-shadow:0 2px 12px rgba(30,111,167,0.10);margin-bottom:18px;">
        </div>
        <table style="margin:0 auto 10px auto;">
            <tr>
                <td class="view-modal-label" style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Name:</td>
                <td class="view-modal-value" id="viewModalName" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td class="view-modal-label" style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Category:</td>
                <td class="view-modal-value" id="viewModalCategory" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td class="view-modal-label" style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Description:</td>
                <td class="view-modal-value" id="viewModalDescription" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td class="view-modal-label" style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Price:</td>
                <td class="view-modal-value" id="viewModalPrice" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td class="view-modal-label" style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Rating:</td>
                <td class="view-modal-value" id="viewModalRating" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
        </table>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-overlay" id="deleteProductModal" style="display:none;">
    <div class="modal-content" style="max-width:350px;text-align:center;">
        <button class="modal-close" onclick="closeDeleteProductModal()" style="top:16px;right:18px;">&times;</button>
        <div class="modal-header" style="justify-content:center;margin-bottom:12px;gap:10px;">
            <i class="fa fa-trash" style="color:#e74c3c;font-size:2rem;"></i>
            <span style="margin-left:4px;font-size:1.25rem;color:#2176ae;">Delete Product</span>
        </div>
        <div style="color:#444;font-size:1.08rem;margin-bottom:18px;">
            Are you sure you want to delete this product?
        </div>
        <div style="display:flex;justify-content:center;gap:18px;">
            <form id="deleteProductForm" method="POST" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit" style="
                    background:#e74c3c;
                    color:#fff;
                    border:none;
                    border-radius:8px;
                    padding:10px 32px;
                    font-size:1.08rem;
                    font-weight:600;
                    box-shadow:0 2px 8px rgba(231,76,60,0.08);
                    transition:background 0.2s;
                    cursor:pointer;
                ">Delete</button>
            </form>
            <button onclick="closeDeleteProductModal()" style="
                background:#f7fafc;
                color:#2176ae;
                border:1.5px solid #e0e7ef;
                border-radius:8px;
                padding:10px 32px;
                font-size:1.08rem;
                font-weight:600;
                box-shadow:0 2px 8px rgba(30,111,167,0.08);
                transition:background 0.2s;
                cursor:pointer;
            ">Cancel</button>
        </div>
    </div>
</div>

<script>
function openProductModal() {
    document.getElementById('productModal').style.display = 'flex';
}
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}
function showViewModal(name, category, description, price, img, rating, reviewCount) {
    document.getElementById('viewModalRating').textContent = rating
        ? parseFloat(rating).toFixed(1) + ' / 5 (' + (reviewCount || 0) + ' reviews)'
        : 'Not set';
    document.getElementById('viewModalName').textContent = name;
    document.getElementById('viewModalCategory').textContent = category;
    document.getElementById('viewModalDescription').textContent = description;
    document.getElementById('viewModalPrice').textContent = price ? '$' + parseFloat(price).toFixed(2) : '';
    var imgTag = document.getElementById('viewModalImg');
    if(img) {
        imgTag.src = img;
        imgTag.style.display = 'inline-block';
    } else {
        imgTag.style.display = 'none';
    }
    document.getElementById('viewModal').style.display = 'flex';
}
function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}
function showEditModal(id, name, category, description, price, img, rating, reviewCount) {
    document.getElementById('editRating').value = rating;
    document.getElementById('editReviewCount').value = reviewCount;
    document.getElementById('editName').value = name;
    document.getElementById('editCategory').value = category;
    document.getElementById('editDescription').value = description;
    document.getElementById('editPrice').value = price;
    var imgTag = document.getElementById('editImg');
    if(img) {
        imgTag.src = img;
        imgTag.style.display = 'inline-block';
    } else {
        imgTag.style.display = 'none';
    }
    // Set form action dynamically
    var form = document.getElementById('editProductForm');
    form.action = "{{ route('products.update', ':id') }}".replace(':id', id);
    document.getElementById('editModal').style.display = 'flex';

}
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}
function showDeleteProductModal(id) {
    var url = "{{ route('products.destroy', ':id') }}";
    url = url.replace(':id', id);
    document.getElementById('deleteProductForm').action = url;
    document.getElementById('deleteProductModal').style.display = 'flex';
}
function closeDeleteProductModal() {
    document.getElementById('deleteProductModal').style.display = 'none';
}
function validatePrice(input, errorId = 'addPriceError') {
    const errorDiv = document.getElementById(errorId);
    if (input.value && (parseFloat(input.value) < 0 || !/^\d*\.?\d*$/.test(input.value))) {
        errorDiv.textContent = "No negative or invalid value allowed";
        errorDiv.style.display = "block";
        input.setCustomValidity("No negative or invalid value allowed");
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
        input.setCustomValidity("");
    }
}

// Prevent negative sign and non-numeric input except dot and numbers
function allowOnlyPositiveNumber(e, input) {
    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
        // Allow: Ctrl/cmd+A
        (e.keyCode == 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl/cmd+C
        (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl/cmd+V
        (e.keyCode == 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl/cmd+X
        (e.keyCode == 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return true;
    }
    // Prevent minus sign, letters, and other non-numeric except dot
    if (
        e.key === '-' ||
        (e.key.length === 1 && !/[0-9.]/.test(e.key))
    ) {
        e.preventDefault();
        validatePrice(input, input.id === 'editPrice' ? 'editPriceError' : 'addPriceError');
        return false;
    }
    return true;
}
function validateImageSize(input, errorId) {
    const errorDiv = document.getElementById(errorId);
    if (input.files && input.files[0]) {
        if (input.files[0].size > 1024 * 1024) { // 1MB
            errorDiv.textContent = "Image size should be below 1MB";
            errorDiv.style.display = "block";
            input.value = ""; // Clear the input
        } else {
            errorDiv.textContent = "";
            errorDiv.style.display = "none";
        }
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }
}
</script>
@endsection