<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/connect/google' => [[['_route' => 'connect_google', '_controller' => 'App\\Controller\\GoogleOAuthController::connectGoogle'], null, null, null, false, false, null]],
        '/connect/google/check' => [[['_route' => 'connect_google_check', '_controller' => 'App\\Controller\\GoogleOAuthController::connectGoogleCheck'], null, null, null, false, false, null]],
        '/api/user/register' => [[['_route' => 'user_add', '_controller' => 'App\\Controller\\UserController::register'], null, ['POST' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/login' => [[['_route' => 'user_validate', '_controller' => 'App\\Controller\\UserController::login'], null, ['POST' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/get' => [[['_route' => 'user_get', '_controller' => 'App\\Controller\\UserController::getByToken'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/validate' => [[['_route' => 'user_valid', '_controller' => 'App\\Controller\\UserController::validateUser'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [
            [['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
