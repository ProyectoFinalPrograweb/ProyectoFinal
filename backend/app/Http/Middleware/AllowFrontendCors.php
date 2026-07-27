<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowFrontendCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredFrontend = rtrim((string) config('app.frontend_url'), '/');
        $configuredApp = rtrim((string) config('app.url'), '/');
        $allowedOrigins = array_values(array_filter([
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            $configuredFrontend,
            $configuredApp,
        ]));
        $origin = $request->headers->get('Origin', 'http://127.0.0.1:5173');

        $headers = [
            'Access-Control-Allow-Origin' => in_array($origin, $allowedOrigins, true) ? $origin : 'http://127.0.0.1:5173',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept',
        ];

        if ($request->isMethod('OPTIONS')) {
            return response('', 204, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
