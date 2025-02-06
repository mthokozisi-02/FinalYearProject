<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_products')->withPivot('quantity', 'price');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // public function subOrders()
    // {
    //     return $this->hasMany(SubOrder::class);
    // }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function subOrders()
    {
        return $this->hasMany(SubOrder::class, 'order_id', 'id');
    }

}
