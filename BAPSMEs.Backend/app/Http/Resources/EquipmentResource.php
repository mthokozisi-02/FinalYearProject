<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
             'id' => $this->id,
             'name' => $this->name,
             'brand' => $this->brand,
             'description' => $this->description, 
             'category' => $this->category,
             'prize' => $this->prize,
             'created_by' => $this->created_by,
             'photo_url' => $this->photo_url,
        ];
    }
}
