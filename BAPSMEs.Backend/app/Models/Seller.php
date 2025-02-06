<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bankDetails()
    {
        return $this->hasMany(BankDetail::class);
    }

    public function userPackage()
    {
        return $this->hasOne(UserPackage::class, 'user_id', 'user_id');
    }

    public function package()
    {
        return $this->hasOneThrough(Package::class, UserPackage::class, 'user_id', 'id', 'user_id', 'package_id');
    }

    // public function bankDetails()
    // {
    //     return $this->hasOne(BankDetail::class, 'user_id', 'user_id');
    // }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'user_packages', 'user_id', 'package_id', 'user_id');
    }
}
