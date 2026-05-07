@extends('layout.sidebar')

@section('content')
@include('layout.header')

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
    .consultation-wrapper {
        padding: 30px;
        margin-top: 40px;
    }
    .consultation-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        padding: 25px 30px;
    }
    .consultation-header {
        color: #1e6fa7;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .consultation-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(30,111,167,0.07);
    }

    /* Visual wrapper to preserve rounded corners while allowing responsive table behavior */
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
    .consultation-table thead {
        background: linear-gradient(135deg, #1e6fa7, #2bb7a7);
        color: #fff;
    }
    .consultation-table th, .consultation-table td {
        padding: 14px 12px;
        font-size: 0.98rem;
        border-bottom: 1px solid #eef2f7;
        text-align: center;
        vertical-align: middle;
    }
    .consultation-table th {
        font-weight: 700;
    }
    .consultation-table tbody tr:hover {
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
        max-width: 480px;
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

    

    @media (max-width: 900px) {
        .consultation-wrapper {
            padding: 20px 15px;
            /* margin-top: 30px; */
        }
        
        .consultation-card{
            background: none;
            box-shadow: none;
            padding: 0px 0px !important;
        }

        .consultation-table{
            white-space: nowrap;
        }
    }
</style>

<div class="consultation-wrapper">
    <div class="consultation-card">
        <div class="consultation-header">
            <span>Consultation Requests</span>
        </div>
        <div class="table-card">
            <div class="table-responsive">
                <table class="consultation-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Session Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($consultations as $index => $item)
                            <tr>
                                <td data-label="#">{{ $index + 1 }}</td>
                                <td data-label="Name">{{ $item->first_name }} {{ $item->last_name }}</td>
                                <td data-label="Email">{{ $item->email }}</td>
                                <td data-label="Session Type">{{ $item->session_type }}</td>
                                <td data-label="Actions">
                                    <button class="action-btn" title="View" onclick="showConsultationModal({!! htmlspecialchars(json_encode($item), ENT_QUOTES, 'UTF-8') !!})">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <button class="action-btn" title="Delete" onclick="showDeleteModal({{ $item->id }})">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" style="text-align:center;">No consultation requests found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- View Modal -->
<div class="modal-overlay" id="consultationViewModal" style="display:none;">
    <div class="modal-content">
        <button class="modal-close" onclick="closeConsultationModal()">&times;</button>
        <div class="modal-header">
            <i class="fa-solid fa-user" style="color:#2176ae;"></i>
            <span style="margin-left:8px;">Consultation Details</span>
        </div>
        <table style="margin:0 auto 10px auto;">
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Name:</td>
                <td id="viewName" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Email:</td>
                <td id="viewEmail" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Phone:</td>
                <td id="viewPhone" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Preferred Date:</td>
                <td id="viewDate" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Preferred Time:</td>
                <td id="viewTime" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Session Type:</td>
                <td id="viewSessionType" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
            <tr>
                <td style="font-weight:700;color:#2176ae;padding:8px 10px 8px 0;">Needs:</td>
                <td id="viewNeeds" style="color:#2176ae;padding:8px 0;"></td>
            </tr>
        </table>
    </div>
</div>

<!-- Edit Modal -->
<div class="modal-overlay" id="consultationEditModal" style="display:none;">
    <div class="modal-content">
        <button class="modal-close" onclick="closeEditModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-pen-to-square"></i>
            <span style="margin-left:8px;">Edit Consultation</span>
        </div>
        <form id="editConsultationForm" class="modal-form" method="POST">
            @csrf
            @method('PUT')
            <label>Name:</label>
            <div style="display:flex;gap:8px;">
                <input type="text" name="first_name" id="editFirstName" placeholder="First Name" required>
                <input type="text" name="last_name" id="editLastName" placeholder="Last Name" required>
            </div>
            <label>Email:</label>
            <input type="text" name="email" id="editEmail" required>
            <label>Phone:</label>
            <input type="text" name="phone_number" id="editPhone" required>
            <label>Preferred Date:</label>
            <input type="text" name="preferred_date" id="editDate" required>
            <label>Preferred Time:</label>
            <input type="text" name="preferred_time" id="editTime" required>
            <label>Session Type:</label>
            <input type="text" name="session_type" id="editSessionType" required>
            <label>Needs:</label>
            <textarea name="needs" id="editNeeds"></textarea>
            <button type="submit" style="margin-top:10px;">Update Consultation</button>
        </form>
    </div>
</div>

<!-- Delete Modal -->
<div class="modal-overlay" id="consultationDeleteModal" style="display:none;">
    <div class="delete-modal-content" style="box-shadow:0 8px 32px rgba(30,111,167,0.18);padding:38px 36px 28px 36px;max-width:370px;">
        <button class="modal-close" onclick="closeDeleteModal()" style="top:16px;right:18px;">&times;</button>
        <div class="modal-header" style="justify-content:center;margin-bottom:12px;gap:10px;">
            <i class="fa fa-trash" style="color:#e74c3c;font-size:2rem;"></i>
            <span style="margin-left:4px;font-size:1.35rem;color:#2176ae;">Delete Consultation</span>
        </div>
        <div style="color:#444;font-size:1.08rem;margin-bottom:18px;text-align:center;">
            Are you sure you want to delete this consultation?
        </div>
        <div class="modal-actions" style="margin-top:18px;display:flex;justify-content:center;gap:18px;">
            <form id="deleteConsultationForm" method="POST" style="display:inline;">
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
function showConsultationModal(item) {
    document.getElementById('viewName').textContent = item.first_name + ' ' + item.last_name;
    document.getElementById('viewEmail').textContent = item.email;
    document.getElementById('viewPhone').textContent = item.phone_number;
    document.getElementById('viewDate').textContent = item.preferred_date;
    document.getElementById('viewTime').textContent = item.preferred_time;
    document.getElementById('viewSessionType').textContent = item.session_type;
    document.getElementById('viewNeeds').textContent = item.needs || '-';
    document.getElementById('consultationViewModal').style.display = 'flex';
}
function closeConsultationModal() {
    document.getElementById('consultationViewModal').style.display = 'none';
}
function showDeleteModal(id) {
    var url = "{{ route('consultations.destroy', ':id') }}";
    url = url.replace(':id', id);
    document.getElementById('deleteConsultationForm').action = url;
    document.getElementById('consultationDeleteModal').style.display = 'flex';
}
function closeDeleteModal() {
    document.getElementById('consultationDeleteModal').style.display = 'none';
}
</script>
@endsection