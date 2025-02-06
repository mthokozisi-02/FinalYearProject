<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userPackage()
    {
        return $this->hasOne(UserPackage::class);
    }

    public function seller()
    {
        return $this->hasOne(Seller::class);
    }

    public function buyer()
    {
        return $this->hasOne(Buyer::class);
    }

    public function bankDetails()
    {
        return $this->hasMany(BankDetail::class);
    }

    // public function bankDetails()
    // {
    //     return $this->hasOne(BankDetail::class, 'user_id', 'id');
    // }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'user_packages');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'buyer_id');
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class, 'seller_id', 'id');
    }
}
