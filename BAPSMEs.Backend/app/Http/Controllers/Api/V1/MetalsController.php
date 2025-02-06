<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Metals;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMetalsRequest;
use App\Http\Requests\UpdateMetalsRequest;
use App\Http\Resources\MetalsResource;

class MetalsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MetalsResource::collection(Metals::all());
    }
  

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMetalsRequest $request)
    {
        $metals = Metals::create($request->validated());

        return MetalsResource::make($metals);

    }

    /**
     * Display the specified resource.
     */
    public function show(Metals $metals)
    {
        return MetalsResource::make($metals); 
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMetalsRequest $request, Metals $metals)
    {
        $metals->update($request->validated());

        return MetalsResource::make($metals);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Metals $metals)
    {
        $metals->delete();

        return response()->noContent(); 
    }
}
