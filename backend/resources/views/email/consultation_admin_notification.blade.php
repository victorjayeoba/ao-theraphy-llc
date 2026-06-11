<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Consultation Request</title>
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
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .email-body {
            padding: 28px 32px;
        }
        .email-body p {
            font-size: 1rem;
            line-height: 1.5;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        .info-table td {
            padding: 10px 5px;
            vertical-align: top;
            border-bottom: 1px solid #e0e7ef;
        }
        .info-table td.label {
            font-weight: 600;
            color: #1e6fa7;
            width: 170px;
            font-size: 0.98rem;
        }
        .info-table td.value {
            color: #2176ae;
            font-size: 0.98rem;
        }
        .email-footer {
            background-color: #f7fafc;
            color: #2bb7a7;
            text-align: center;
            font-size: 13px;
            padding: 18px;
            border-top: 1px solid #e0e7ef;
        }
        .cta-button {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 28px;
            background: #2176ae;
            color: #fff !important;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1.02rem;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h2>New Consultation Request</h2>
            </div>
            <div class="email-body">
                <p>
                    A new consultation request has just been submitted through the website.
                    Details are below — reply to this email to respond directly to the client.
                </p>
                <table class="info-table">
                    <tr>
                        <td class="label">Name:</td>
                        <td class="value">{{ $consultation->first_name }} {{ $consultation->last_name }}</td>
                    </tr>
                    <tr>
                        <td class="label">Email:</td>
                        <td class="value">{{ $consultation->email }}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone:</td>
                        <td class="value">{{ $consultation->phone_number }}</td>
                    </tr>
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
                        <td class="label">Message / Needs:</td>
                        <td class="value">{{ $consultation->needs }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td class="label">Submitted:</td>
                        <td class="value">{{ $consultation->created_at }}</td>
                    </tr>
                </table>
                <a href="{{ url('/consultations') }}" class="cta-button">View in Dashboard</a>
            </div>
            <div class="email-footer">
                Automated notification from the A&amp;O Therapy website.<br>
                &copy; {{ date('Y') }} A&amp;O Therapy — All Rights Reserved.
            </div>
        </div>
    </div>
</body>
</html>
