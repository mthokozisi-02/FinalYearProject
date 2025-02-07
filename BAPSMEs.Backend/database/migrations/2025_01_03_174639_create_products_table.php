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
            $table->enum('bookable', ['true', 'false'])->default('false');
            $table->decimal('price', 15, 2);
            $table->integer('quantity')->default(0);
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
