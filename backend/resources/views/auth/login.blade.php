<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login | AO Therapy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Inter:400,600,700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1e6fa7 0%, #2bb7a7 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(30, 111, 167, 0.12);
            padding: 48px 36px 36px 36px;
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo {
            margin-bottom: 18px;
        }
        .admin-badge {
            display: inline-block;
            background: #e6f7f7;
            color: #2bb7a7;
            font-size: 0.9rem;
            padding: 5px 16px;
            border-radius: 14px;
            margin-bottom: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .login-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1e6fa7;
            margin-bottom: 6px;
        }
        .login-subtitle {
            font-size: 1.05rem;
            color: #2bb7a7;
            margin-bottom: 28px;
        }
        .form-group {
            margin-bottom: 22px;
            text-align: left;
        }
        label {
            font-weight: 600;
            color: #1e6fa7;
            display: block;
            margin-bottom: 7px;
            font-size: 1rem;
        }
        input[type="email"], input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            border: 1.5px solid #e0e7ef;
            border-radius: 10px;
            font-size: 1.05rem;
            background: #f7fafc;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }
        input[type="email"]:focus, input[type="password"]:focus {
            border-color: #1e6fa7;
            outline: none;
        }
        .login-btn {
            width: 100%;
            padding: 13px 0;
            background: #2176ae;
            color: #fff;
            font-weight: 600;
            font-size: 1.08rem;
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(30, 111, 167, 0.08);
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s, box-shadow 0.2s;
            position: relative;
        }
        .login-btn:hover {
            background: #155a8a;
            box-shadow: 0 4px 16px rgba(30, 111, 167, 0.13);
        }
        .forgot-link {
            display: block;
            margin-top: 18px;
            color: #2bb7a7;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.2s;
        }
        .forgot-link:hover {
            color: #1e6fa7;
            text-decoration: underline;
        }
        #loginBtnSpinner {
            display: none;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="{{ asset('images/logo.png') }}" alt="AO Therapy Logo" height="48">
        </div>
        <div class="admin-badge">Admin Portal</div>
        <div class="login-title">Admin Login</div>
        <div class="login-subtitle">Secure access for authorized personnel</div>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div id="loginError" style="color:#e74c3c;font-size:0.97rem;margin-bottom:10px;display:none;"></div>
            <button type="submit" class="login-btn" id="loginBtn">Login</button>
            {{-- <a href="#" class="forgot-link">Forgot Password?</a> --}}
        </form>
    </div>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$('form').on('submit', function(e) {
    e.preventDefault();
    $('#loginBtn').attr('disabled', true).text('Logging in...');
    $('#loginError').hide().text('');
    $.ajax({
        url: $(this).attr('action'),
        method: 'POST',
        data: $(this).serialize(),
        success: function(res) {
            window.location.href = 'dashboard';
        },
        error: function(xhr) {
            $('#loginBtn').attr('disabled', false).text('Login');
            $('#loginError').text('Wrong credentials. Please try again.').show();
        }
    });
});
</script>
</body>
</html>