<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Obtener las notificaciones del usuario autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notificaciones = $user->notifications()->take(50)->get();
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'data' => $notificaciones,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Marcar una notificacion como leida.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notificacion marcada como leida.']);
        }

        return response()->json(['message' => 'Notificacion no encontrada.'], 404);
    }

    /**
     * Marcar todas las notificaciones como leidas.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Todas las notificaciones han sido marcadas como leidas.']);
    }
}
