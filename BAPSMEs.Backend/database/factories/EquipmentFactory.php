<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'brand' => fake()->company(),
            'description' => fake()->sentence(),
            'category' => fake()->sentence(),
            'prize' => $this->faker->numberBetween(1, 100000),
            'created_by' => fake()->sentence(),
            'photo_url' => fake()->sentence()
        ];
    }
}
