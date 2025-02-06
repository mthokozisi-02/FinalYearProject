<?php

namespace App\Models;

use Database\Factories\PackageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{

    /** @use HasFactory<PackageFactory> */
    use HasFactory;

    protected $guarded = [];

    public function users()
    {
        return $this->hasManyThrough(User::class, UserPackage::class, 'package_id', 'id', 'id', 'user_id');
    }

    public function userPackages()
    {
        return $this->hasMany(UserPackage::class);
    }
}
