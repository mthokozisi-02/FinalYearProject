<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Package;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1)->create();
        Category::factory(1)->DiasporianServices()->create();
        Category::factory(1)->Foodandbeverages()->create();
        Category::factory(1)->Retail()->create();
        Category::factory(1)->Services()->create();
        Category::factory(1)->ProfessionalServices()->create();
        Category::factory(1)->CreativeServices()->create();
        Category::factory(1)->Education()->create();
        Category::factory(1)->Automotive()->create();
        Category::factory(1)->HomeImprovement()->create();
        Category::factory(1)->Entertainment()->create();
        Category::factory(1)->Health()->create();

        SubCategory::factory(1)->construction()->create();
        SubCategory::factory(1)->insurance()->create();
        SubCategory::factory(1)->banking()->create();
        SubCategory::factory(1)->property()->create();

        SubCategory::factory(1)->Restaurants()->create();
        SubCategory::factory(1)->Cafes()->create();
        SubCategory::factory(1)->Bakeries()->create();
        SubCategory::factory(1)->Specialtyfoodshops()->create();
        SubCategory::factory(1)->Juicebars()->create();
        SubCategory::factory(1)->FoodTruck()->create();


        SubCategory::factory(1)->Bookstores()->create();
        SubCategory::factory(1)->Giftshops()->create();
        SubCategory::factory(1)->Antiquestores()->create();
        SubCategory::factory(1)->Vintageclothingboutiques()->create();
        SubCategory::factory(1)->Artgalleries()->create();
        SubCategory::factory(1)->Florists()->create();

        SubCategory::factory(1)->Petgrooming()->create();
        SubCategory::factory(1)->Housekeeping()->create();
        SubCategory::factory(1)->Landscaping()->create();
        SubCategory::factory(1)->Handyman()->create();
        SubCategory::factory(1)->Photography()->create();
        SubCategory::factory(1)->Eventplanners()->create();

        SubCategory::factory(1)->Accountants()->create();
        SubCategory::factory(1)->Lawyers()->create();
        SubCategory::factory(1)->Realestateagents()->create();
        SubCategory::factory(1)->Insuranceagents()->create();
        SubCategory::factory(1)->Travelagents()->create();
        SubCategory::factory(1)->Interiordesigners()->create();

        SubCategory::factory(1)->Graphicdesigners()->create();
        SubCategory::factory(1)->Webdevelopers()->create();
        SubCategory::factory(1)->Videographers()->create();
        SubCategory::factory(1)->Writers()->create();
        SubCategory::factory(1)->Artists()->create();
        SubCategory::factory(1)->Musicians()->create();


        SubCategory::factory(1)->Languageschools()->create();
        SubCategory::factory(1)->Dancestudios()->create();
        SubCategory::factory(1)->Yoga()->create();
        SubCategory::factory(1)->Cookingclasses()->create();
        SubCategory::factory(1)->Artinstruction()->create();
        SubCategory::factory(1)->Tutoringservices()->create();


        SubCategory::factory(1)->Carwashes()->create();
        SubCategory::factory(1)->Autorepairshops()->create();
        SubCategory::factory(1)->Usedcardealerships()->create();
        SubCategory::factory(1)->Bikeshops()->create();
        SubCategory::factory(1)->Motorcycleshops()->create();


        SubCategory::factory(1)->Furnituremakers()->create();
        SubCategory::factory(1)->Customcabinetmakers()->create();
        SubCategory::factory(1)->Windowtreatments()->create();
        SubCategory::factory(1)->Painters()->create();
        SubCategory::factory(1)->Flooringinstallers()->create();


        SubCategory::factory(1)->Movietheaters()->create();
        SubCategory::factory(1)->Bowlingalleys()->create();
        SubCategory::factory(1)->Escaperooms()->create();
        SubCategory::factory(1)->Arcades()->create();
        SubCategory::factory(1)->Comedyclubs()->create();

        SubCategory::factory(1)->Saloon()->create();
        SubCategory::factory(1)->BeautyShop()->create();
        SubCategory::factory(1)->Mediacl()->create();
        SubCategory::factory(1)->WellnessCenters()->create();
        SubCategory::factory(1)->Fitness()->create();
        SubCategory::factory(1)->AlternativeTherapy()->create();

        Package::factory(1)->basic()->create();
        Package::factory(1)->premium()->create();
        Package::factory(1)->advanced()->create();
    }
}
