<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New order</title>
</head>
<body style="font-family:'Inter','Segoe UI',Arial,sans-serif;background-color:#f7fafc;color:#2176ae;margin:0;padding:0;">
    <div style="width:100%;padding:40px 0;">
        <div style="background-color:#ffffff;max-width:600px;margin:0 auto;border-radius:16px;box-shadow:0 4px 16px rgba(30,111,167,0.10);overflow:hidden;border:2px solid #2bb7a7;">

            <div style="background:linear-gradient(135deg,#1e6fa7 0%,#2bb7a7 100%);color:#fff;padding:24px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">New order: {{ $order->number }}</h1>
                <p style="margin:8px 0 0;font-size:15px;">${{ number_format($order->total, 2) }} paid</p>
            </div>

            <div style="padding:28px;">
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                    <tr>
                        <td style="padding:6px 0;color:#64748b;width:120px;">Customer</td>
                        <td style="padding:6px 0;color:#334155;">{{ $order->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#64748b;">Email</td>
                        <td style="padding:6px 0;color:#334155;">{{ $order->email }}</td>
                    </tr>
                    @if($order->address)
                        <tr>
                            <td style="padding:6px 0;color:#64748b;">Deliver to</td>
                            <td style="padding:6px 0;color:#334155;">
                                {{ $order->address }}@if($order->city), {{ $order->city }}@endif @if($order->zip) {{ $order->zip }}@endif
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <td style="padding:6px 0;color:#64748b;">Placed</td>
                        <td style="padding:6px 0;color:#334155;">{{ $order->created_at->format('j M Y, g:ia') }}</td>
                    </tr>
                </table>

                <table style="width:100%;border-collapse:collapse;">
                    @foreach($order->items as $item)
                        <tr>
                            <td style="padding:8px 0;border-bottom:1px solid #e8eef3;color:#334155;">
                                {{ $item['name'] }} <span style="color:#64748b;">&times; {{ $item['quantity'] }}</span>
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
                        <td style="padding:4px 0;text-align:right;color:#64748b;">${{ number_format($order->shipping, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#64748b;">Tax</td>
                        <td style="padding:4px 0;text-align:right;color:#64748b;">${{ number_format($order->tax, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 0 0;font-weight:700;border-top:2px solid #2bb7a7;">Total</td>
                        <td style="padding:12px 0 0;text-align:right;font-weight:700;border-top:2px solid #2bb7a7;">
                            ${{ number_format($order->total, 2) }}
                        </td>
                    </tr>
                </table>

                @if($order->stripe_payment_intent)
                    <p style="color:#64748b;font-size:13px;margin-top:20px;">
                        Stripe payment: {{ $order->stripe_payment_intent }}
                    </p>
                @endif
            </div>
        </div>
    </div>
</body>
</html>
