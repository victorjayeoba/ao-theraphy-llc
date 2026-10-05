<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderAdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject("New order {$this->order->number} — \${$this->order->total}")
                    ->view('email.order_admin_notification')
                    ->with(['order' => $this->order]);
    }
}
