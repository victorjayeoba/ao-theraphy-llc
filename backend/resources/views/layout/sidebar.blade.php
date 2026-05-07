<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .main-wrapper {
            display: flex;
            height: 100vh;
        }
        .sidebar {
            width: 240px;
            height: 100vh;
            background: linear-gradient(135deg,#1e6fa7 0%,#2bb7a7 100%);
            box-shadow: 0 2px 12px rgba(30,111,167,0.08);
            display: flex;
            flex-direction: column;
            transition: transform 240ms ease;
        }
        .sidebar-header {
            text-align: center;
            padding: 36px 0 24px 0;
            border-bottom: 1.5px solid rgba(255,255,255,0.08);
        }
        .sidebar-logo {
            margin-bottom: 10px;
        }
        .sidebar-title {
            color: #fff;
            font-weight: 700;
            font-size: 1.18rem;
        }
        .sidebar-nav {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-top: 32px;
            padding: 0px 16px;
        }
        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 13px 32px;
            color: #fff;
            font-size: 1.07rem;
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 6px;
            font-weight: 500;
            transition: background 0.18s;
        }
        .sidebar-link:hover, 
        .sidebar-link.active {
            background: rgba(255,255,255,0.13);
        }
        .sidebar-link i {
            font-size: 1.18rem;
        }
        .content-area {
            flex: 1;
            height: 100vh;
            background: #f7fafc;
            padding: 30px;
            box-sizing: border-box;
            overflow-y: auto;
        }

        #sidebarCloseBtn {
            display: none;
        }
        @media (max-width: 900px) {
            .main-wrapper { flex-direction: column; height: 100vh; }
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                width: 260px;
                transform: translateX(-110%);
                z-index: 1100;
                border-radius: 0 12px 12px 0;
            }
            body.sidebar-open .sidebar { transform: translateX(0); }
            .sidebar-header { padding: 18px 12px; position: relative; }
            .sidebar-close-btn { display: none; position: absolute; right: 12px; top: 12px; background: none; border: none; color: #fff; font-size: 1.1rem; }
            .sidebar-nav { flex-direction: column; margin-top: 12px; padding: 8px 12px; }
            .sidebar-link { padding: 12px 14px; font-size: 0.98rem; margin-bottom: 8px; border-radius: 8px; white-space: normal; }
            .content-area { padding: 16px 3vw; min-width: 0; height: 100vh; }
            .sidebar-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1050; }
            body.sidebar-open .sidebar-backdrop { display: block; }
            .sidebar-close-btn { display: inline-flex; }

            #sidebarCloseBtn {
            display: inline-flex;
        }
        }
    </style>
</head>
<body>
    <div class="main-wrapper">
        <div class="sidebar">
            <div class="sidebar-header">
                <img src="{{asset('images/logo.png')}}" alt="AO Therapy Logo" height="44" class="sidebar-logo">
                <div class="sidebar-title">Admin Panel</div>
                <button class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close sidebar" title="Close sidebar" onclick="(window.closeSidebar||function(){document.body.classList.remove('sidebar-open')})()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <nav class="sidebar-nav">
                <a href="{{ route('dashboard') }}" class="sidebar-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    <i class="fa-solid fa-gauge"></i> Dashboard
                </a>
                <a href="{{ route('products.index') }}" class="sidebar-link {{ request()->routeIs('products.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-box"></i> Products
                </a>
                <a href="{{ route('consultations.index') }}" class="sidebar-link {{ request()->routeIs('consultations.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-user-md"></i> Consultation
                </a>
                <a href="{{ url('/achievements') }}" class="sidebar-link {{ request()->routeIs('achievements.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-medal"></i> Achievements
                </a>
                <a href="{{ url('/sessions') }}" class="sidebar-link {{ request()->is('sessions') ? 'active' : '' }}">
                    <i class="fa-solid fa-hourglass-half"></i> Sessions
                </a>
                <a href="{{ url('/support') }}" class="sidebar-link {{ request()->is('support') ? 'active' : '' }}">
                    <i class="fa-solid fa-headset"></i> Support
                </a>
                <!-- Actions mirrored from header -->
                <!-- <a href="javascript:void(0);" class="sidebar-link" onclick="openChangePasswordModal()">
                    <i class="fa-solid fa-key"></i> Change Password
                </a>
                <form method="POST" action="{{ route('logout') }}" style="margin:0;">
                    @csrf
                    <button type="submit" class="sidebar-link" style="background:none;border:none;color:inherit;text-align:left;padding:13px 32px;">
                        <i class="fa-solid fa-sign-out-alt"></i> Logout
                    </button>
                </form> -->
            </nav>
        </div>
        <div class="content-area">
            @yield('content')
        </div>
    </div>
    <div class="sidebar-backdrop" id="sidebarBackdrop" tabindex="-1" aria-hidden="true"></div>

    <script>
        (function(){
            var backdrop = document.getElementById('sidebarBackdrop');
            function openSidebar(){ document.body.classList.add('sidebar-open'); }
            function closeSidebar(){ document.body.classList.remove('sidebar-open'); }
            // expose API for header or other scripts
            window.openSidebar = openSidebar;
            window.closeSidebar = closeSidebar;
            if (backdrop) backdrop.addEventListener('click', closeSidebar);
            document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeSidebar(); });
        })();
    </script>
</body>
</html>
