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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('sub_category_id')->constrained('sub_categories');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('seller_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('total_price', 15, 2);
            $table->enum('preferred_contact_method',['Whatsapp', 'Email','Call'])->default('Email')->nullable();
            $table->enum('payment_method',['Cash', 'Swipe', 'Credit Card', 'Ecocash'])->default('Cash')->nullable();
            $table->enum('booking_status',['Approved', 'Pending','Rejected'])->default('Pending')->nullable();

            //construction
            $table->string('project_details')->nullable();
            $table->string('property_address')->nullable();
            $table->string('project_timeline')->nullable();
            $table->string('payment_schedule')->nullable();

            //insurance and banking
            $table->enum('appointment_type',['Physical', 'Online'])->default('Physical')->nullable();

            //property
            $table->string('management_duration')->nullable();

            //food and beverage
            $table->integer('number_of_people')->default(0)->nullable();
            $table->string('special_request')->nullable();
            $table->string('dietary_requirements')->nullable();
            $table->string('table_preferences')->nullable();

            //retail
            $table->integer('quantity')->default(0)->nullable();
            $table->string('size')->nullable();
            $table->string('style')->nullable();
            $table->enum('shipping_options', ['Delivery', 'Pickup'])->nullable();

            //services
            $table->string('address')->nullable();
            $table->string('equipment_requirements')->nullable();
            $table->string('service_duration')->nullable();
            $table->enum('location_type', ['High Density', 'Medium Density', 'Low Density'])->nullable();
            $table->string('special_instructions')->nullable();

            //professional_services
            $table->string('project_scope')->nullable();
            $table->string('required_documentation')->nullable();
            $table->string('timeline_requirements')->nullable();

            //creative services
            $table->string('project_type')->nullable();
            $table->string('deliverable_format')->nullable();
            $table->string('revision_requirements')->nullable();
            $table->string('style_preference')->nullable();

            //education
            $table->string('skill_level')->nullable();
            $table->string('schedule_requirements')->nullable();
            $table->integer('class_size')->nullable();
            $table->string('prerequisites')->nullable();

            //automotive
            $table->string('vehicle_information')->nullable();
            $table->string('service_type')->nullable();
            $table->date('preferred_date')->nullable();
            $table->time('preferred_time')->nullable();

            //home improvement
            $table->string('property_type')->nullable();
            $table->string('budget_range')->nullable();

            //entertainment
            $table->integer('number_of_guests')->nullable();
            $table->string('event_type')->nullable();
            $table->string('duration')->nullable();
            $table->string('special_requirements')->nullable();



            $table->string('additional_information')->nullable();
            $table->enum('received',['true', 'false'])->default('false');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
