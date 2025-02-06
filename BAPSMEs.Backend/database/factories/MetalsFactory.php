<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Metals>
 */
class MetalsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' =>fake()->word(),
            'buying_price' => $this->faker->numberBetween(1, 100000),
            'quantity' => $this->faker->numberBetween(1, 100000),
            'description' => $this->faker->numberBetween(1, 100000),
            'created_by' => fake()->sentence(),
        ];
    }
}
