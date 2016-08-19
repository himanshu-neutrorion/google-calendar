<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;



class UserController extends Controller
{

    public function googleLogin(Request $request)  {



        define('SCOPES', implode(' ', array(
                \Google_Service_Calendar::CALENDAR)
        ));
        $google_redirect_url = route('glogin');
        $gClient = new \Google_Client();
        $gClient->setApplicationName(config('google.app_name'));
        $gClient->setClientId(config('google.client_id'));
        $gClient->setClientSecret(config('google.client_secret'));
        $gClient->setRedirectUri($google_redirect_url);
        $gClient->setDeveloperKey(config('google.api_key'));
        $gClient->setScopes(SCOPES);
//        $gClient->setAccessType('offline');
//        $gClient->setScopes(array(
//            'https://www.googleapis.com/auth/plus.me',
//            'https://www.googleapis.com/auth/userinfo.email',
//            'https://www.googleapis.com/auth/userinfo.profile',
//        ));
        $google_oauthV2 = new \Google_Service_Oauth2($gClient);
        
        if ($request->get('code')){
            $gClient->authenticate($request->get('code'));
            $request->session()->put('token', $gClient->getAccessToken());
        }
        if ($request->session()->get('token'))
        {
            $gClient->setAccessToken($request->session()->get('token'));
        }
        if ($gClient->getAccessToken())
        {
            //For logged in user, get details from google using access token

            $service = new \Google_Service_Calendar($gClient);
            $calendarId = 'primary';
            $optParams = array(
                'maxResults' => 10,
                'orderBy' => 'startTime',
                'singleEvents' => TRUE,
                'timeMin' => date('c'),
            );
            $results = $service->events->listEvents($calendarId, $optParams);

            if (count($results->getItems()) == 0) {
                print "No upcoming events found.\n";
            } else {
                print "Upcoming events:\n";
                foreach ($results->getItems() as $event) {
                    $start = $event->start->dateTime;
                    if (empty($start)) {
                        $start = $event->start->date;
                    }
                    printf("%s (%s)\n", $event->getSummary(), $start);
                }
            }

            $this->calendar($service);

        } else
        {

            $authUrl = $gClient->createAuthUrl();
            return redirect()->to($authUrl);
        }
    }

    public function calendar($service){
        $event = new \Google_Service_Calendar_Event(array(
            'summary' => 'NextMail Exercise for founding Engineer',
            'location' => 'San Fransico',
            'description' => 'Chance to be a part of revolutionary Email team',
            'start' => array(
                'dateTime' => '2016-08-24T09:00:00-07:00',
                'timeZone' => 'America/Los_Angeles',
            ),
            'end' => array(
                'dateTime' => '2016-08-25T17:00:00-07:00',
                'timeZone' => 'America/Los_Angeles',
            ),
//            'recurrence' => array(
//                'RRULE:FREQ=DAILY;COUNT=2'
//            ),
            'attendees' => array(
                array('email' => 'himanshu.dadhich@easyecom.in'),
                array('email' => 'ratidadhich@gmail.com'),
            ),
            'reminders' => array(
                'useDefault' => FALSE,
                'overrides' => array(
                    array('method' => 'email', 'minutes' => 24 * 60),
                    array('method' => 'popup', 'minutes' => 10),
                ),
            ),

        ));
        $optParams = Array(
            'sendNotifications' => true,
        );
        $calendarId = 'primary';

        $event = $service->events->insert($calendarId, $event,$optParams);
        printf('Event created: %s\n', $event->htmlLink);
    }

}
