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
    .badge-pending { background: #fff4e0; color: #a86b1a; }
    .badge-abandoned { background: #f1f3f5; color: #8a9199; }
    .filters { display: flex; gap: 8px; margin-bottom: 14px; }
    .filters a { padding: 6px 14px; border-radius: 999px; font-size: 0.85rem; text-decoration: none; color: #1e6fa7; border: 1px solid #d6e4f0; }
    .filters a.active { background: #1e6fa7; color: #fff; border-color: #1e6fa7; }
    .stripe-link { font-size: 0.8rem; color: #635bff; text-decoration: none; }
    .badge-ordered { background: #e7effc; color: #2558a8; }
    .badge-shipped { background: #e8f1ff; color: #1b4fa0; }
    .badge-delivered { background: #e6f7f4; color: #1a8a7c; }
    .badge-cancelled { background: #fdecec; color: #b3261e; }
    .fulfil-toggle { margin-top: 8px; background: none; border: 1px solid #d6e4f0; color: #1e6fa7; border-radius: 999px; padding: 4px 12px; font-size: 0.78rem; cursor: pointer; }
    .fulfil-toggle:hover { background: #f0f8ff; }
    .fulfil-row > td { background: #fbfdff; padding-top: 0; }
    .fulfil-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; align-items: end; padding: 14px 0; }
    .fulfil-form label { display: block; font-size: 0.78rem; color: #64748b; margin-bottom: 4px; }
    .fulfil-form input, .fulfil-form select { width: 100%; padding: 8px 10px; border: 1px solid #d6e4f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; }
    .fulfil-form button { background: #1e6fa7; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-weight: 600; cursor: pointer; }
    .fulfil-form button:hover { background: #17588a; }
    .flash { background: #e6f7f4; color: #1a8a7c; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; font-weight: 600; }
    .hint { grid-column: 1 / -1; font-size: 0.78rem; color: #8a9199; margin: 0; }
    @media (max-width: 900px) { .orders-wrapper { padding: 15px; } }
</style>

<div class="orders-wrapper">
    <div class="orders-header">
        <span>Shop Orders</span>
        <small>{{ $orders->count() }} total &middot; ${{ number_format($orders->sum('total'), 2) }}</small>
    </div>
    @if(session('success'))
        <div class="flash">{{ session('success') }}</div>
    @endif
    <div class="filters">
        @foreach(['paid' => 'To fulfil', 'ordered' => 'Ordered', 'shipped' => 'Shipped', 'delivered' => 'Delivered', 'pending' => 'Pending', 'abandoned' => 'Abandoned', 'all' => 'All'] as $key => $label)
            <a href="{{ route('orders.index', $key === 'paid' ? [] : ['status' => $key]) }}"
               class="{{ $status === $key ? 'active' : '' }}">{{ $label }}</a>
        @endforeach
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
                                Ship {{ $order->shipping > 0 ? '$' . number_format($order->shipping, 2) : 'free' }}@if($order->tax > 0) &middot; Tax ${{ number_format($order->tax, 2) }}@endif
                            </span>
                            @if($order->card_last4)<br><span class="muted">Card &bull;&bull;&bull;&bull; {{ $order->card_last4 }}</span>@endif
                        </td>
                        <td>
                            <span class="badge badge-{{ $order->status }}">{{ $order->status }}</span>
                            @if($order->tracking_number)
                                <br><span class="muted">{{ $order->carrier }} {{ $order->tracking_number }}</span>
                            @endif
                            @if($order->supplier_order_ref)
                                <br><span class="muted">Amazon: {{ $order->supplier_order_ref }}</span>
                            @endif
                            @if($order->stripe_payment_intent)
                                <br>
                                <a class="stripe-link" target="_blank" rel="noopener"
                                   href="https://dashboard.stripe.com/payments/{{ $order->stripe_payment_intent }}">
                                    View in Stripe &rarr;
                                </a>
                            @endif
                            @if(in_array($order->status, \App\Models\Order::FULFILMENT_STATUSES))
                                <br>
                                <button type="button" class="fulfil-toggle"
                                        onclick="toggleFulfil({{ $order->id }})">Update fulfilment</button>
                            @endif
                        </td>
                    </tr>
                    @if(in_array($order->status, \App\Models\Order::FULFILMENT_STATUSES))
                        <tr class="fulfil-row" id="fulfil-{{ $order->id }}" style="display:none;">
                            <td colspan="6">
                                <form class="fulfil-form" method="POST" action="{{ route('orders.update', $order->id) }}">
                                    @csrf
                                    @method('PATCH')
                                    <div>
                                        <label>Status</label>
                                        <select name="status">
                                            @foreach(\App\Models\Order::FULFILMENT_STATUSES as $s)
                                                <option value="{{ $s }}" @selected($order->status === $s)>{{ ucfirst($s) }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div>
                                        <label>Amazon order number</label>
                                        <input type="text" name="supplier_order_ref" value="{{ $order->supplier_order_ref }}" placeholder="114-1234567-1234567">
                                    </div>
                                    <div>
                                        <label>Carrier</label>
                                        <input type="text" name="carrier" value="{{ $order->carrier }}" placeholder="UPS / USPS / FedEx / Amazon" list="carriers">
                                        <datalist id="carriers">
                                            <option value="UPS"></option>
                                            <option value="USPS"></option>
                                            <option value="FedEx"></option>
                                            <option value="Amazon"></option>
                                        </datalist>
                                    </div>
                                    <div>
                                        <label>Tracking number</label>
                                        <input type="text" name="tracking_number" value="{{ $order->tracking_number }}">
                                    </div>
                                    <div>
                                        <label>Internal note</label>
                                        <input type="text" name="admin_note" value="{{ $order->admin_note }}" placeholder="Not shown to the customer">
                                    </div>
                                    <div><button type="submit">Save</button></div>
                                    <p class="hint">
                                        Setting the status to <strong>shipped</strong> emails the customer the tracking
                                        number straight away. Saving a shipped order again will not email them twice.
                                    </p>
                                </form>
                            </td>
                        </tr>
                    @endif
                @empty
                    <tr><td colspan="6" style="text-align:center;">No {{ $status === 'all' ? '' : $status }} orders yet.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
function toggleFulfil(id) {
    var row = document.getElementById('fulfil-' + id);
    row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}
</script>
@endsection
