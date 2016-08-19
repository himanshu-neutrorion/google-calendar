<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Services\GoogleCalendar;

class CalendarController extends Controller
{
    public function calendar()
    {
        $calendar = new GoogleCalendar;
        $calendarId = "YourCalendarID";
        $result = $calendar->get($calendarId);
    }
}
