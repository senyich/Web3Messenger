<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/message/get' => [[['_route' => 'get_messages', '_controller' => 'App\\Controller\\IPFSMessagesController::get'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/message/add' => [[['_route' => 'add_message', '_controller' => 'App\\Controller\\IPFSMessagesController::add'], null, ['POST' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/register' => [[['_route' => 'user_add', '_controller' => 'App\\Controller\\UserController::register'], null, ['POST' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/login' => [[['_route' => 'user_auth', '_controller' => 'App\\Controller\\UserController::login'], null, ['POST' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/get' => [[['_route' => 'user_get', '_controller' => 'App\\Controller\\UserController::getByToken'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/validate' => [[['_route' => 'user_validate', '_controller' => 'App\\Controller\\UserController::validateUser'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
        '/api/user/find' => [[['_route' => 'user_find', '_controller' => 'App\\Controller\\UserController::getByUsername'], null, ['GET' => 0, 'OPTIONS' => 1], null, false, false, null]],
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
