<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Database\Factories\SubCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{

    /** @use HasFactory<SubCategoryFactory> */
    use HasFactory;

    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

}
