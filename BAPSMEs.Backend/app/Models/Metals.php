<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metals extends Model
{
    /** @use HasFactory<\Database\Factories\MetalsFactory> */
    use HasFactory;

    protected $fillable = ['name', 'buying_price', 'quantity', 'description', 'created_by'];
}
