<style>
    body {
        margin: 0;
        padding: 0;
    }
    .admin-header {
        /* position: sticky;
        top: 0;
        left: 0px;
        width: 100%; */
        height: 64px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(30,111,167,0.07);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        z-index: 100;
        border-radius: 16px;
    }
    .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .header-logo {
        height: 40px;
    }
    .header-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2176ae;
        letter-spacing: 0.5px;
    }
    .header-right {
        display: flex;
        align-items: center;
        gap: 24px;
    }

    .header-right a{
       text-decoration: none;
    }


    .header-user {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #2176ae;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
    }
    .header-user i {
        font-size: 1.2rem;
        color: #2bb7a7;
    }
    .header-btn {
        background: #2bb7a7;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 8px 18px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        box-shadow: 0 2px 8px rgba(30,111,167,0.08);
    }
    .header-btn:hover {
        background: #1e6fa7;
    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
    }
    .modal-content {
        background: #fff;
        padding: 32px 28px 24px 28px;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.13);
        width: 90%;
        max-width: 400px;
        position: relative;
    }
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 18px 0;
        margin-bottom: 18px;
        border-bottom: 1.5px solid #e0e7ef;
    }
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #2176ae;
        cursor: pointer;
        margin-left: 12px;
    }
    .modal-content label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
    }
    .modal-content input {
        width: 100%;
        padding: 10px;
        margin-bottom: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        color: #333;
        box-sizing: border-box;
    }
    .modal-content button[type="submit"] {
        background: #2bb7a7;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        width: 100%;
        margin-top: 10px;
    }
    .modal-content button[type="submit"]:hover {
        background: #1e6fa7;
    }
    .error-message {
        color: #e74c3c;
        font-size: 0.97rem;
        margin-bottom: 8px;
    }
    .success-message {
        color: green;
        font-size: 0.97rem;
        margin-bottom: 8px;
    }
    /* Responsive header styles */
    .header-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.25rem;
        color: #2176ae;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
    }
    .header-admin-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        align-items: center;
        gap: 8px;
        color: #2176ae;
        font-weight: 600;
    }
    .header-admin-btn img { height: 28px; border-radius: 50%; }
    @media (max-width: 900px) {
        .admin-header {
            height: 56px;
            padding: 0 12px;
            border-radius: 0;
        }
        .header-left { 
        gap: 10px; 
        justify-content: space-between;
        width: 100%;
    }

        .header-title { font-size: 1rem; }
        .header-right { 
            position: absolute;
            top: 80px;
            right: 12px;
            background: #fff;
            box-shadow: 0 6px 18px rgba(0,0,0,0.12);
            border-radius: 10px;
            padding: 20px;
            flex-direction: column;
            gap: 8px;
            display: none;
            z-index: 1200;
            min-width: 200px;
            align-items: start;
        }
        body.header-open .header-right { display: flex; }
        /* ensure header dropdown sits above other elements */
        .header-right { z-index: 1300; }
        .header-toggle { display: inline-flex; }
        .header-admin-btn { display: inline-flex; }
        .header-user { font-size: 0.95rem; }
        .header-btn { padding: 6px 12px; font-size: 0.95rem; }

        .header-link {
            font-size: 1rem;
            color: #2176ae;
            text-decoration: none;
            border: none;
            outline: none;
            background: none;
        }

        .header-btn {
         font-size: 1rem;
            color: #2176ae;
            text-decoration: none;
            border: none;
            outline: none;
            background: none;
            box-shadow: none;
    }
    }
</style>
<div class="admin-header">
    <div class="header-left">
        <div>
            <button id="headerMenuToggle" class="header-toggle" aria-expanded="false" aria-controls="headerActions" title="Open menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <span class="header-title">Welcome! Admin</span>
        </div>

        <div class="header-user" id="headerUserBtn" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
            <i class="fa-solid fa-user-shield"></i>
            <span class="header-user-name">Admin</span>
        </div>
    </div>
    <div class="header-right" id="headerActions">
        
        <a href="javascript:void(0);" class="header-btn" id="changePasswordBtnHeader" onclick="openChangePasswordModal()" style="margin-right:8px;">
           Change Password
        </a>
        <form method="POST" action="{{ route('logout') }}" style="margin:0;">
            @csrf
            <button type="submit" class="header-btn"  id="logoutBtn"> Logout</button>
        </form>
    </div>
</div>

