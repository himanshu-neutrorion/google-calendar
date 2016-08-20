<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Services\GoogleCalendar;

class CalendarController extends Controller
{
    public function createCalendarEvent(Request $request){
        $gClient =UserController::googleLogin($request);
        if(is_a($gClient,'Illuminate\Http\RedirectResponse')){
            return $gClient;
        }
        $service = new \Google_Service_Calendar($gClient);
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
                array('email' => '1990.himanshu@gmail.com'),
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

    public function listEvents(Request $request){
        $gClient =UserController::googleLogin($request);
        if(is_a($gClient,'Illuminate\Http\RedirectResponse')){
            return $gClient;
        }
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

        // $this->createCalendarEvent($request);
    }
}
