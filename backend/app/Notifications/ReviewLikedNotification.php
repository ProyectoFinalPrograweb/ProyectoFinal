<?php

namespace App\Notifications;

use App\Models\Resena;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewLikedNotification extends Notification
{
    use Queueable;

    public $liker;
    public $resena;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $liker, Resena $resena)
    {
        $this->liker = $liker;
        $this->resena = $resena;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'review_liked',
            'liker_id' => $this->liker->id,
            'liker_name' => $this->liker->name,
            'liker_avatar' => $this->liker->avatar,
            'resena_id' => $this->resena->id,
            'pelicula_id' => $this->resena->pelicula_id,
            'message' => "A {$this->liker->name} le ha gustado tu reseña de {$this->resena->pelicula->titulo}.",
        ];
    }
}
