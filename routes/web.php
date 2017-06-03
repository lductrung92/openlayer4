<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


// Demo 01
Route::get('extjs', function () {
    return view('ext-demo');
});
Route::get('data/tinh/{tinh}', 'DemoController@index');
Route::get('data/tinh', 'DemoController@data');
Route::get('danhsachtinh', 'DemoController@danhsachtinh');
Route::get('thongtintruong/{id}', 'DemoController@thongtintruong');

// Demo02

Route::get('extjs02', function () {
    return view('ext-demo2');
});

Route::get('data/vietnam', 'Demo2Controller@data');
Route::get('data/qhd', 'Demo2Controller@qhd');
Route::get('data/sinhvientheovung', 'Demo2Controller@sinhvientheovung');

// Thống kê sinh viên tỉnh thành
Route::get('tksvtt', 'TKSVTTController@index');
Route::get('data/tksvtt', 'TKSVTTController@dataTinh');

Route::get('ajax/danhsachtinh', 'AjaxDataController@danhsachtinh');
Route::get('ajax/danhsachnam', 'AjaxDataController@danhsachnam');
Route::get('ajax/admission_type', 'AjaxDataController@admission_type');

Route::get('ajax/data_chart', 'AjaxDataController@getDataChart');
Route::get('ajax/field', 'AjaxDataController@filter');



