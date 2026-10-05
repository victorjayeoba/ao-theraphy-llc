<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your A&O Therapy order</title>
</head>
<body style="font-family:'Inter','Segoe UI',Arial,sans-serif;background-color:#f7fafc;color:#2176ae;margin:0;padding:0;">
    <div style="width:100%;padding:40px 0;">
        <div style="background-color:#ffffff;max-width:600px;margin:0 auto;border-radius:16px;box-shadow:0 4px 16px rgba(30,111,167,0.10);overflow:hidden;border:2px solid #2bb7a7;">

            <div style="background:linear-gradient(135deg,#1e6fa7 0%,#2bb7a7 100%);color:#fff;padding:24px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">Thank you for your order</h1>
                <p style="margin:8px 0 0;font-size:15px;">Order {{ $order->number }}</p>
            </div>

            <div style="padding:28px;">
                <p style="margin-top:0;">Hi {{ $order->name }},</p>
                <p>We've received your payment and your order is confirmed. Here's what you ordered:</p>

                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    @foreach($order->items as $item)
                        <tr>
                            <td style="padding:8px 0;border-bottom:1px solid #e8eef3;color:#334155;">
                                {{ $item['name'] }}
                                <span style="color:#64748b;">&times; {{ $item['quantity'] }}</span>
                            </td>
                            <td style="padding:8px 0;border-bottom:1px solid #e8eef3;text-align:right;color:#334155;white-space:nowrap;">
                                ${{ number_format($item['price'] * $item['quantity'], 2) }}
                            </td>
                        </tr>
                    @endforeach
                    <tr>
                        <td style="padding:8px 0;color:#64748b;">Subtotal</td>
                        <td style="padding:8px 0;text-align:right;color:#64748b;">${{ number_format($order->subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#64748b;">Shipping</td>
                        <td style="padding:4px 0;text-align:right;color:#64748b;">
                            {{ $order->shipping > 0 ? '$' . number_format($order->shipping, 2) : 'Free' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#64748b;">Tax</td>
                        <td style="padding:4px 0;text-align:right;color:#64748b;">${{ number_format($order->tax, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 0 0;font-weight:700;font-size:17px;border-top:2px solid #2bb7a7;">Total paid</td>
                        <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:17px;border-top:2px solid #2bb7a7;">
                            ${{ number_format($order->total, 2) }}
                        </td>
                    </tr>
                </table>

                @if($order->address)
                    <p style="color:#334155;margin-bottom:4px;"><strong>Delivery address</strong></p>
                    <p style="color:#64748b;margin-top:0;">
                        {{ $order->address }}@if($order->city), {{ $order->city }}@endif @if($order->zip) {{ $order->zip }}@endif
                    </p>
                @endif

                <p style="color:#64748b;font-size:14px;">
                    We'll be in touch about delivery. If anything looks wrong, just reply to this email
                    and we'll sort it out.
                </p>
                <p style="margin-bottom:0;">Warm regards,<br><strong>A&amp;O Therapy LLC</strong></p>
            </div>

            <div style="background:#f1f6fa;padding:16px;text-align:center;color:#64748b;font-size:12px;">
                A&amp;O Therapy LLC &middot; Keep this email as your receipt
            </div>
        </div>
    </div>
</body>
</html>
