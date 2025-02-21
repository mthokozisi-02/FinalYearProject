<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('sub_category_id')->constrained('sub_categories');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('seller_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('total_price', 15, 2);
            $table->enum('preferred_contact_method',['Whatsapp', 'Email','Call'])->default('Email')->nullable();
            $table->enum('payment_method',['Cash', 'Swipe', 'Credit Card', 'Ecocash'])->default('Cash')->nullable();
            $table->enum('enquiry_type',['General', 'Specific Service',])->default('General')->nullable();
            $table->enum('urgency_level',['Very Urgent', 'Not Urgent',])->default('Very Urgent')->nullable();
            $table->string('additional_information')->nullable();
            $table->time('preferred_time')->nullable();
            $table->date('preferred_date')->nullable();

            //construction
            $table->string('project_details')->nullable();
            $table->string('payment_schedule')->nullable();

            //insurance and banking
            $table->string('preferred_location')->nullable();
            $table->enum('insurance_type',['Life', 'Property',])->default('Life')->nullable();

            $table->string('service_interest')->nullable();
            $table->string('account_requirements')->nullable();
            $table->string('transaction_requirements')->nullable();
            $table->string('documentation_needed')->nullable();

            //property
            $table->string('management_duration')->nullable();

            //food and beverage
            $table->string('cuisine_preference')->nullable();
            $table->string('budget_range')->nullable();
            $table->string('special_occasion_details')->nullable();

            //retail
            $table->string('price_range')->nullable();
            $table->string('availability_requirements')->nullable();
            $table->string('customization_needs')->nullable();

            //services
            $table->string('service_requirements')->nullable();

            //creative service
            $table->string('style_references')->nullable();


            //education
            $table->string('area_of_interest')->nullable();
            $table->string('experience_level')->nullable();
            $table->string('learning_goals')->nullable();

            //automotive
            $table->string('vehicle_information')->nullable();
            $table->string('service_type_interest')->nullable();
            $table->string('preferred_time_frame')->nullable();

            //home
            $table->string('project_type')->nullable();
            $table->string('property_information')->nullable();

            //entertainment
            $table->string('event_type')->nullable();
            $table->string('guest_information')->nullable();
            $table->string('special_requirements')->nullable();


            $table->enum('received',['true', 'false'])->default('false');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
