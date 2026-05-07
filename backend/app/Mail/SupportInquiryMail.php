<?php

namespace App\Mail;

use App\Models\Support;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupportInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $support;

    public function __construct(Support $support)
    {
        $this->support = $support;
    }

    public function build()
    {
        return $this->subject('New Support Request')
                    ->view('email.supportmail')
                    ->with([
                        'support' => $this->support, // ✅ THIS FIXES THE ERROR
                    ]);
    }
}
