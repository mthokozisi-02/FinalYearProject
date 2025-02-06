<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubCategory>
 */
class SubCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => 1,
            'name' => 'Minerals',
            'description' => 'just a mineral',
        ];
    }

    public function construction()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 1;
            $record['name'] = 'Construction Services';
            $record['description'] = 'Overseas Zimbabweans build dream homes remotely with professional supervision.';
        });
    }

    public function insurance()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 1;
            $record['name'] = 'Insurance Services';
            $record['description'] = 'Comprehensive protection plans for overseas property investments guaranteed.';
        });
    }

    public function banking()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 1;
            $record['name'] = 'Banking Services';
            $record['description'] = 'Secure international money transfers and account management solutions provided.';
        });
    }

    public function property()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 1;
            $record['name'] = 'Property Management';
            $record['description'] = 'Reliable local care for distant Zimbabwean properties maintained.';
        });
    }

    public function Restaurants()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Restaurants';
            $record['description'] = 'Equipment used to drill holes in the ground for such activities as prospecting.';
            $record['image_url'] = 'subCategories/restaurants.png';
        });
    }
    public function Cafes()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Cafes';
            $record['description'] = 'Equipment used to drill holes in the ground for such activities as prospecting.';
            $record['image_url'] = 'subCategories/cafes.png';
        });
    }
    public function Bakeries()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Bakeries';
            $record['description'] = 'Handheld tools that uses compressed air to drill holes or break through hard surfaces.';
            $record['image_url'] = 'subCategories/bakeries.png';
        });
    }
    public function Specialtyfoodshops()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Specialty Food Shops';
            $record['description'] = 'Powerful tools that uses a chisel and either compressed air or an electric motor to break through hard materials like concrete or rock.';
            $record['image_url'] = 'subCategories/specialties.png';
        });
    }
    public function Juicebars()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Juice Bars/Smoothie Shops';
            $record['description'] = 'Equipment used to remove overburden and waste rocks from the mine site.';
            $record['image_url'] = 'subCategories/smoothies.png';
        });
    }
    public function FoodTruck()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 2;
            $record['name'] = 'Food Trucks';
            $record['description'] = 'Off-road, heavy-duty dump trucks specifically engineered for use in high-production mining and exceptionally demanding construction environments.';
            $record['image_url'] = 'subCategories/foodtrucks.png';
        });
    }


    public function Bookstores()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Book Stores';
            $record['description'] = 'Mechanical devices that moves goods and materials through a facility.';
        });
    }
    public function Giftshops()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Gift Shops';
            $record['description'] = "Compact, versatile machines with wheels that's used for construction, landscaping, and agriculture.";
        });
    }
    public function Antiquestores()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Antique Stores';
            $record['description'] = 'Equipment used in the liberation and reduction of the size of the ore.';
        });
    }
    public function Vintageclothingboutiques()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Vintage Clothing Boutiques';
            $record['description'] = 'Machines that uses compression force to break large materials into smaller pieces, like sand, gravel, and rocks.';
        });
    }
    public function Artgalleries()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Art Galleries';
            $record['description'] = 'Machines that grinds materials into a fine powder using steel or rubber balls.';
        });
    }
    public function Florists()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 3;
            $record['name'] = 'Florists';
            $record['description'] = 'Rod mills are used in an open circuit between crushing and the ball mill.';
        });
    }

    public function Petgrooming()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Pet Grooming/Dog Walking Services';
            $record['description'] = 'Equipment for separating commercially valuable minerals from their ores.';
        });
    }
    public function Housekeeping()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Housekeeping/Cleaning Services';
            $record['description'] = 'Equipment that removes unwanted materials from a stream by using magnets to pull out metal.';
        });
    }
    public function Landscaping()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Landscaping/Lawn Care';
            $record['description'] = 'These are laboratory devices that use centrifugal force to separate components in a liquid or solid.';
        });
    }
    public function Handyman()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Handyman/Home Repair Services';
            $record['description'] = 'These are devices that separate solid components in a slurry based on particle density and shape.';
        });
    }
    public function Photography ()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Photography Studios';
            $record['description'] = 'These are devices that separate solid components in a slurry based on particle density and shape.';
        });
    }
    public function Eventplanners()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 4;
            $record['name'] = 'Event Planners/Wedding Coordinators';
            $record['description'] = 'These are devices that separate solid components in a slurry based on particle density and shape.';
        });
    }


    public function Accountants()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Accountants/Tax Preparers';
            $record['description'] = 'A variety of subsurface mining techniques used to extract hard minerals.';
        });
    }
    public function Lawyers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Lawyers';
            $record['description'] = 'These are similar to conventional front end loaders but developed for the toughest of hard rock mining applications.';
        });
    }
    public function Realestateagents()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Real Estate Agents';
            $record['description'] = 'These are a mobile platforms that uses a scissor-like mechanism to raise and lower workers to elevated heights.';
        });
    }
    public function Insuranceagents()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Insurance agents';
            $record['description'] = 'These are vehicles used to transport materials and debris in underground mining operations.';
        });
    }
    public function Travelagents()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Travel agents';
            $record['description'] = 'These are vehicles used to transport materials and debris in underground mining operations.';
        });
    }
    public function Interiordesigners()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 5;
            $record['name'] = 'Interior Designers';
            $record['description'] = 'These are vehicles used to transport materials and debris in underground mining operations.';
        });
    }


    public function Graphicdesigners()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Graphic Designers';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }
    public function Webdevelopers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Web Developers';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }
    public function Videographers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Videographers/Filmmakers';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }
    public function Writers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Writers/Editors';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }
    public function Artists()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Artists/CraftsPeople';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }
    public function Musicians()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 6;
            $record['name'] = 'Musicians/Instructors';
            $record['description'] = 'Collection of tools and protective gear that miners use to protect themselves.';
        });
    }



    public function Languageschools()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Language Schools';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }
    public function Dancestudios()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Dance Studios';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }
    public function Yoga()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Yoga/Martial Arts Schools';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }
    public function Cookingclasses()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Cooking Classes';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }
    public function Artinstruction()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Art Instruction';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }
    public function Tutoringservices()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 7;
            $record['name'] = 'Tutoring Services';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect the eyes from injury and irritation caused by dust, debris, and other hazards.';
        });
    }



    public function Carwashes()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 8;
            $record['name'] = 'Car Washes';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect miners from hazardous airborne contaminants.';
        });
    }
    public function Autorepairshops()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 8;
            $record['name'] = 'Auto Repair Shops';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect miners from hazardous airborne contaminants.';
        });
    }
    public function Bikeshops()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 8;
            $record['name'] = 'Bike Shops';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect miners from hazardous airborne contaminants.';
        });
    }
    public function Motorcycleshops()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 8;
            $record['name'] = 'Motorcycle Shops';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect miners from hazardous airborne contaminants.';
        });
    }
    public function Usedcardealerships()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 8;
            $record['name'] = 'Used Car Dealerships';
            $record['description'] = 'These are a type of personal protective equipment (PPE) that protect miners from hazardous airborne contaminants.';
        });
    }


    public function Furnituremakers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 9;
            $record['name'] = 'Furniture Makers/Upholsterers';
            $record['description'] = 'These are equipments that prevents or reduces the impact of a fall from an elevated surface.';
        });
    }
    public function Customcabinetmakers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 9;
            $record['name'] = 'Custom CabinetMakers';
            $record['description'] = 'These are equipments that prevents or reduces the impact of a fall from an elevated surface.';
        });
    }
    public function Windowtreatments()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 9;
            $record['name'] = 'Window Treatments (curtains, blinds, etc.)';
            $record['description'] = 'These are equipments that prevents or reduces the impact of a fall from an elevated surface.';
        });
    }
    public function Painters()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 9;
            $record['name'] = 'Painters/Decorators';
            $record['description'] = 'These are equipments that prevents or reduces the impact of a fall from an elevated surface.';
        });
    }
    public function Flooringinstallers()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 9;
            $record['name'] = 'Flooring Installers';
            $record['description'] = 'These are equipments that prevents or reduces the impact of a fall from an elevated surface.';
        });
    }


    public function Movietheaters()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 10;
            $record['name'] = 'Movie Theaters';
            $record['description'] = 'Their availability is important for ensuring high output.';
        });
    }
    public function Bowlingalleys()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 10;
            $record['name'] = 'Bowling Alleys/Laser Tag';
            $record['description'] = 'Their availability is important for ensuring high output.';
        });
    }
    public function Escaperooms()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 10;
            $record['name'] = 'Escape Rooms';
            $record['description'] = 'Their availability is important for ensuring high output.';
        });
    }
    public function Arcades()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 10;
            $record['name'] = 'Arcades/Game Centers';
            $record['description'] = 'Their availability is important for ensuring high output.';
        });
    }
    public function Comedyclubs()
    {
        return $this->afterMaking(function ($record) {
            $record['category_id'] = 10;
            $record['name'] = 'Comedy Clubs';
            $record['description'] = 'Their availability is important for ensuring high output.';
        });
    }

}
