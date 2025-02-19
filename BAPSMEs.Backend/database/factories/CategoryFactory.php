<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Minerals',
            'description' => 'just a mineral',
        ];
    }

    public function DiasporianServices()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Diaspora';
            $record['description'] = 'diasporian services';
        });
    }

    public function Foodandbeverages()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Food and Beverage';
            $record['description'] = 'local services';
        });
    }

    public function Retail()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Retail';
            $record['description'] = 'local services';
        });
    }

    public function Services()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Services';
            $record['description'] = 'local services';
        });
    }

    public function ProfessionalServices()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Professional Services';
            $record['description'] = 'local services';
        });
    }

    public function CreativeServices()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Creative Services';
            $record['description'] = 'local services';
        });
    }

    public function Education()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Education/Learning';
            $record['description'] = 'local services';
        });
    }

    public function Automotive()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Automotive';
            $record['description'] = 'local services';
        });
    }

    public function HomeImprovement()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Home Improvement';
            $record['description'] = 'local services';
        });
    }

    public function Entertainment()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Entertainment';
            $record['description'] = 'local services';
        });
    }

    public function Health()
    {
        return $this->afterMaking(function ($record) {
            $record['name'] = 'Health';
            $record['description'] = 'local services';
        });
    }
}
