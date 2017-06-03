<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class AjaxDataController extends Controller
{

    public function getDataChart() {
        $list_id_tinh = DB::table('gis_tinh_relationship_tinh_ts')
            ->select('madonvihanhchinhtinh', 'tinh_id')
            ->get();

        $arr = array();

        foreach($list_id_tinh as $item) {
            $student_candidate = DB::table('gis_recruitment_source_unit_by_academic_intake_session')
            ->join('gis_academic_intake_session', 'gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id', '=', 'gis_academic_intake_session.academic_intake_id')
            ->join('gis_academic_timespan', 'gis_academic_intake_session.academic_year_timespan_id', '=', 'gis_academic_timespan.timespan_id')
            ->where('gis_recruitment_source_unit_by_academic_intake_session.tinh_id', '=', $item->tinh_id)
            ->select('gis_academic_timespan.timespan_id', DB::raw('count(gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id) as y'))
            ->groupBy('gis_academic_timespan.timespan_id')
            ->get();
            $arr[$item->madonvihanhchinhtinh] = $student_candidate;
        }
        return (($arr));
    }

    public function danhsachtinh () {
        $data = DB::table('gis_tinh')
                    ->select('madonvihanhchinhtinh', 'diadanh')
                    ->orderBy('diadanh')
                    ->distinct()
                    ->get();
        $arr = [];
        for($i=0; $i<count($data);$i++) {
            array_push($arr, [$data[$i]->madonvihanhchinhtinh, $data[$i]->diadanh]);
        }
        return json_encode($arr);
    }

    public function danhsachnam () {
        $data = DB::table('gis_academic_timespan')
                    ->select('academic_timespan_name', 'timespan_id')
                    ->distinct()
                    ->orderBy('timespan_id')
                    ->get();
        $arr = [];
        for($i=0; $i<count($data);$i++) {
            array_push($arr, [$data[$i]->timespan_id, $data[$i]->academic_timespan_name]);
        }
        return json_encode($arr);
    }

    public function admission_type () {
        $data = DB::table('gis_admission_type')
                    ->select('admission_type_name', 'admission_type_id')
                    ->distinct()
                    ->orderBy('admission_type_id')
                    ->get();
        $arr = [];
        for($i=0; $i<count($data);$i++) {
            array_push($arr, [$data[$i]->admission_type_id, $data[$i]->admission_type_name]);
        }
        return json_encode($arr);
    }

    public function filter (Request $request) {
        if($request->field_tinh != 0){
            $list_id_tinh = DB::table('gis_tinh_relationship_tinh_ts')
            ->where('madonvihanhchinhtinh', '=', $request->field_tinh)
            ->select('madonvihanhchinhtinh', 'tinh_id')
            ->get();

            $arr = array();

            foreach($list_id_tinh as $item) {
                $student_candidate = DB::table('gis_recruitment_source_unit_by_academic_intake_session')
                ->join('gis_academic_intake_session', 'gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id', '=', 'gis_academic_intake_session.academic_intake_id')
                ->join('gis_academic_timespan', 'gis_academic_intake_session.academic_year_timespan_id', '=', 'gis_academic_timespan.timespan_id')
                ->where('gis_recruitment_source_unit_by_academic_intake_session.tinh_id', '=', $item->tinh_id)
                ->select('gis_academic_timespan.timespan_id', DB::raw('count(gis_recruitment_source_unit_by_academic_intake_session.academic_intake_id) as y'))
                ->groupBy('gis_academic_timespan.timespan_id')
                ->get();
                $arr[$item->madonvihanhchinhtinh] = $student_candidate;
            }
            return (($arr));
        }
    }

}
