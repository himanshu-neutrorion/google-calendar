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

Route::get('/', function () {
    return view('welcome');
});
Route::get('glogin',array('as'=>'glogin','uses'=>'UserController@googleLogin')) ;
Route::get('google-user',array('as'=>'user.glist','uses'=>'UserController@listGoogleUser')) ;
Route::get('calendar',array('as'=>'calendar','uses' => 'UserController@calendar'));
//Route::get('glogin',array('as'=>'glogin','uses'=>function(){
//    $gClientController = new \App\Http\Controllers\UserController();
//    $gclient = $gClientController->googleLogin();
//    print_r($gclient);
//}));
//Route::get('calendar/{glogin}',array('as'=>'calendar',function($glogin){
//    print_r($glogin);
//    return "Successful";
//}));