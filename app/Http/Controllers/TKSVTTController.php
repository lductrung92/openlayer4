<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class TKSVTTController extends Controller
{
    public function index() {
        return view('tksvtt');
    }

    public function dataTinh () {
        $query = "SELECT row_to_json(fc)
					FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
					FROM (SELECT 'Feature' As type,
					ST_AsGeoJSON(ST_Centroid(ST_Union(lg.geometry_tinh)))::json As geometry,
					(
						select row_to_json(t)
						from (select  madonvihanhchinhtinh,diadanh) t
					)
					As properties
					FROM gis_tinh as lg group by madonvihanhchinhtinh,diadanh ) As f )  As fc";
        $places = DB::select(DB::raw($query));
        return $places[0]->row_to_json;
    }
}
