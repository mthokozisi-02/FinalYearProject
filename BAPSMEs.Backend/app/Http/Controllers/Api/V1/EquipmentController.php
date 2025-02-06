<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Equipment;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentResource;
use Illuminate\Support\Facades\Log;

class EquipmentController extends Controller
{
    function search($name)
    {
        Log::info('Search value '. $name);
        $equipment = Equipment::where('name',$name)->get();
        return response()->json($equipment);
    }
    
    
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EquipmentResource::collection(Equipment::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentRequest $request)
    {
        Log::info('My request object :', $request->all());
        if ($request->hasFile('image')) {
            Log::info('Image upload initiated');
            $image = $request->file('image');
            $destinationPath = public_path('images');
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            $public_url = url('images/' . $imageName);

            Log::info('Public url for image '.  $public_url);
            $image->move($destinationPath, $imageName);

            $request->merge(['photo_url' => $public_url]);
        }

        Log::info('request object again :',  $request->all());

        $equipment = Equipment::create($request->all());
        
        Log::info('Equipment object :' .  $equipment);

        return EquipmentResource::make($equipment); 
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        return EquipmentResource::make($equipment);
    }

    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        $equipment->update($request->validated());

        return EquipmentResource::make($equipment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return response()->noContent();
    }
}
