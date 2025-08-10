"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeData = initializeData;
const customer_model_1 = __importDefault(require("../../src/models/customer.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const userSeedData = [
    // {
    //     email: 'lee.dev@gmail.com',
    //     password: 'aA?12345',
    //     first_name: 'Lee',
    //     last_name: 'Dev',
    //     phone_number: '+1-555-0101',
    //     role: 'admin',
    //     department: 'IT',
    //     status: 'active',
    //     is_verified: true,
    //     profile_pic: 'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
    // },
    {
        email: 'jane.smith@company.com',
        password: 'aA?12345',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '+1-555-0102',
        role: 'manager',
        department: 'Sales',
        employee_id: 'EMP002',
        status: 'active',
        is_verified: true,
        profile_pic: 'profile_pics/profile-2.jpeg',
    },
    {
        email: 'mike.johnson@company.com',
        password: 'aA?12345',
        first_name: 'Mike',
        last_name: 'Johnson',
        phone_number: '+1-555-0103',
        role: 'employee',
        department: 'Marketing',
        employee_id: 'EMP003',
        status: 'active',
        is_verified: true,
        profile_pic: 'profile_pics/',
    },
    {
        email: 'sarah.wilson@company.com',
        password: 'aA?12345',
        first_name: 'Sarah',
        last_name: 'Wilson',
        phone_number: '+1-555-0104',
        role: 'moderator',
        department: 'Support',
        employee_id: 'EMP004',
        status: 'active',
        is_verified: true,
        profile_pic: 'profile_pics/profile-3.jpeg',
    },
    {
        email: 'david.brown@company.com',
        password: 'aA?12345',
        first_name: 'David',
        last_name: 'Brown',
        phone_number: '+1-555-0105',
        role: 'agent',
        department: 'Customer Service',
        employee_id: 'EMP005',
        status: 'active',
        is_verified: false,
        profile_pic: 'profile_pics/profile-4.jpeg',
    },
    {
        email: 'lisa.garcia@company.com',
        password: 'aA?12345',
        first_name: 'Lisa',
        last_name: 'Garcia',
        phone_number: '+1-555-0106',
        role: 'employee',
        department: 'HR',
        employee_id: 'EMP006',
        status: 'inactive',
        is_verified: true,
        profile_pic: 'profile_pics/profile-5.jpeg',
    },
    {
        email: 'robert.miller@company.com',
        password: 'aA?12345',
        first_name: 'Robert',
        last_name: 'Miller',
        phone_number: '+1-555-0107',
        role: 'manager',
        department: 'Finance',
        employee_id: 'EMP007',
        status: 'active',
        is_verified: true,
        profile_pic: 'profile_pics/profile-6.jpeg',
    },
    {
        email: 'emily.davis@company.com',
        password: 'aA?12345',
        first_name: 'Emily',
        last_name: 'Davis',
        phone_number: '+1-555-0108',
        role: 'agent',
        department: 'Technical Support',
        employee_id: 'EMP008',
        status: 'active',
        is_verified: true,
        profile_pic: 'profile_pics/profile-7.jpeg',
    },
    {
        email: 'alex.martinez@company.com',
        password: 'aA?12345',
        first_name: 'Alex',
        last_name: 'Martinez',
        phone_number: '+1-555-0109',
        role: 'employee',
        department: 'Operations',
        employee_id: 'EMP009',
        status: 'suspended',
        is_verified: true,
        profile_pic: 'profile_pics/profile-8.jpeg',
    },
    {
        email: 'amanda.taylor@company.com',
        password: 'aA?12345',
        first_name: 'Amanda',
        last_name: 'Taylor',
        phone_number: '+1-555-0110',
        role: 'moderator',
        department: 'Content',
        employee_id: 'EMP010',
        status: 'active',
        is_verified: false,
        profile_pic: 'profile_pics/profile-9.jpeg',
    }
];
// Customer seed data with proper field mapping according to the model
const customerSeedData = [
    {
        customer_id: 'CUST001',
        first_name: 'Michael',
        last_name: 'Thompson',
        email: 'michael.thompson@gmail.com',
        phone_number: '+1-555-1001',
        dob: new Date('1985-05-15'),
        nationality: 'American',
        gender: 'male',
        address: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip_code: '10001',
            country: 'USA'
        },
        id_type: 'license',
        id_number: 'DL123456789',
        profession: 'Software Engineer',
        marital_status: 'married',
        religion: 'Christian',
        father_name: 'Robert Thompson',
        mother_name: 'Linda Thompson',
        witness_name: 'John Doe',
        witness_relation: 'Friend',
        medication: false,
        number_of_children: 2,
        boys: 1,
        girls: 1,
        finincial_institution: 'Chase Bank',
        profile_pic: 'profile_pics/profile-10.jpeg',
        status: 'active',
        notes: 'Premium customer with excellent payment history'
    },
    {
        customer_id: 'CUST002',
        first_name: 'Jennifer',
        last_name: 'Williams',
        email: 'jennifer.williams@outlook.com',
        phone_number: '+1-555-1002',
        dob: new Date('1990-08-22'),
        nationality: 'American',
        gender: 'female',
        address: {
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zip_code: '90210',
            country: 'USA'
        },
        id_type: 'passport',
        id_number: 'P987654321',
        profession: 'Graphic Designer',
        marital_status: 'single',
        religion: 'Catholic',
        father_name: 'David Williams',
        mother_name: 'Sarah Williams',
        witness_name: 'Emily Davis',
        witness_relation: 'Sister',
        medication: true,
        medication_type: 'Allergy medication',
        number_of_children: 0,
        boys: 0,
        girls: 0,
        finincial_institution: 'Bank of America',
        profile_pic: 'profile_pics/profile-11.jpeg',
        status: 'active',
        notes: 'Creative professional, prefers digital communication'
    },
    {
        customer_id: 'CUST003',
        first_name: 'Christopher',
        last_name: 'Anderson',
        email: 'chris.anderson@yahoo.com',
        phone_number: '+1-555-1003',
        dob: new Date('1982-11-10'),
        nationality: 'American',
        gender: 'male',
        address: {
            street: '789 Pine Road',
            city: 'Chicago',
            state: 'IL',
            zip_code: '60601',
            country: 'USA'
        },
        id_type: 'nrc',
        id_number: 'NID123789456',
        profession: 'Business Consultant',
        marital_status: 'divorced',
        religion: 'Protestant',
        father_name: 'Mark Anderson',
        mother_name: 'Patricia Anderson',
        witness_name: 'Michael Johnson',
        witness_relation: 'Colleague',
        medication: false,
        number_of_children: 1,
        boys: 1,
        girls: 0,
        finincial_institution: 'Wells Fargo',
        profile_pic: 'profile_pics/profile-12.jpeg',
        status: 'inactive',
        notes: 'Inactive since June, requires follow-up'
    },
    {
        customer_id: 'CUST004',
        first_name: 'Ashley',
        last_name: 'Martinez',
        email: 'ashley.martinez@hotmail.com',
        phone_number: '+1-555-1004',
        dob: new Date('1988-07-05'),
        nationality: 'American',
        gender: 'female',
        address: {
            street: '321 Elm Street',
            city: 'Miami',
            state: 'FL',
            zip_code: '33101',
            country: 'USA'
        },
        id_type: 'license',
        id_number: 'DL987654321',
        profession: 'Marketing Manager',
        marital_status: 'married',
        religion: 'Catholic',
        father_name: 'Carlos Martinez',
        mother_name: 'Maria Martinez',
        witness_name: 'Sofia Garcia',
        witness_relation: 'Best Friend',
        medication: false,
        number_of_children: 3,
        boys: 2,
        girls: 1,
        finincial_institution: 'SunTrust Bank',
        profile_pic: 'profile_pics/profile-13.jpeg',
        status: 'active',
        notes: 'High-value customer, frequent purchaser'
    },
    {
        customer_id: 'CUST005',
        first_name: 'James',
        last_name: 'Robinson',
        email: 'james.robinson@gmail.com',
        phone_number: '+1-555-1005',
        dob: new Date('1975-04-18'),
        nationality: 'American',
        gender: 'male',
        address: {
            street: '654 Cedar Lane',
            city: 'Houston',
            state: 'TX',
            zip_code: '77001',
            country: 'USA'
        },
        id_type: 'passport',
        id_number: 'P456789123',
        profession: 'Oil Engineer',
        marital_status: 'married',
        religion: 'Baptist',
        father_name: 'William Robinson',
        mother_name: 'Dorothy Robinson',
        witness_name: 'Thomas Brown',
        witness_relation: 'Brother-in-law',
        medication: true,
        medication_type: 'Blood pressure medication',
        number_of_children: 4,
        boys: 2,
        girls: 2,
        finincial_institution: 'Chase Bank',
        profile_pic: 'profile_pics/profile-14.jpeg',
        status: 'active',
        notes: 'Industry professional, reliable client'
    },
    {
        customer_id: 'CUST006',
        first_name: 'Maria',
        last_name: 'Lopez',
        email: 'maria.lopez@gmail.com',
        phone_number: '+1-555-1006',
        dob: new Date('1993-09-12'),
        nationality: 'American',
        gender: 'female',
        address: {
            street: '987 Maple Drive',
            city: 'Phoenix',
            state: 'AZ',
            zip_code: '85001',
            country: 'USA'
        },
        id_type: 'license',
        id_number: 'DL654321987',
        profession: 'Teacher',
        marital_status: 'single',
        religion: 'Catholic',
        father_name: 'Juan Lopez',
        mother_name: 'Carmen Lopez',
        witness_name: 'Isabella Rodriguez',
        witness_relation: 'Cousin',
        medication: false,
        number_of_children: 0,
        boys: 0,
        girls: 0,
        finincial_institution: 'US Bank',
        profile_pic: 'profile_pics/profile-15.jpeg',
        status: 'active',
        notes: 'Education professional, very organized'
    },
    {
        customer_id: 'CUST007',
        first_name: 'Daniel',
        last_name: 'White',
        email: 'daniel.white@outlook.com',
        phone_number: '+1-555-1007',
        dob: new Date('1979-12-03'),
        nationality: 'American',
        gender: 'male',
        address: {
            street: '147 Birch Street',
            city: 'Seattle',
            state: 'WA',
            zip_code: '98101',
            country: 'USA'
        },
        id_type: 'passport',
        id_number: 'P789123456',
        profession: 'Software Architect',
        marital_status: 'married',
        religion: 'Other',
        father_name: 'Richard White',
        mother_name: 'Helen White',
        witness_name: 'Kevin Turner',
        witness_relation: 'Business Partner',
        medication: false,
        number_of_children: 2,
        boys: 1,
        girls: 1,
        finincial_institution: 'Credit Union',
        profile_pic: 'profile_pics/profile-16.jpeg',
        status: 'active',
        notes: 'Tech industry veteran, premium service level'
    },
    {
        customer_id: 'CUST008',
        first_name: 'Nicole',
        last_name: 'Harris',
        email: 'nicole.harris@yahoo.com',
        phone_number: '+1-555-1008',
        dob: new Date('1986-06-08'),
        nationality: 'American',
        gender: 'female',
        address: {
            street: '258 Spruce Avenue',
            city: 'Denver',
            state: 'CO',
            zip_code: '80201',
            country: 'USA'
        },
        id_type: 'nrc',
        id_number: 'NID987654321',
        profession: 'Nurse',
        marital_status: 'married',
        religion: 'Methodist',
        father_name: 'Paul Harris',
        mother_name: 'Janet Harris',
        witness_name: 'Dr. Rebecca Miller',
        witness_relation: 'Supervisor',
        medication: true,
        medication_type: 'Insulin for diabetes',
        number_of_children: 1,
        boys: 0,
        girls: 1,
        finincial_institution: 'First National Bank',
        profile_pic: 'profile_pics/profile-17.jpeg',
        status: 'active',
        notes: 'Healthcare professional, requires flexible scheduling'
    }
];
const seedUsers = async () => {
    try {
        console.log('🌱 Starting user seeding...');
        // Clear existing users
        await user_model_1.default.deleteMany({});
        console.log('🗑️ Cleared existing users');
        // Insert dummy users
        const result = await user_model_1.default.insertMany(userSeedData);
        console.log(`✅ Successfully seeded ${result.length} users`);
        return {
            success: true,
            message: 'Users seeded successfully',
            count: result.length
        };
    }
    catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
};
const seedCustomers = async () => {
    try {
        console.log('🌱 Starting customer seeding...');
        // Clear existing customers
        await customer_model_1.default.deleteMany({});
        console.log('🗑️ Cleared existing customers');
        // Insert dummy customers
        const result = await customer_model_1.default.insertMany(customerSeedData);
        console.log(`✅ Successfully seeded ${result.length} customers`);
        return {
            success: true,
            message: 'Customers seeded successfully',
            count: result.length
        };
    }
    catch (error) {
        console.error('❌ Error seeding customers:', error);
        throw error;
    }
};
async function initializeData() {
    try {
        await seedUsers();
        await seedCustomers();
        console.log('Database seeding completed');
    }
    catch (error) {
        console.error('Database seeding failed:', error);
    }
}
//# sourceMappingURL=user-seed.js.map