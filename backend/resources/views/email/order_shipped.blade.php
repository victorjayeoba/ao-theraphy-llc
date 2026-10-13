<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your order is on its way</title>
</head>
<body style="font-family:'Inter','Segoe UI',Arial,sans-serif;background-color:#f7fafc;color:#2176ae;margin:0;padding:0;">
    <div style="width:100%;padding:40px 0;">
        <div style="background-color:#ffffff;max-width:600px;margin:0 auto;border-radius:16px;box-shadow:0 4px 16px rgba(30,111,167,0.10);overflow:hidden;border:2px solid #2bb7a7;">

            <div style="background:linear-gradient(135deg,#1e6fa7 0%,#2bb7a7 100%);color:#fff;padding:24px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">Your order is on its way</h1>
                <p style="margin:8px 0 0;font-size:15px;">Order {{ $order->number }}</p>
            </div>

            <div style="padding:28px;">
                <p style="margin-top:0;">Hi {{ $order->name }},</p>
                <p>Good news — your order has shipped.</p>

                @if($order->tracking_number)
                    <div style="background:#f1f6fa;border-radius:12px;padding:18px;margin:20px 0;text-align:center;">
                        @if($order->carrier)
                            <p style="margin:0 0 6px;color:#64748b;font-size:14px;">{{ $order->carrier }}</p>
                        @endif
                        <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.5px;color:#1e6fa7;">
                            {{ $order->tracking_number }}
                        </p>
                        @if($order->trackingUrl())
                            <p style="margin:16px 0 0;">
                                <a href="{{ $order->trackingUrl() }}"
                                   style="background:#2bb7a7;color:#fff;text-decoration:none;padding:10px 22px;border-radius:999px;font-weight:600;display:inline-block;">
                                    Track your parcel
                                </a>
                            </p>
                        @endif
                    </div>
                @endif

                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    @foreach($order->items as $item)
                        <tr>
                            <td style="padding:8px 0;border-bottom:1px solid #e8eef3;color:#334155;">
                                {{ $item['name'] }} <span style="color:#64748b;">&times; {{ $item['quantity'] }}</span>
                            </td>
                        </tr>
                    @endforeach
                </table>

                @if($order->address)
                    <p style="color:#334155;margin-bottom:4px;"><strong>Delivering to</strong></p>
                    <p style="color:#64748b;margin-top:0;">
                        {{ $order->address }}@if($order->city), {{ $order->city }}@endif @if($order->zip) {{ $order->zip }}@endif
                    </p>
                @endif

                <p style="color:#64748b;font-size:14px;">
                    You can check your order any time at
                    <a href="{{ rtrim(config('app.frontend_url'), '/') }}/track" style="color:#1e6fa7;">
                        {{ str_replace(['https://', 'http://'], '', rtrim(config('app.frontend_url'), '/')) }}/track
                    </a>
                    using your order number and email.
                </p>
                <p style="margin-bottom:0;">Warm regards,<br><strong>A&amp;O Therapy LLC</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
