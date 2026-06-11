<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConsultationAdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $consultation;

    public function __construct($consultation)
    {
        $this->consultation = $consultation;
    }

    public function build()
    {
        return $this->subject('New Consultation Request — ' . $this->consultation->first_name . ' ' . $this->consultation->last_name)
                    ->replyTo($this->consultation->email, $this->consultation->first_name . ' ' . $this->consultation->last_name)
                    ->view('email.consultation_admin_notification')
                    ->with([
                        'consultation' => $this->consultation
                    ]);
    }
}
