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
            'summary' => $request->title,#'NextMail Exercise for founding Engineer',
            'location' => $request->location,#'San Fransico',
            'description' => $request->description,#'Chance to be a part of revolutionary Email team',
            'start' => array(
                'dateTime' => $request->start_date,#'2016-08-24T09:00:00-07:00',
                'timeZone' => 'America/Los_Angeles',
            ),
            'end' => array(
                'dateTime' => $request->end_date,#'2016-08-25T17:00:00-07:00',
                'timeZone' => 'America/Los_Angeles',
            ),
//            'recurrence' => array(
//                'RRULE:FREQ=DAILY;COUNT=2'
//            ),
            'attendees' => array(
                array('email' => $request->email)#'1990.himanshu@gmail.com'),
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
        return $event->htmlLink;
    }

    public function listEvents(Request $request){
        $gClient =UserController::googleLogin($request);
        if(is_a($gClient,'Illuminate\Http\RedirectResponse')){
            return $gClient;
        }
        $service = new \Google_Service_Calendar($gClient);
        $calendarId = 'primary';
        $optParams = array(
            // 'maxResults' => 10,
            'orderBy' => 'startTime',
            'singleEvents' => TRUE,
            'timeMin' => date('c'),
        );
        $results = $service->events->listEvents($calendarId, $optParams);
        // echo "<PRE>";
// print_r ($results);
        $i=0;
        foreach ($results->getItems() as $event) {

            $start = $event->start->dateTime;
            if (empty($start)) {
                $start = $event->start->date;
            }
            $end = $event->end->dateTime;
            if (empty($end)) {
                $end = $event->end->date;
            }
            $summary = $event->getSummary();

            $events[$i]['start']= $start;
            $events[$i]['end']=$end;
            $events[$i]['summary']=$summary;
            $i++;

        }
        echo json_encode($events);


        // $this->createCalendarEvent($request);
    }
}
