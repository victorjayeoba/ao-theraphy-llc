@extends('layout.sidebar')

@section('content')
@include('layout.header')

<style>
    .orders-wrapper { padding: 30px; margin-top: 40px; max-height: 80vh; overflow-y: auto; }
    .orders-header { color: #1e6fa7; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .orders-header small { color: #888; font-weight: 500; }
    .table-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(30,111,167,0.07); }
    .table-responsive { overflow-x: auto; }
    .orders-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 900px; }
    .orders-table thead { background: linear-gradient(135deg, #1e6fa7, #2bb7a7); color: #fff; }
    .orders-table th, .orders-table td { padding: 14px 12px; font-size: 0.95rem; border-bottom: 1px solid #eef2f7; text-align: left; vertical-align: top; }
    .orders-table tbody tr:hover { background: #f0f8ff; }
    .orders-table ul { margin: 0; padding-left: 18px; }
    .muted { color: #888; font-size: 0.85rem; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; background: #e6f7f4; color: #1a8a7c; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
    @media (max-width: 900px) { .orders-wrapper { padding: 15px; } }
</style>

<div class="orders-wrapper">
    <div class="orders-header">
        <span>Shop Orders</span>
        <small>{{ $orders->count() }} total &middot; ${{ number_format($orders->sum('total'), 2) }}</small>
    </div>
    <div class="table-card">
        <div class="table-responsive">
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Ship to</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                @forelse($orders as $order)
                    <tr>
                        <td>
                            <strong>{{ $order->number }}</strong><br>
                            <span class="muted">{{ $order->created_at->format('M j, Y g:i A') }}</span>
                        </td>
                        <td>
                            {{ $order->name }}<br>
                            <a href="mailto:{{ $order->email }}" class="muted">{{ $order->email }}</a>
                        </td>
                        <td>{{ $order->address }}<br><span class="muted">{{ $order->city }}, {{ $order->zip }}</span></td>
                        <td>
                            <ul>
                            @foreach($order->items as $item)
                                <li>{{ $item['quantity'] }} &times; {{ $item['name'] }} <span class="muted">(${{ number_format($item['price'], 2) }})</span></li>
                            @endforeach
                            </ul>
                        </td>
                        <td>
                            <strong>${{ number_format($order->total, 2) }}</strong><br>
                            <span class="muted">
                                Sub ${{ number_format($order->subtotal, 2) }} &middot;
                                Ship {{ $order->shipping > 0 ? '$' . number_format($order->shipping, 2) : 'free' }} &middot;
                                Tax ${{ number_format($order->tax, 2) }}
                            </span>
                            @if($order->card_last4)<br><span class="muted">Card &bull;&bull;&bull;&bull; {{ $order->card_last4 }}</span>@endif
                        </td>
                        <td><span class="badge">{{ $order->status }}</span></td>
                    </tr>
                @empty
                    <tr><td colspan="6" style="text-align:center;">No orders yet.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
