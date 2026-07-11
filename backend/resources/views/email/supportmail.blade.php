<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Support Request</title>
    <style>
        body {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            background-color: #f7fafc;
            color: #2176ae;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            width: 100%;
            padding: 40px 0;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 4px 16px rgba(30,111,167,0.10);
            overflow: hidden;
            border: 2px solid #2bb7a7;
        }
        .email-header {
            background: linear-gradient(135deg, #1e6fa7 0%, #2bb7a7 100%);
            color: #fff;
            padding: 24px;
            text-align: center;
        }
        .email-header h2 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .email-body {
            padding: 28px 32px;
        }
        .email-body h3 {
            color: #2bb7a7;
            font-size: 21px;
            margin-bottom: 18px;
            font-weight: 700;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 10px 5px;
            vertical-align: top;
        }
        .info-table td.label {
            font-weight: 600;
            color: #1e6fa7;
            width: 180px;
            font-size: 1rem;
        }
        .info-table td.value {
            color: #2176ae;
            font-size: 1rem;
        }
        .cta-button {
            display: inline-block;
            margin-top: 28px;
            padding: 12px 32px;
            background: #2176ae;
            color: #fff !important;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1.08rem;
            box-shadow: 0 2px 8px rgba(30,111,167,0.08);
            border: none;
            transition: background 0.2s;
        }
        .cta-button:hover {
            background: #155a8a;
        }
        .email-footer {
            background-color: #f7fafc;
            color: #2bb7a7;
            text-align: center;
            font-size: 14px;
            padding: 18px;
            border-top: 1px solid #e0e7ef;
        }
        .email-footer a {
            color: #2176ae;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h2>New Support Request — A&O Therapy</h2>
            </div>
            <div class="email-body">
                <h3>Support Request Details</h3>
                <table class="info-table">
                    <tr> 
                        <td class="label">Full Name:</td>
                        <td class="value">{{ $support->full_name }}</td>
                    </tr>
                    <tr>
                        <td class="label">Email:</td>
                        <td class="value">{{ $support->email }}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone Number:</td>
                        <td class="value">{{ $support->phone_number ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Preferred Contact Method:</td>
                        <td class="value">{{ $support->preferred_contact_method ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Subject:</td>
                        <td class="value">{{ $support->subject ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td class="label">Message:</td>
                        <td class="value">{{ $support->message ?? 'N/A' }}</td>
                    </tr>
                </table>
                <a href="https://www.aotherapyllc.com" class="cta-button">Visit A&O Therapy</a>
            </div>
            <div class="email-footer">
                You received this email because a visitor submitted a support request on the A&O Therapy website.<br>
                &copy; {{ date('Y') }} A&O Therapy — All Rights Reserved.
            </div>
        </div>
    </div>
</body>
</html>
