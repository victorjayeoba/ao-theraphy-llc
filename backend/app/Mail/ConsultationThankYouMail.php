<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConsultationThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public $consultation;

    public function __construct($consultation)
    {
        $this->consultation = $consultation;
    }

    public function build()
    {
        return $this->subject('Thank You For Your Consultation Request')
                    ->view('email.consultation_thankyou')
                    ->with([
                        'consultation' => $this->consultation
                    ]);
    }
}
