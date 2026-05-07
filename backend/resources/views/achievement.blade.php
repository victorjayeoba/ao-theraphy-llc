@extends('layout.sidebar')

@section('content')

@include('layout.header')

<meta name="csrf-token" content="{{ csrf_token() }}">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
    .achievement-wrapper {
        padding: 30px;
        margin-top: 40px;
    }
    .achievement-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        padding: 25px 30px;
    }
    .achievement-header {
        color: #1e6fa7;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .new-achievement-btn {
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
    .new-achievement-btn:hover {
        background: #1e6fa7;
    }
    .achievement-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(30,111,167,0.07);
        margin-top: 20px;
    }
    .achievement-table thead {
        background: linear-gradient(135deg, #1e6fa7, #2bb7a7);
        color: #fff;
    }
    .achievement-table th, .achievement-table td {
        padding: 14px 12px;
        font-size: 0.98rem;
        border-bottom: 1px solid #eef2f7;
        text-align: center;
        vertical-align: middle;
    }
    .achievement-table th {
        font-weight: 700;
    }
    .achievement-table tbody tr:hover {
        background: #f0f8ff;
        transition: 0.3s;
    }
    .action-btn {
        background: none;
        border: none;
        color: #2176ae;
        font-size: 1.2rem;
        cursor: pointer;
        margin: 0 4px;
        transition: color 0.2s;
        padding: 6px;
        border-radius: 6px;
    }
    .action-btn:hover {
        background: #eaf7fa;
        color: #1e6fa7;
    }
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
        max-width: 420px;
        width: 100%;
        position: relative;
        animation: modalFadeIn 0.3s;
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
    .modal-form textarea {
        min-height: 60px;
        resize: vertical;
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
    .delete-modal-content {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(30,111,167,0.18);
        padding: 32px 30px 24px 30px;
        max-width: 350px;
        width: 100%;
        position: relative;
        text-align: center;
    }
    .delete-modal-content .modal-header {
        justify-content: center;
        margin-bottom: 10px;
    }
    .delete-modal-content .modal-actions {
        margin-top: 18px;
        display: flex;
        justify-content: center;
        gap: 18px;
    }
    .delete-modal-content button {
        width: auto;
        min-width: 90px;
    }
    .input-date-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
    }
    .styled-date-input {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #e0e7ef;
        border-radius: 8px;
        font-size: 1rem;
        background: #f7fafc;
        color: #2176ae;
        box-sizing: border-box;
        transition: border-color 0.2s;
    }
    .styled-date-input:focus {
        border-color: #1e6fa7;
        outline: none;
    }

    /* Mobile scrollable wrapper for wide tables */
    .mobile-scrollable {
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        width: 100%;
    }

    @media (max-width: 900px) {
        /* Force table to be horizontally scrollable on small screens */
        .mobile-scrollable table.achievement-table {
            min-width: 640px;
        }

        .achievement-wrapper {
    padding: 15px;
    margin-top: 20px;
    white-space: nowrap;
}

.achievement-card {
    background: none;
    box-shadow: none;
    padding: 0px 0px !important;
}

.new-achievement-btn{
    border-radius: 7px;
    padding: 10px 15px;
    font-size: 14px;
}
    }
</style>

<div class="achievement-wrapper">
    <div class="achievement-card">
        <div class="achievement-header">
            <span>Achievements</span>
            <button class="new-achievement-btn" onclick="openAchievementModal()">
                <i class="fa fa-plus-circle"></i> Add Achievement
            </button>
        </div>
        <div class="mobile-scrollable">
            <table class="achievement-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr> 
            </thead>
            <tbody>
                @forelse($achievements as $index => $achievement)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>
                            @if($achievement->picture)
                                <img src="{{ $achievement->picture }}" alt="Achievement Image" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
                            @else
                                <span style="color:#bbb;">No Image</span>
                            @endif
                        </td>
                        <td>{{ $achievement->title }}</td>
                        <td>{{ $achievement->date }}</td>
                        <td>
                            <button class="action-btn" title="View" onclick="showViewModal({!! htmlspecialchars(json_encode($achievement), ENT_QUOTES, 'UTF-8') !!})">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="action-btn" title="Edit" onclick="showEditModal({!! htmlspecialchars(json_encode($achievement), ENT_QUOTES, 'UTF-8') !!})">
                                <i class="fa fa-pen-to-square"></i>
                            </button>
                            <button class="action-btn" title="Delete" onclick="showDeleteModal({{ $achievement->id }})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align:center;">No achievements found.</td>
                    </tr>
                @endforelse
            </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Achievement Modal -->
<div class="modal-overlay" id="achievementModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeAchievementModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-plus-circle"></i> Add Achievement
        </div>
        <form class="modal-form" action="{{ route('achievements.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <label>Title:</label>
            <input type="text" name="title">
            <label>Date:</label>
            <div class="input-date-wrap">
                <input type="date" name="date" class="styled-date-input">
            </div>
            <label>Description:</label>
            <textarea name="description"></textarea>
            <label>Picture:</label>
            <input type="file" name="picture" accept="image/*" id="addPictureInput" onchange="validateImageSize(this, 'addPictureError')" style="margin-bottom:8px;">
            <div id="addPictureError" style="color:#e74c3c;font-size:0.97rem;margin-bottom:10px;display:none;"></div>
            <button type="submit" style="margin-top:10px;">Add Achievement</button>
        </form>
    </div>
</div>

<!-- View Achievement Modal -->
<div class="modal-overlay" id="achievementViewModal" style="display:none;">
    <div class="modal-content">
        <button class="modal-close" onclick="closeViewModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-trophy" style="color:#f1c40f;"></i>
            <span style="margin-left:8px;">Achievement Details</span>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
            <img id="viewImage" src="" alt="Achievement Image" style="max-width:90px;max-height:90px;border-radius:10px;display:none;">
        </div>
        <table style="margin:0 auto 10px auto;">
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Title:</td>
                <td id="viewTitle" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Date:</td>
                <td id="viewDate" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Description:</td>
                <td id="viewDescription" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
        </table>
    </div>
</div>
 
<!-- Edit Achievement Modal -->
<div class="modal-overlay" id="achievementEditModal" style="display:none;">
    <div class="modal-content">
        <button class="modal-close" onclick="closeEditModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-pen-to-square"></i>
            <span style="margin-left:8px;">Edit Achievement</span>
        </div>
        <form id="editAchievementForm" class="modal-form" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <label>Title:</label>
            <input type="text" name="title" id="editTitle">
            <label>Date:</label>
            <div class="input-date-wrap">
                <input type="date" name="date" id="editDate" class="styled-date-input">
            </div>
            <label>Description:</label>
            <textarea name="description" id="editDescription"></textarea>
            <label>Picture:</label>
            <input type="file" name="picture" id="editPicture" accept="image/*" onchange="validateImageSize(this, 'editPictureError')">
            <div id="editPictureError" style="color:#e74c3c;font-size:0.97rem;margin-bottom:10px;display:none;"></div>
            <div id="editImagePreviewWrap" style="text-align:center;margin-bottom:10px;">
                <img id="editImagePreview" src="" alt="Current Image" style="max-width:90px;max-height:90px;border-radius:10px;display:none;">
            </div>
            <button type="submit" style="margin-top:10px;">Update Achievement</button>
        </form>
    </div>
</div>

<!-- Delete Modal -->
<div class="modal-overlay" id="achievementDeleteModal" style="display:none;">
    <div class="delete-modal-content" style="box-shadow:0 8px 32px rgba(30,111,167,0.18);padding:38px 36px 28px 36px;max-width:370px;">
        <button class="modal-close" onclick="closeDeleteModal()" style="top:16px;right:18px;">&times;</button>
        <div class="modal-header" style="justify-content:center;margin-bottom:12px;gap:10px;">
            <i class="fa fa-trash" style="color:#e74c3c;font-size:2rem;"></i>
            <span style="margin-left:4px;font-size:1.35rem;color:#2176ae;">Delete Achievement</span>
        </div>
        <div style="color:#444;font-size:1.08rem;margin-bottom:18px;text-align:center;">
            Are you sure you want to delete this achievement?
        </div>
        <div class="modal-actions" style="margin-top:18px;display:flex;justify-content:center;gap:18px;">
            <form id="deleteAchievementForm" method="POST" style="display:inline;">
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
            <button onclick="closeDeleteModal()" style="
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
function openAchievementModal() {
    document.getElementById('achievementModal').style.display = 'flex';
}
function closeAchievementModal() {
    document.getElementById('achievementModal').style.display = 'none';
}
function showViewModal(item) {
    document.getElementById('viewTitle').textContent = item.title;
    document.getElementById('viewDate').textContent = item.date;
    document.getElementById('viewDescription').textContent = item.description;
    var img = document.getElementById('viewImage');
    if(item.picture) {
        img.src = item.picture;
        img.style.display = 'inline-block';
    } else {
        img.style.display = 'none';
    }
    document.getElementById('achievementViewModal').style.display = 'flex';
}
function closeViewModal() {
    document.getElementById('achievementViewModal').style.display = 'none';
}
function showEditModal(item) {
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editDate').value = item.date;
    document.getElementById('editDescription').value = item.description;
    document.getElementById('editAchievementForm').action = "{{ route('achievements.update', ':id') }}".replace(':id', item.id);

    // Show current image if exists
    var img = document.getElementById('editImagePreview');
    if(item.picture) {
        img.src = item.picture;
        img.style.display = 'inline-block';
    } else {
        img.style.display = 'none';
    }
    document.getElementById('achievementEditModal').style.display = 'flex';
}
function closeEditModal() {
    document.getElementById('achievementEditModal').style.display = 'none';
}
function showDeleteModal(id) {
    var url = "{{ route('achievements.destroy', ':id') }}";
    url = url.replace(':id', id);
    document.getElementById('deleteAchievementForm').action = url;
    document.getElementById('achievementDeleteModal').style.display = 'flex';
}
function closeDeleteModal() {
    document.getElementById('achievementDeleteModal').style.display = 'none';
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