<?php

namespace App\Notifications;

use App\Models\Resena;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewRepliedNotification extends Notification
{
    use Queueable;

    public $replier;
    public $resena;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $replier, Resena $resena)
    {
        $this->replier = $replier;
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
            'type' => 'review_replied',
            'replier_id' => $this->replier->id,
            'replier_name' => $this->replier->name,
            'replier_avatar' => $this->replier->avatar,
            'resena_id' => $this->resena->id,
            'pelicula_id' => $this->resena->pelicula_id,
            'message' => "{$this->replier->name} ha respondido a tu reseña de {$this->resena->pelicula->titulo}.",
        ];
    }
}
