<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thank You for Your Consultation Request</title>
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
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h2>Thank You for Your Consultation Request</h2>
            </div>
            <div class="email-body">
                <h3>Hello {{ $consultation->first_name }},</h3>
                <p>
                    We have received your consultation request.<br>
                    Our team will contact you soon to confirm your session.
                </p>
                <table class="info-table">
                    <tr>
                        <td class="label">Preferred Date:</td>
                        <td class="value">{{ $consultation->preferred_date }}</td>
                    </tr>
                    <tr>
                        <td class="label">Preferred Time:</td>
                        <td class="value">{{ date('h:i A', strtotime($consultation->preferred_time)) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Session Type:</td>
                        <td class="value">{{ $consultation->session_type }}</td>
                    </tr>
                    @if(!empty($consultation->needs))
                    <tr>
                        <td class="label">Your Message:</td>
                        <td class="value">{{ $consultation->needs }}</td>
                    </tr>
                    @endif
                </table>
                <a href="https://www.aotherapyllc.com" class="cta-button">Visit A&O Therapy</a>
            </div>
            <div class="email-footer">
                If you have any questions, feel free to reply to this email.<br>
                <br>
                Best regards,<br>
                AO Therapy Team<br>
                &copy; {{ date('Y') }} AO Therapy — All Rights Reserved.
            </div>
        </div>
    </div>
</body>
</html>