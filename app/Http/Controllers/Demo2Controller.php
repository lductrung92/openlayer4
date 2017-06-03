<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class Demo2Controller extends Controller
{
    public function data () {
        $query = "SELECT row_to_json(fc)
            FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
            FROM (SELECT 'Feature' As type
                , ST_AsGeoJSON((ST_Union(ST_Simplify(lg.geom,10))))::json As geometry
                , row_to_json((SELECT l FROM (SELECT madonvihan, diadanh, tentinh) As l)) As properties
                FROM public.province1 As lg group by madonvihan, diadanh, tentinh) As f)  As fc";
        $places = DB::select(DB::raw($query));
        return $places[0]->row_to_json;
    }

    public function qhd () {
        $query = "SELECT row_to_json(fc)
            FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
            FROM (SELECT 'Feature' As type
                , ST_AsGeoJSON((ST_Union(ST_Simplify(lg.geom,10))))::json As geometry
                , row_to_json((SELECT l FROM (SELECT madonvihan, diadanh, dientich) As l)) As properties
                FROM public.diaphan_tinh_huednangqnam As lg group by madonvihan, diadanh, dientich) As f)  As fc";
        $places = DB::select(DB::raw($query));
        return $places[0]->row_to_json;
    }

    public function sinhvientheovung () {

        $tinh = DB::table('diaphan_tinh_huednangqnam')
            ->select('madonvihan')
            ->groupBy('madonvihan')
            ->get();

        $arr = array();

        foreach($tinh as $madonvihan) {
            $data = DB::table('diaphan_tinh_huednangqnam')
            ->join('gis_tinh_relationship_tinh_ts', 'gis_tinh_relationship_tinh_ts.madonvihanhchinhtinh', '=', 'diaphan_tinh_huednangqnam.madonvihan')
            ->join('gis_recruitment_source_unit_by_academic_intake_session', 'gis_recruitment_source_unit_by_academic_intake_session.tinh_id', '=', 'gis_tinh_relationship_tinh_ts.tinh_id')
            ->join('gis_academic_intake_session', 'gis_academic_intake_session.academic_intake_id', '=', 'gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id')
            ->join('gis_academic_timespan', 'gis_academic_intake_session.academic_year_timespan_id', '=', 'gis_academic_timespan.timespan_id')
            ->where('diaphan_tinh_huednangqnam.madonvihan', '=', $madonvihan->madonvihan)
            ->select('gis_academic_timespan.timespan_id', DB::raw('count(gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id) as y'))
            ->groupBy('gis_academic_timespan.timespan_id')
            ->orderBy('gis_academic_timespan.timespan_id')
            ->get();
            $arr[$madonvihan->madonvihan] = $data;
        }


        return (($arr));





    }


}
