<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Configure route-specific middleware.
     */
    protected function configureRouteMiddleware(Router $router): void
    {
        // Register your custom middleware alias
        $router->aliasMiddleware('role', \App\Http\Middleware\RoleMiddleware::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        parent::boot();

        // Configure route middleware
        $this->configureRouteMiddleware(app(Router::class));
    }
}
