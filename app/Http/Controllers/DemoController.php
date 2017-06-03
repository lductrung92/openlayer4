<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class DemoController extends Controller
{
    public function index ($tinh) {

        $t = "SELECT json_build_object(
                'type', 'FeatureCollection',
                'crs',  json_build_object(
                    'type',      'name',
                    'properties', json_build_object(
                        'name', 'EPSG:4326')),
                'features', json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'id',         id,
                        'geometry',   ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            'point_type', point_type
                        )
                    )
                )
            )
            FROM test_geoms";

       $query1 = "SELECT row_to_json(fc)
            FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
            FROM (SELECT 'Feature' As type
                , ST_AsGeoJSON(lg.geom,4)::json As geometry
                , row_to_json((SELECT l FROM (SELECT gid, ma_truong, ten_truong ) As l)) As properties
                FROM public.gis_thpt_merge As lg WHERE lg.gid='1') As f )  As fc";




      $query = "SELECT row_to_json(fc)
            FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
            FROM (SELECT 'Feature' As type
                , ST_AsGeoJSON(lg.recruitment_source_unit_geometry,4)::json As geometry
                , row_to_json((SELECT l FROM (SELECT recruitment_source_unit_id, tinh_id, recruitment_source_unit_name) As l)) As properties
                FROM public.gis_recruitment_source_unit As lg WHERE lg.tinh_id='".$tinh."') As f)  As fc";

      $places = DB::select(DB::raw($query));
      return $places[0]->row_to_json;
    }

    public function data () {
        $query = "SELECT row_to_json(fc)
            FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
            FROM (SELECT 'Feature' As type
                , ST_AsGeoJSON(lg.recruitment_source_unit_geometry,4)::json As geometry
                , row_to_json((SELECT l FROM (SELECT recruitment_source_unit_id, tinh_id, recruitment_source_unit_name) As l)) As properties
                FROM public.gis_recruitment_source_unit As lg) As f)  As fc";
        $places = DB::select(DB::raw($query));
        return $places[0]->row_to_json;
    }


    public function danhsachtinh () {
        $query = "SELECT DISTINCT tinh_id,city FROM gis_recruitment_source_unit WHERE tinh_id IS NOT NULL";
        $places = DB::select($query);
        $arr = [];
        for($i=0; $i<count($places);$i++) {
            array_push($arr, [$places[$i]->tinh_id, $places[$i]->city]);
        }
        return json_encode($arr);
    }

    public function thongtintruong ($id) {

        $result = DB::table('gis_recruitment_source_unit')
                    ->join('gis_student_candidate_by_academic_intake_session', 'gis_recruitment_source_unit.recruitment_source_unit_id', '=', 'gis_student_candidate_by_academic_intake_session.recruitment_source_unit_id')
                    ->where('gis_recruitment_source_unit.recruitment_source_unit_id', '=', $id)
                    ->select('gis_recruitment_source_unit.recruitment_source_unit_name as ten_truong', 'gis_recruitment_source_unit.district as duong', 'gis_recruitment_source_unit.city as thanh_pho','gis_student_candidate_by_academic_intake_session.recruitment_source_unit_id as id',DB::raw('count(gis_student_candidate_by_academic_intake_session.recruitment_source_unit_id)'))
                    ->groupBy('gis_student_candidate_by_academic_intake_session.recruitment_source_unit_id','gis_recruitment_source_unit.recruitment_source_unit_name', 'gis_recruitment_source_unit.district', 'gis_recruitment_source_unit.city')
                    ->get();

       $data_chart = DB::table('gis_student_candidate_by_academic_intake_session')
                    ->join('gis_academic_intake_session', 'gis_academic_intake_session.academic_intake_id', '=', 'gis_student_candidate_by_academic_intake_session.academic_intake_id')
                    ->join('gis_academic_timespan', 'gis_academic_timespan.timespan_id', 'gis_academic_intake_session.academic_year_timespan_id')
                    ->where('gis_student_candidate_by_academic_intake_session.recruitment_source_unit_id', '=', $id)
                    ->select('gis_academic_timespan.academic_timespan_name as nam', DB::raw('count(gis_academic_intake_session.academic_intake_id)'))
                    ->groupBy('gis_academic_timespan.academic_timespan_name')
                    ->get();

        $arr = ['thongtin' => $result, 'data' => $data_chart];

        return json_encode($arr);
    }

}