<div class="modal-overlay" id="changePasswordModal" style="display:none;">
    <div class="modal-content" style="max-width:400px;">
        <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;padding:0 0 18px 0;margin-bottom:18px;border-bottom:1.5px solid #e0e7ef;">
            <span style="font-size:1.25rem;color:#2176ae;font-weight:700;">Change Password</span>
            <button class="modal-close" onclick="closeChangePasswordModal()" style="position:static;font-size:1.5rem;margin-left:12px;">&times;</button>
        </div>
        <form id="changePasswordForm" method="POST" action="{{ route('password.change') }}">
            @csrf
            <div>
                <label>Current Password</label>
                <input type="password" name="current_password" required>
                <div id="currentPasswordError" class="error-message" style="display:none;"></div>
            </div>
            <div>
                <label>New Password</label>
                <input type="password" name="new_password" required>
                <div id="newPasswordError" class="error-message" style="display:none;"></div>
            </div>
            <div>
                <label>Confirm New Password</label>
                <input type="password" name="new_password_confirmation" required>
                <div id="confirmPasswordError" class="error-message" style="display:none;"></div>
            </div>
            <div id="changePasswordSuccess" class="success-message" style="display:none;"></div>
            <button type="submit" id="changePasswordBtn" style="margin-top:16px;">Change Password</button>
        </form>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $('#logoutBtn').on('click', function (e) {
        e.preventDefault(); // stop button click from submitting form

        let btn = $(this);
        btn.prop('disabled', true).html('Logging out...');

        $.ajax({
            url: "{{ route('logout') }}",
            type: 'POST',
            data: {
                _token: '{{ csrf_token() }}'
            },
            success: function () {
                // Smooth redirect without reloading current page
                window.location.replace('login');
            },
            error: function () {
                btn.prop('disabled', false).html('Logout');
                alert('Logout failed.');
            }
        });
    });

    function openChangePasswordModal() {
        document.getElementById('changePasswordModal').style.display = 'flex';
        // Clear previous messages and form
        $('#changePasswordForm')[0].reset();
        $('#currentPasswordError, #newPasswordError, #confirmPasswordError, #changePasswordSuccess').hide().text('');
        $('#changePasswordBtn').prop('disabled', false).text('Change Password');
    }
    function closeChangePasswordModal() {
        document.getElementById('changePasswordModal').style.display = 'none';
    }

    // Intercept form submit for AJAX
    $('#changePasswordForm').on('submit', function(e) {
        e.preventDefault();
        $('#changePasswordBtn').prop('disabled', true).text('Changing...');
        $('#currentPasswordError, #newPasswordError, #confirmPasswordError, #changePasswordSuccess').hide().text('');
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                $('#changePasswordBtn').prop('disabled', false).text('Change Password');
                $('#changePasswordSuccess').text('Password changed successfully!').show();
                $('#changePasswordForm')[0].reset();
            },
            error: function(xhr) {
                $('#changePasswordBtn').prop('disabled', false).text('Change Password');
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    if (xhr.responseJSON.errors.current_password) {
                        $('#currentPasswordError').text(xhr.responseJSON.errors.current_password[0]).show();
                    }
                    if (xhr.responseJSON.errors.new_password) {
                        $('#newPasswordError').text(xhr.responseJSON.errors.new_password[0]).show();
                    }
                    if (xhr.responseJSON.errors.new_password_confirmation) {
                        $('#confirmPasswordError').text(xhr.responseJSON.errors.new_password_confirmation[0]).show();
                    }
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    $('#currentPasswordError').text(xhr.responseJSON.message).show();
                }
            }
        });
    });

    // Header mobile toggle opens sidebar (if available)
    (function(){
        var headerToggle = $('#headerMenuToggle');

        function openSidebarFallback(){
            if (typeof window.openSidebar === 'function') {
                window.openSidebar();
            } else {
                $('body').addClass('sidebar-open');
            }
            headerToggle.attr('aria-expanded','true');
        }
        function closeSidebarFallback(){
            if (typeof window.closeSidebar === 'function') {
                window.closeSidebar();
            } else {
                $('body').removeClass('sidebar-open');
            }
            headerToggle.attr('aria-expanded','false');
        }

        // use delegated listener for robustness
        $(document).on('click', '#headerMenuToggle', function(e){
            e.preventDefault();
            e.stopPropagation();
            if ($('body').hasClass('sidebar-open')) closeSidebarFallback(); else openSidebarFallback();
        });

        // close when clicking outside (also covers sidebar and header dropdown)
        $(document).on('click touchstart', function(e){
            // close sidebar if open and clicked outside
            if (!$(e.target).closest('.admin-header').length && !$(e.target).closest('.sidebar').length && $('body').hasClass('sidebar-open')) {
                closeSidebarFallback();
            }
            // close header dropdown if open and clicked outside
            if (!$(e.target).closest('.admin-header').length && $('body').hasClass('header-open')) {
                $('body').removeClass('header-open');
                $('#headerUserBtn').attr('aria-expanded','false');
            }
        });

        // close on ESC (both sidebar and header dropdown)
        $(document).on('keydown', function(e){ 
            if (e.key === 'Escape') {
                closeSidebarFallback();
                $('body').removeClass('header-open');
                $('#headerUserBtn').attr('aria-expanded','false');
            }
        });

        // header user (avatar/name) toggles header dropdown (mobile)
        $(document).on('click', '#headerUserBtn', function(e){
            e.preventDefault();
            e.stopPropagation();
            var btn = $(this);
            var isOpen = $('body').hasClass('header-open');
            if (isOpen) {
                $('body').removeClass('header-open');
                btn.attr('aria-expanded','false');
            } else {
                // close sidebar if open to avoid overlap
                if ($('body').hasClass('sidebar-open')) {
                    if (typeof window.closeSidebar === 'function') window.closeSidebar(); else $('body').removeClass('sidebar-open');
                }
                $('body').addClass('header-open');
                btn.attr('aria-expanded','true');
            }
        });

        // keyboard support for header user (Enter / Space)
        $(document).on('keydown', '#headerUserBtn', function(e){
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).trigger('click');
            }
        });
    })();
</script>

