<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'tinitorres',
            'email' => 'tinitorres@gmail.com',
            'password'=>Hash::make('tinitorres'),
            'rol'=>'admin',
            'nombres' => 'bryan gracielo',
            'apellidos' => 'torres pin',
            'cedula' => '1257520381'

        ]);
    }
}
