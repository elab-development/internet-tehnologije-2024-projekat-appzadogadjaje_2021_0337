<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    public function store(Request $request, $eventId)
    {
        $user = $request->user(); 
        $event = Event::findOrFail($eventId);

        $user->favoriteEvents()->syncWithoutDetaching([$event->id]);

        return response()->json(['message' => 'Događaj je sačuvan u omiljene.']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
    $favorites = DB::table('event_user as eu')
        ->join('events as e', 'eu.event_id', '=', 'e.id')
        ->join('locations as l', 'e.location_id', '=', 'l.id')
        ->join('categories as c', 'e.category_id', '=', 'c.id')
        ->where('eu.user_id', $user->id)
        ->select(
            'e.id',
            'e.event',
            'e.place',
            'e.event_start',
            'e.image',
            'l.adress',
            'c.name as category'
        )
        ->get();

        return response()->json($favorites);
    }

    public function destroy(Request $request, $eventId)
    {
        $user = $request->user();
        $user->favoriteEvents()->detach($eventId);

        return response()->json(['message' => 'Događaj je uklonjen iz omiljenih.']);
    }
}
