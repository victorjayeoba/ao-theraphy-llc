<!-- resources/views/support.blade.php -->
@extends('layout.sidebar')

@section('content')
@include('layout.header')

<meta name="csrf-token" content="{{ csrf_token() }}">

<style>
    body {
        background: #f3f7fb;
    }

    .support-wrapper {
        padding: 30px;
        margin-top: 40px;
    }

    .support-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        padding: 25px 30px;
    }

    .support-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .support-header h2 {
        color: #1e6fa7;
        font-weight: 700;
    }

    .support-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    .support-table thead {
        background: linear-gradient(135deg, #1e6fa7, #2bb7a7);
        color: #fff;
    }

    .support-table th,
    .support-table td {
        padding: 14px 16px;
        font-size: 0.95rem;
        border-bottom: 1px solid #eef2f7;
    }

    .support-table tbody tr:hover {
        background: #f0f8ff;
        transition: 0.3s;
    }

    .status-badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .status-active {
        background: #e8fff9;
        color: #1fa389;
    }

    .status-inactive {
        background: #ffecec;
        color: #d9534f;
    }

    .btn-view {
        background: linear-gradient(135deg, #2bb7a7, #1e6fa7);
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 0.85rem;
        text-decoration: none;
        display: inline-block;
    }

    .btn-view:hover {
        opacity: 0.9;
    }

    /* Modal Styles */
    #supportModal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(30, 111, 167, 0.13);
        z-index: 9999;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(30, 111, 167, 0.18);
        padding: 36px 38px 28px 38px;
        max-width: 440px;
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
        font-size: 1.35rem;
        font-weight: 700;
        margin-bottom: 18px;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center !important;
        text-align: center !important;
    }

    .modal-body {
        font-size: 1rem;
        color: #2176ae;
    }

    .modal-body div {
        margin-bottom: 13px;
        display: flex;
        align-items: flex-start;
    }

    .modal-label {
        font-weight: 600;
        color: #1e6fa7;
        min-width: 90px;
        display: inline-block;
    }

    .modal-value {
        color: #2176ae;
        font-weight: 400;
        margin-left: 8px;
        word-break: break-word;
    }

    .modal-status-active {
        background: #e8fff9;
        color: #1fa389;
        padding: 3px 14px;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 600;
        margin-left: 8px;
    }

    .modal-status-inactive {
        background: #ffecec;
        color: #d9534f;
        padding: 3px 14px;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 600;
        margin-left: 8px;
    }
</style>

<div class="support-wrapper">
    <div class="support-card">
        <div class="support-header">
            <h2>Support Requests</h2>
        </div>

        <table class="support-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    {{-- <th>Date</th> --}}
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse($inquiries as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $item->full_name }}</td>
                        <td>{{ $item->email }}</td>
                        <td>{{ $item->subject ?? '-' }}</td>
                        <td>
                            <span class="status-badge {{ $item->is_active ? 'status-active' : 'status-inactive' }}">
                                {{ $item->is_active ? 'Active' : 'Inactive' }}
                                @if(!$item->is_active)
                                    <span style="background:#2bb7a7;color:#fff;border-radius:8px;padding:2px 10px;font-size:0.75rem;margin-left:8px;font-weight:600;vertical-align:middle;">New</span>
                                @endif
                            </span>
                        </td>
                        {{-- <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d M Y, h:i A') }}</td> --}}
                        <td>
                            <a href="javascript:void(0);" 
                               class="btn-view"
                               onclick="showModal({{ $item->id }})"
                            >
                                View
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align:center;">No support requests found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Modal for Support Request Details -->
<div id="supportModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <div class="modal-header" style="display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;">
            <i class="fa-solid fa-headset"></i>
            <span style="flex:1;font-size:1.35rem;color:#2176ae;font-weight:700;">Support Request Details</span>
        </div>
        <div class="modal-body">
            <div><span class="modal-label">Name:</span> <span class="modal-value" id="modalName"></span></div>
            <div><span class="modal-label">Email:</span> <span class="modal-value" id="modalEmail"></span></div>
            <div><span class="modal-label">Subject:</span> <span class="modal-value" id="modalSubject"></span></div>
            <div><span class="modal-label">Message:</span> <span class="modal-value" id="modalMessage"></span></div>
            <div>
                <span class="modal-label">Status:</span>
                <span id="modalStatus"></span>
            </div>
            <div><span class="modal-label">Date:</span> <span class="modal-value" id="modalDate"></span></div>
        </div>
    </div>
</div>

<script>
function showModal(id) {
    fetch('{{ route("support.inquiry", ":id") }}'.replace(':id', id))
        .then(res => res.json())
        .then(item => {
            // If inactive, activate it
            if(!item.is_active) {
                fetch('{{ route("support.inquiry.activate", ":id") }}'.replace(':id', id), {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    // Update status in table
                    const row = document.querySelector(`a[onclick="showModal(${id})"]`).closest('tr');
                    const statusTd = row.querySelector('td:nth-child(5)');
                    statusTd.innerHTML = `<span class="status-badge status-active">Active</span>`;
                });
                item.is_active = true; // For modal display
            }
            document.getElementById('modalName').textContent = item.full_name;
            document.getElementById('modalEmail').textContent = item.email;
            document.getElementById('modalSubject').textContent = item.subject ?? '-';
            document.getElementById('modalMessage').textContent = item.message ?? '-';
            let status = item.is_active ? 'Active' : 'Inactive';
            let statusSpan = document.createElement('span');
            statusSpan.textContent = status;
            statusSpan.className = status === 'Active' ? 'modal-status-active' : 'modal-status-inactive';
            let statusContainer = document.getElementById('modalStatus');
            statusContainer.innerHTML = '';
            statusContainer.appendChild(statusSpan);
            document.getElementById('modalDate').textContent = new Date(item.created_at).toLocaleString();
            document.getElementById('supportModal').style.display = 'flex';
        });
}
function closeModal() {
    document.getElementById('supportModal').style.display = 'none';
}
</script>
@endsection
