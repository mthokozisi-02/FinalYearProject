<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    protected $guarded = [];
    
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id', 'id');
    }
}
