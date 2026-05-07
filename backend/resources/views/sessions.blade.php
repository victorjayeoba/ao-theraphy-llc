<!-- filepath: resources/views/sessions.blade.php -->
@extends('layout.sidebar')

@section('content')
@include('layout.header')

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
    .session-wrapper {
        padding: 30px;
        margin-top: 40px;
    }
    .session-header {
        color: #1e6fa7;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.25rem;
    }
    .new-session-btn {
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
    .new-session-btn:hover {
        background: #1e6fa7;
    }
    .session-table-container {
        max-height: 420px;
        overflow: auto;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(30,111,167,0.07);
        margin-top: 20px;
        background: #fff;
    }
    .session-table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
        margin: 0;
    }
    .session-table thead {
        background: linear-gradient(135deg, #1e6fa7, #2bb7a7);
        color: #fff;
    }
    /* Keep table header visible while scrolling */
    .session-table thead th {
        position: sticky;
        top: 0;
        z-index: 2;
    }
    .session-table th, .session-table td {
        padding: 14px 12px;
        font-size: 0.98rem;
        border-bottom: 1px solid #eef2f7;
        text-align: center;
        vertical-align: middle;
    }
    .session-table th {
        font-weight: 700;
    }
    .session-table tbody tr:hover {
        background: #f0f8ff;
        transition: 0.3s;
    }
    /* Modal Styles */
    .modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(30,111,167,0.13);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        overflow: auto; /* allow page/overlay scrolling when modal taller than viewport */
        padding: 24px;
        height: auto !important; /* give space when overlay scrolls */
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
        max-height: calc(100vh - 120px); /* keep modal within viewport */
        overflow-y: auto; /* enable internal scrolling for long modal content */
        -webkit-overflow-scrolling: touch;
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
    .features-list {
        margin-bottom: 10px;
    }
    .features-list input[type="text"] {
        width: 85%;
        display: inline-block;
        margin-right: 6px;
    }
    .features-list .remove-feature-btn {
        background: none;
        border: none;
        color: #d9534f;
        font-size: 1.1rem;
        cursor: pointer;
        vertical-align: middle;
    }
    .add-feature-btn {
        background: #2bb7a7;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 4px 14px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 12px;
        margin-top: 2px;
    }
    .add-feature-btn:hover {
        background: #1e6fa7;
    }
    .feature-row {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        gap: 8px;
    }
    .feature-row input[type="text"] {
        flex: 1 1 0%;
        min-width: 0;
        margin: 0;
    }
    .feature-row .remove-feature-btn {
        width: 32px;
        height: 32px;
        min-width: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: #d9534f;
        font-size: 1.1rem;
        cursor: pointer;
        vertical-align: middle;
        margin: 0;
    }
    .action-btn {
        background: none;
        border: none;
        color: #2176ae;
        font-size: 1.2rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    .action-btn:hover {
        color: #1e6fa7;
    }

    @media (max-width: 900px) {
        /* Force table to be horizontally scrollable on small screens */
     
        .session-wrapper {
    padding: 15px;
    margin-top: 20px;
    white-space: nowrap;
}

/* .achievement-card {
    background: none;
    box-shadow: none;
    padding: 0px 0px !important;
} */

.new-session-btn{
    border-radius: 7px;
    padding: 10px 15px;
    font-size: 14px;
}

.session-header{
    font-size: 16px;
}
    }
</style>

<div class="session-wrapper">
    <div class="session-header">
        <span>Consultation Sessions</span>
        <button class="new-session-btn" onclick="openSessionModal()">
            <i class="fa fa-plus-circle"></i> Add Session
        </button>
    </div>

    <div class="session-table-container">
        <table class="session-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Session Type</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($sessions as $index => $session)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $session->type }}</td>
                    <td>{{ $session->name }}</td>
                    <td>{{ $session->duration }}</td>
                    <td>${{ number_format($session->price, 2) }}</td>
                    {{-- <td>{{ $session->description }}</td>
                    <td>
                        @if($session->features)
                            <ul style="text-align:left; margin:0; padding-left:18px;">
                                @foreach($session->features as $feature)
                                    <li>{{ $feature }}</li>
                                @endforeach
                            </ul>
                        @endif
                    </td> --}}
                    <td>
                        <button class="action-btn" title="View" onclick="showViewSessionModal({!! htmlspecialchars(json_encode($session), ENT_QUOTES, 'UTF-8') !!})">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button class="action-btn" title="Edit" onclick="showEditSessionModal({!! htmlspecialchars(json_encode($session), ENT_QUOTES, 'UTF-8') !!})">
                            <i class="fa fa-pen-to-square"></i>
                        </button>
                        <button class="action-btn" title="Delete" onclick="showDeleteSessionModal({{ $session->id }})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align:center;">No sessions found.</td>
                </tr>
            @endforelse
        </tbody>
        </table>
    </div>
</div>

<!-- Modal for Add Session -->
<div class="modal-overlay" id="sessionModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeSessionModal()">&times;</button>
        <div class="modal-header" style="display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;">
            <i class="fa fa-plus-circle"></i> Add Consultation Session
        </div>
        <form class="modal-form" action="{{ route('sessions.store') }}" method="POST">
            @csrf
            <label>Session Type:</label>
            <select name="type" required style="width:100%;padding:10px 12px;border:1.5px solid #e0e7ef;border-radius:8px;font-size:1rem;background:#f7fafc;margin-bottom:16px;">
                <option value="">Select Session Type</option>
                <option value="Free Consultations">Free Consultations</option>
                <option value="Virtual Consultations">Virtual Consultations</option>
                <option value="In-Person Consultations">In-Person Consultations</option>
            </select>
            <label>Name:</label>
            <input type="text" name="name" placeholder="e.g. Initial Assessment" required>
            <label>Duration:</label>
            <input type="text" name="duration" placeholder="e.g. 60 minutes" required>
            <label>Price:</label>
            <input type="number" name="price" step="0.01" placeholder="e.g. 150">
            <label>Description:</label>
            <textarea name="description" placeholder="Session description"></textarea>
            <label>Features:</label>
            <div id="featuresList" class="features-list" style="max-height:120px;overflow-y:auto;border:1px solid #e0e7ef;border-radius:8px;padding:10px 8px 6px 8px;background:#f7fafc;">
                <div class="feature-row">
                    <input type="text" name="features[]" placeholder="Feature" required>
                    <button type="button" class="remove-feature-btn" style="display:none;">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
            <button type="button" class="add-feature-btn" onclick="addFeatureField()">+ Add Feature</button>
            <button type="submit" style="margin-top:10px;">Add Session</button>
        </form>
    </div>
</div>

<!-- View Session Modal -->
<div class="modal-overlay" id="viewSessionModal" style="display:none;">
    <div class="modal-content" style="max-width:480px;">
        <button class="modal-close" onclick="closeViewSessionModal()" style="top:18px;right:22px;">&times;</button>
        <div class="modal-header" style="font-size:1.35rem;gap:10px;align-items:center;">
            <i class="fa fa-eye" style="color:#2176ae;font-size:1.5rem;"></i>
            <span style="color:#2176ae;font-weight:700;">View Session</span>
        </div>
        <div style="padding:10px 0 0 0;">
            <table style="width:100%;border-collapse:separate;border-spacing:0 8px;">
                <tr>
                    <td style="font-weight:700;color:#2176ae;width:130px;">Type:</td>
                    <td style="color:#222;"> <span id="viewType"></span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;color:#2176ae;">Name:</td>
                    <td style="color:#222;"><span id="viewName"></span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;color:#2176ae;">Duration:</td>
                    <td style="color:#222;"><span id="viewDuration"></span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;color:#2176ae;">Price:</td>
                    <td style="color:#222;">$<span id="viewPrice"></span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;color:#2176ae;">Description:</td>
                    <td style="color:#222;"><span id="viewDescription"></span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;color:#2176ae;vertical-align:top;">Features:</td>
                    <td>
                        <ul id="viewFeatures" style="margin:0;padding-left:18px;color:#222;">
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>

<!-- Edit Session Modal -->
<div class="modal-overlay" id="editSessionModal" style="display:none;">
    <div class="modal-content">
        <button class="modal-close" onclick="closeEditSessionModal()">&times;</button>
        <div class="modal-header">
            <i class="fa fa-pen-to-square"></i> Edit Consultation Session
        </div>
        <form id="editSessionForm" class="modal-form" method="POST">
            @csrf
            @method('PUT')
            <label>Session Type:</label>
            <select name="type" id="editType" required style="width:100%;padding:10px 12px;border:1.5px solid #e0e7ef;border-radius:8px;font-size:1rem;background:#f7fafc;margin-bottom:16px;">
                <option value="">Select Session Type</option>
                <option value="Virtual Consultations">Virtual Consultations</option>
                <option value="In-Person Consultations">In-Person Consultations</option>
            </select>
            <label>Name:</label>
            <input type="text" name="name" id="editName" placeholder="e.g. Initial Assessment" required>
            <label>Duration:</label>
            <input type="text" name="duration" id="editDuration" placeholder="e.g. 60 minutes" required>
            <label>Price:</label>
            <input type="number" name="price" id="editPrice" step="0.01" placeholder="e.g. 150">
            <label>Description:</label>
            <textarea name="description" id="editDescription" placeholder="Session description"></textarea>
            <label>Features:</label>
            <div id="editFeaturesList" class="features-list" style="max-height:120px;overflow-y:auto;border:1px solid #e0e7ef;border-radius:8px;padding:10px 8px 6px 8px;background:#f7fafc;">
                <!-- Feature fields will be filled by JS -->
            </div>
            <button type="button" class="add-feature-btn" onclick="addEditFeatureField()">+ Add Feature</button>
            <button type="submit" style="margin-top:10px;">Update Session</button>
        </form>
    </div>
</div>

<!-- Delete Session Modal -->
<div class="modal-overlay" id="deleteSessionModal" style="display:none;">
    <div class="modal-content" style="max-width:350px;text-align:center;">
        <button class="modal-close" onclick="closeDeleteSessionModal()" style="top:16px;right:18px;">&times;</button>
        <div class="modal-header" style="justify-content:center;margin-bottom:12px;gap:10px;">
            <i class="fa fa-trash" style="color:#e74c3c;font-size:2rem;"></i>
            <span style="margin-left:4px;font-size:1.25rem;color:#2176ae;">Delete Session</span>
        </div>
        <div style="color:#444;font-size:1.08rem;margin-bottom:18px;">
            Are you sure you want to delete this session?
        </div>
        <div style="display:flex;justify-content:center;gap:18px;">
            <form id="deleteSessionForm" method="POST">
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
            <button onclick="closeDeleteSessionModal()" style="
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
function openSessionModal() {
    document.getElementById('sessionModal').style.display = 'flex';
}
function closeSessionModal() {
    document.getElementById('sessionModal').style.display = 'none';
}
function addFeatureField() {
    var featuresList = document.getElementById('featuresList');
    var div = document.createElement('div');
    div.className = 'feature-row';

    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'features[]';
    input.placeholder = 'Feature';
    input.required = true;

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-feature-btn';
    removeBtn.innerHTML = '<i class="fa fa-times"></i>';
    removeBtn.onclick = function() {
        featuresList.removeChild(div);
    };

    div.appendChild(input);
    div.appendChild(removeBtn);
    featuresList.appendChild(div);
}

// Show remove icon for all but the first feature input
document.addEventListener('DOMContentLoaded', function() {
    var featuresList = document.getElementById('featuresList');
    var firstRemoveBtn = featuresList.querySelector('.remove-feature-btn');
    if (firstRemoveBtn) {
        firstRemoveBtn.style.display = 'none';
    }
});

function showViewSessionModal(session) {
    document.getElementById('viewType').textContent = session.type || '-';
    document.getElementById('viewName').textContent = session.name || '-';
    document.getElementById('viewDuration').textContent = session.duration || '-';
    document.getElementById('viewPrice').textContent = parseFloat(session.price).toFixed(2);
    document.getElementById('viewDescription').textContent = session.description || '-';

    // Features
    var featuresList = document.getElementById('viewFeatures');
    featuresList.innerHTML = '';
    if (session.features && session.features.length) {
        session.features.forEach(function(feature) {
            var li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        var li = document.createElement('li');
        li.textContent = '-';
        featuresList.appendChild(li);
    }

    document.getElementById('viewSessionModal').style.display = 'flex';
}
function closeViewSessionModal() {
    document.getElementById('viewSessionModal').style.display = 'none';
}

function showEditSessionModal(session) {
    document.getElementById('editType').value = session.type;
    document.getElementById('editName').value = session.name;
    document.getElementById('editDuration').value = session.duration;
    document.getElementById('editPrice').value = session.price;
    document.getElementById('editDescription').value = session.description;
    document.getElementById('editSessionForm').action = "{{ route('sessions.update', ':id') }}".replace(':id', session.id);

    // Fill features
    var featuresList = document.getElementById('editFeaturesList');
    featuresList.innerHTML = '';
    var features = session.features || [];
    if (features.length === 0) features = [''];
    features.forEach(function(feature, idx) {
        var div = document.createElement('div');
        div.className = 'feature-row';

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'features[]';
        input.placeholder = 'Feature';
        input.required = true;
        input.value = feature;

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-feature-btn';
        removeBtn.innerHTML = '<i class="fa fa-times"></i>';
        removeBtn.onclick = function() {
            featuresList.removeChild(div);
        };

        div.appendChild(input);
        div.appendChild(removeBtn);
        featuresList.appendChild(div);
    });

    // Hide remove button for first feature if only one
    var removeBtns = featuresList.querySelectorAll('.remove-feature-btn');
    if (removeBtns.length > 0) {
        removeBtns[0].style.display = features.length > 1 ? '' : 'none';
    }

    document.getElementById('editSessionModal').style.display = 'flex';
}
function closeEditSessionModal() {
    document.getElementById('editSessionModal').style.display = 'none';
}

function addEditFeatureField() {
    var featuresList = document.getElementById('editFeaturesList');
    var div = document.createElement('div');
    div.className = 'feature-row';

    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'features[]';
    input.placeholder = 'Feature';
    input.required = true;

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-feature-btn';
    removeBtn.innerHTML = '<i class="fa fa-times"></i>';
    removeBtn.onclick = function() {
        featuresList.removeChild(div);
    };

    div.appendChild(input);
    div.appendChild(removeBtn);
    featuresList.appendChild(div);

    // Show remove buttons if more than one feature
    var removeBtns = featuresList.querySelectorAll('.remove-feature-btn');
    removeBtns.forEach(function(btn) { btn.style.display = ''; });
}

function showDeleteSessionModal(id) {
    var url = "{{ route('sessions.destroy', ':id') }}";
    url = url.replace(':id', id);
    document.getElementById('deleteSessionForm').action = url;
    document.getElementById('deleteSessionModal').style.display = 'flex';
}
function closeDeleteSessionModal() {
    document.getElementById('deleteSessionModal').style.display = 'none';
}
</script>
@endsection