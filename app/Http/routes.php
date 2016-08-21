<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
use Illuminate\Http\Request;
Route::get('/', function () {
    return view('welcome');
});

Route::get('login',array('as'=>'login',function(Request $request){
    $file = __DIR__ . '/../../calendar-credentials.json';
    if(file_exists($file)){
        unlink($file);
    }
    $gClient = \App\Http\Controllers\UserController::googleLogin($request);
    if(is_a($gClient,'Illuminate\Http\RedirectResponse')){
        return $gClient;
    }
}));
Route::get('list',array('as'=>'list','middleware' => 'cors', 'uses'=>'CalendarController@listEvents')) ;
Route::get('createEvent',array('as'=>'createEvent','middleware' => 'cors', 'uses'=>'CalendarController@createCalendarEvent')) ;
Route::get('calendar',array('as'=>'calendar','middleware' => 'cors',function(){
    require_once __DIR__.'/../../resources/views/calendar/index.html';
}));

//Route::get('fetch',array('as'=>'createEvent','middleware' => 'cors', 'uses'=>'CalendarController@fetchEvent')) ;

Route::get('logout',array('as'=>'logout',function(){
    $file = __DIR__ . '/../../calendar-credentials.json';
    if(file_exists($file)){
        unlink($file);
    }
    return view('welcome');

}));
Route::get('return',array('as'=>'return','middleware' => 'cors', 'uses'=>'UserController@returns')) ;