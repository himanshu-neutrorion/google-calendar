<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;

define('SCOPES', implode(' ', array(
        \Google_Service_Calendar::CALENDAR)
));
define('CREDENTIALS_PATH', __DIR__ . '/../../../calendar-credentials.json');

class UserController extends Controller
{

    public static function googleLogin(Request $request)  {
        $google_redirect_url = route('list');
        $gClient = new \Google_Client();
        $gClient->setApplicationName(config('google.app_name'));
        $gClient->setClientId(config('google.client_id'));
        $gClient->setClientSecret(config('google.client_secret'));
        $gClient->setRedirectUri($google_redirect_url);
        $gClient->setDeveloperKey(config('google.api_key'));
        $gClient->setScopes(SCOPES);
       $gClient->setAccessType('offline');
//        $gClient->setScopes(array(
//            'https://www.googleapis.com/auth/plus.me',
//            'https://www.googleapis.com/auth/userinfo.email',
//            'https://www.googleapis.com/auth/userinfo.profile',
//        ));
//        $google_oauthV2 = new \Google_Service_Oauth2($gClient);
        // Load previously authorized credentials from a file.
        $credentialsPath =self::expandHomeDirectory(CREDENTIALS_PATH);
        if (file_exists($credentialsPath)) {
            $accessToken = json_decode(file_get_contents($credentialsPath), true);
            $gClient->setAccessToken($accessToken);
        }
        else
            if($request->has('code'))
                if ($request->get('code')){
                    $authCode = $request->get('code');
                    $accessToken = $gClient->fetchAccessTokenWithAuthCode($authCode);
                    $gClient->authenticate($request->get('code'));
                    if(!file_exists(dirname($credentialsPath))) {
                        mkdir(dirname($credentialsPath), 0700, true);
                    }
                    file_put_contents($credentialsPath, json_encode($accessToken));
                    $gClient->setAccessToken($accessToken);
//            $request->session()->put('token', $gClient->getAccessToken());
                }
//        if ($request->session()->get('token'))
//        {
//            $gClient->setAccessToken($request->session()->get('token'));
//        }

        if ($gClient->getAccessToken())
        {
            // Refresh the token if it's expired.
            if ($gClient->isAccessTokenExpired()) {
                $refreshToken = json_decode($gClient->getRefreshToken());
                $gClient->fetchAccessTokenWithRefreshToken($refreshToken);
                $accessToken = $gClient->getAccessToken();
                $accessToken['refresh_token'] = $refreshToken;
                file_put_contents($credentialsPath, json_encode($accessToken));
            }

            return $gClient;

        } else
        {

            $authUrl = $gClient->createAuthUrl();
            return redirect()->to($authUrl);
        }
        return $gClient;
    }

   static function expandHomeDirectory($path) {
        $homeDirectory = getenv('HOME');
        if (empty($homeDirectory)) {
            $homeDirectory = getenv('HOMEDRIVE') . getenv('HOMEPATH');
        }
        return str_replace('~', realpath($homeDirectory), $path);
    }



}
