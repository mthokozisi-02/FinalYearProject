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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('sub_category_id')->constrained('sub_categories');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Pending'])->default('Active');

            $table->enum('service_type', ['Product', 'Service'])->default('Service');
            $table->decimal('preparation_time', 15, 2)->nullable();
            $table->integer('minimum_order')->default(0);
            $table->string('delivery_options')->nullable();
            $table->string('dietary_information')->nullable();

            $table->enum('product_type', ['Physical', 'Digital'])->default('Physical');
            $table->enum('inventory_status', ['Available', 'Out of Stock'])->default('Available');
            $table->string('shipping_options')->nullable();
            $table->enum('return_policy', ['Return', 'Exchange Terms'])->default('Return');
            $table->string('warranty_information')->nullable();

            $table->integer('service_duration')->default(0);
            $table->enum('appointment', ['yes', 'no'])->default('no');
            $table->enum('location_type', ['On-Site', 'Off-Site', 'Virtual'])->default('On-Site');
            $table->string('service_area')->nullable();
            $table->string('qualification')->nullable();

            $table->enum('expertise_level', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->enum('session_format', ['Individual', 'Group'])->default('Individual');
            $table->string('language_support')->nullable();
            $table->string('certifications')->nullable();
            $table->integer('experience_level')->nullable();

            $table->string('project_type')->nullable();
            $table->string('turnaround time')->nullable();
            $table->string('revisions_included')->nullable();
            $table->string('file_formats')->nullable();
            $table->string('usage_rights')->nullable();

            $table->enum('course_format', ['Online', 'In-person'])->default('Online');
            $table->integer('class_size')->default(0);
            $table->string('materials_included')->nullable();
            $table->string('prerequisites')->nullable();
            $table->string('vehicle_type')->nullable();

            $table->string('parts_included')->nullable();
            $table->string('loaner_vehicle')->nullable();
            $table->string('project_scope')->nullable();
            $table->string('license_number')->nullable();
            $table->string('insurance_coverage')->nullable();

            $table->string('permit_handling')->nullable();
            $table->string('warranty_period')->nullable();
            $table->integer('capacity')->default(0);
            $table->integer('age_restriction')->default(0);
            $table->string('equipment_provided')->nullable();
            $table->string('catering_options')->nullable();
            $table->string('parking_availability')->nullable();

            $table->enum('cons_project_type', ['New Build', 'Renovation','Repair'])->default('New Build');
            $table->enum('service_scope', ['Full Project Management', 'Consultation-only',])->default('Full Project Management');
            $table->enum('payment_term', ['Milestone-based', 'Progressive',])->default('Milestone-based');

            $table->enum('coverage_type', ['Property', 'Liability','Life'])->default('Property');
            $table->string('policy_term')->nullable();
            $table->string('premium_frequency')->nullable();
            $table->decimal('deductible_amount', 15, 2)->nullable();
            $table->decimal('coverage_limit', 15, 2)->nullable();

            $table->enum('account_type', ['Personal', 'Business','investment'])->default('Personal');
            $table->decimal('minimum_balance', 15, 2)->nullable();
            $table->decimal('interest_rate', 15, 2)->nullable();
            $table->decimal('fees', 15, 2)->nullable();
            $table->decimal('transaction_limit', 15, 2)->nullable();

            $table->string('property_types')->nullable();
            $table->enum('service_level', ['Full', 'Partial Management','Basic', 'Standard','Premium'])->default('Full');
            $table->enum('management_fee', ['Percentage', 'Flat Rate'])->default('Percentage');
            $table->string('response_time')->nullable();

            $table->decimal('price', 15, 2);
            $table->string('image_url')->nullable();
            $table->string('image_url2')->nullable();
            $table->string('image_url3')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
