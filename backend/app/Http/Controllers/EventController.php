<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Event;
use App\Models\Category;
use App\Models\Location;

class EventController extends Controller
{
   public function index(Request $request)
{
    try {
        $perPage = 10;
        // Dohvat parametara
        $page = $request->query('page', 1);
        $filter = $request->query('filter'); // Za filtriranje po nazivu
        $sort = $request->query('sort', 'name_asc'); // Za sortiranje

        // 1. Inicijalizacija Query Builder-a sa JOIN-ovima i selekcijom kolona
        $query = DB::table('events as e')
            ->select(
                'e.id', 
                'e.place', 
                'e.event', 
                'e.event_start', 
                'e.image', 
                'l.adress', 
                'c.name as category'
            )
            ->join('locations as l', 'e.location_id', '=', 'l.id')
            ->join('categories as c', 'e.category_id', '=', 'c.id');

        // 2. Primena Filter uslova
        if ($filter) {
            // Dodaje WHERE e.event LIKE '%filter_value%'
            $query->where('e.event', 'LIKE', "%{$filter}%");
        }

        // 3. Primena Sortiranja
        if($sort=='name_desc'){
            $query->orderBy('e.event', 'DESC');
        }
        else{
         $query->orderBy('e.event', 'ASC');
        }

        // 4. Brojanje ukupnog broja rezultata (sa filterom, bez LIMIT/OFFSET)
        $total = $query->count();
        $offset = ($page - 1) * $perPage;

        // 5. Primena Paginacije (LIMIT/OFFSET)
        $events = $query->offset($offset)->limit($perPage)->get();

        return response()->json([
            'current_page' => (int) $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage),
            'data' => $events,
        ]);

    } catch (\Throwable $e) {
        return response()->json([
            'error' => true,
            'message' => 'Greška prilikom dohvatanja događaja.',
            'details' => $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        try {
            $event = DB::select(
                'SELECT e.id, e.place, e.event, e.event_start, e.image, l.adress, c.name as category 
                 FROM events e 
                 JOIN locations l ON e.location_id = l.id 
                 JOIN categories c ON e.category_id = c.id 
                 WHERE e.id = ?', 
                [$id]
            );
            return response()->json($event);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Greska prilikom prikaza dogadjaja.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = DB::delete('DELETE FROM events WHERE id = ?', [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Događaj obrisan']);
            } else {
                return response()->json(['error' => 'Događaj nije pronađen'], 404);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Greska prilikom brisanja dogadjaja.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'event' => 'required|string|max:255',
                'place' => 'required|string|max:255',
                'event_start' => 'required|date',
                'category' => 'required|string',
                'location' => 'required|string',
                'image' => 'nullable|string|max:255',
            ]);

            $category = Category::firstOrCreate(['name' => $validated['category']]);
            $location = Location::firstOrCreate(['adress' => $validated['location']]);

            $event = Event::firstOrCreate([
                'event' => $validated['event'],
                'place' => $validated['place'],
                'event_start' => $validated['event_start'],
                'image' => $validated['image'] ?? null,
                'category_id' => $category->id,
                'location_id' => $location->id,
            ]);

            return response()->json(['message' => 'Događaj kreiran', 'event' => $event], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Greska prilikom kreiranja dogadjaja.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $event = Event::findOrFail($id);

            $validated = $request->validate([
                'event' => 'sometimes|required|string|max:255',
                'place' => 'sometimes|required|string|max:255',
                'event_start' => 'sometimes|required|date',
                'category' => 'sometimes|required|string',
                'location' => 'sometimes|required|string',
                'image' => 'nullable|string|max:255',
            ]);

            if (isset($validated['category'])) {
                $category = Category::firstOrCreate(['name' => $validated['category']]);
                $event->category_id = $category->id;
            }

            if (isset($validated['location'])) {
                $location = Location::firstOrCreate(['adress' => $validated['location']]);
                $event->location_id = $location->id;
            }

            $event->fill($validated);
            $event->save();

            return response()->json(['message' => 'Događaj ažuriran', 'event' => $event]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Greska prilikom ažuriranja dogadjaja.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function showByCategory($categoryName)
    {
        try {
            $category = Category::where('name', $categoryName)->first();

            if (!$category) {
                return response()->json(['message' => 'Kategorija nije pronađena'], 404);
            }

            $event = DB::select(
                'SELECT e.id, e.place, e.event, e.event_start, e.image, l.adress, c.name as category 
                 FROM events e 
                 JOIN locations l ON e.location_id = l.id 
                 JOIN categories c ON e.category_id = c.id 
                 WHERE e.category_id = ?', 
                [$category->id]
            );

            return response()->json($event);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Greska prilikom prikaza dogadjaja po kategoriji.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
