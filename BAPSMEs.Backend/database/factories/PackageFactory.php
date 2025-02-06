<?php

namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Basic',
            'description' => 'A package for small-sized enterprises.',
            'price' => 39,
            'number_of_products' => 30
        ];
    }

    public function basic()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Basic';
            $record['description'] = 'A package for small-sized enterprises.';
            $record['price'] = 39;
            $record['number_of_products'] = 30;
        });
    }

    public function premium()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Premium';
            $record['description'] = 'A package for medium-sized enterprises.';
            $record['price'] = 69;
            $record['number_of_products'] = 50;
        });
    }
    public function advanced()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Advanced';
            $record['description'] = 'A package for large-sized enterprises.';
            $record['price'] = 99;
            $record['number_of_products'] = 80;
        });
    }
}
