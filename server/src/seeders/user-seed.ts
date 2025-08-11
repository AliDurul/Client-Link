import Ticket, { TicCat } from '../../src/models/ticket.model';
import Customer from '../../src/models/customer.model';
import User from '../models/user.model';


const userSeedData = [
    {
        "email": "lee.dev@gmail.com",
        "password": "aA?12345",
        "first_name": "Lee",
        "last_name": "Dev",
        "phone_number": "+1-555-0101",
        "role": "admin",
        "department": "IT",
        "status": "active",
        "is_verified": true,
        "profile_pic": "profile_pics/profile-18.jpeg"
    },
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

const ticCatSeedData = [
    {
        name: "Technical Support",
        description: "Issues related to software bugs, system errors, and technical troubleshooting"
    },
    {
        name: "Account Management",
        description: "Account-related inquiries including password resets, profile updates, and account access"
    },
    {
        name: "Billing & Payments",
        description: "Payment processing issues, billing disputes, refunds, and subscription management"
    },
    {
        name: "Product Information",
        description: "Questions about product features, specifications, compatibility, and usage guidelines"
    },
    {
        name: "Bug Reports",
        description: "Reports of software defects, unexpected behavior, and system malfunctions"
    },
    {
        name: "Feature Requests",
        description: "Suggestions for new features, enhancements, and product improvements"
    },
    {
        name: "Installation & Setup",
        description: "Assistance with software installation, configuration, and initial setup processes"
    },
    {
        name: "Security & Privacy",
        description: "Security concerns, privacy policy questions, and data protection inquiries"
    },
    {
        name: "General Inquiry",
        description: "General questions that don't fit into specific categories or miscellaneous support"
    },
    {
        name: "Training & Documentation",
        description: "Requests for training materials, user guides, tutorials, and documentation"
    },
    {
        name: "Performance Issues",
        description: "System slowdowns, optimization concerns, and performance-related problems"
    },
    {
        name: "Integration Support",
        description: "Third-party integrations, API issues, and connectivity problems"
    },
    {
        name: "Data Management",
        description: "Data import/export, backup issues, and data migration assistance"
    },
    {
        name: "Compliance & Legal",
        description: "Legal compliance questions, regulatory requirements, and policy clarifications"
    }
];

const ticketSeedData = [
    {
        title: "Login Issues with Company Portal",
        description: "I have been experiencing persistent login issues with the company portal for the past three days. After successfully completing the password reset process two weeks ago, I was able to access the system normally for about 10 days. However, starting Monday morning, I began receiving 'Invalid credentials' error messages repeatedly, even though I am absolutely certain I am entering the correct username and password combination. I have tried clearing my browser cache, using different browsers including Chrome, Firefox, and Edge, and even attempted to log in from a different computer, but the issue persists across all platforms. The error message appears immediately after clicking the login button, suggesting it might not even be reaching the authentication server. I also notice that the password field seems to clear itself sometimes when I paste the password, which might indicate a JavaScript issue on the login page. This is critically affecting my ability to access important client files and complete time-sensitive projects. I have also tried using incognito/private browsing mode to eliminate any potential cookie or session conflicts, but the problem remains. Additionally, I verified that my account hasn't been locked or suspended by checking with my supervisor, and they confirmed my account status is active. Could you please investigate this issue urgently as it's preventing me from performing my daily work responsibilities?",
        status: "pending",
        priority: "high",
        flag: "important",
        email_id: "support-ticket-001@company.com",
        caller_details: {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@external.com",
            phone_number: "+1-555-2001"
        }
    },
    {
        title: "Billing Discrepancy on Monthly Invoice",
        description: "I am writing to bring to your attention a significant billing discrepancy that I discovered on our latest monthly invoice dated August 1st, 2025. Upon careful review of the charges, I found several line items that were not part of our original service agreement and were never discussed during our contract negotiations. Specifically, there is a $150 'Premium Support Fee' that appears to have been added without any prior notification or explanation. Additionally, there are three separate charges labeled 'Additional Storage Allocation' totaling $75, which is confusing because our current usage is well below the allocated limit according to our dashboard. I have compared this invoice with the previous six months of billing statements, and these charges have never appeared before. Furthermore, there's a 'System Maintenance Fee' of $45 that seems to be a new addition. I have thoroughly reviewed our signed contract and service level agreement, and none of these fees are mentioned in any of our documentation. I have also checked all email communications from your billing department over the past three months, and there were no notifications about additional fees or service upgrades. This discrepancy is particularly concerning because it represents a 23% increase in our monthly costs without any prior authorization or communication. I would appreciate a detailed breakdown of these charges and an explanation of when and why they were added to our account. If these are indeed erroneous charges, I would like them removed from the current invoice and would prefer to have a corrected invoice issued promptly. Please also ensure that our account is flagged to prevent similar unauthorized charges in the future.",
        status: "active",
        priority: "medium",
        flag: "moderate",
        email_id: "billing-inquiry-002@company.com",
        caller_details: {
            first_name: "Sarah",
            last_name: "Connor",
            email: "s.connor@email.com",
            phone_number: "+1-555-2002"
        }
    },
    {
        title: "Feature Request: Dark Mode Toggle",
        description: "I would like to formally request the implementation of a dark mode toggle feature for the application interface. As someone who frequently works late hours and often uses the application during evening and night shifts, I find the current bright white interface quite straining on the eyes, especially in low-light environments. This issue has become more pronounced since our team adopted a hybrid work schedule, and I often find myself working from home in dimly lit spaces to avoid disturbing family members. The constant exposure to bright screens during extended work sessions has been causing eye fatigue, headaches, and difficulty focusing on tasks for prolonged periods. I have researched this topic extensively and found that dark mode interfaces can reduce eye strain by up to 60% according to several ergonomic studies. Additionally, dark mode can help preserve battery life on mobile devices and laptops, which is particularly beneficial for our field team members who often work remotely without reliable access to power sources. From a user experience perspective, many of the modern applications and platforms we use daily, including Slack, Microsoft Teams, GitHub, and even our email clients, offer dark mode options, making our current application feel outdated in comparison. I believe implementing this feature would significantly improve user satisfaction and productivity, especially for team members who spend 6-8 hours daily in the application. The feature could be implemented as a simple toggle switch in the user preferences menu, allowing users to choose between light mode, dark mode, or even an automatic mode that switches based on system preferences or time of day. I would be happy to participate in any beta testing or provide feedback during the development process if this request moves forward.",
        status: "pending",
        priority: "low",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Mike",
            last_name: "Stevens",
            email: "mike.stevens@gmail.com",
            phone_number: "+1-555-2003"
        }
    },
    {
        title: "System Crash During File Upload",
        description: "We are experiencing a critical and consistent system crash issue that occurs specifically when attempting to upload files larger than 10MB through the application interface. This problem began approximately 48 hours ago and has since affected our entire workflow, causing significant delays in project deliveries and client communications. The crash pattern is highly predictable: when any user attempts to upload a file that exceeds the 10MB threshold, the application becomes completely unresponsive for about 15-20 seconds, displays a generic error message, and then crashes entirely, requiring a complete browser restart. This issue affects multiple file types including PDFs, high-resolution images, video files, and compressed archives that our team regularly needs to share with clients. The problem is not isolated to a single browser or operating system - we have confirmed it occurs on Windows 10, Windows 11, macOS, Chrome, Firefox, Safari, and Edge. Our development team has tested this extensively and can reproduce the issue 100% of the time with files over 10MB, while files under this threshold upload successfully without any problems. This is particularly problematic because many of our client deliverables, including design mockups, marketing materials, and presentation files, regularly exceed 10MB. We have had to resort to using external file sharing services as a workaround, which compromises our security protocols and creates additional friction in our client communication process. The timing is especially critical as we have three major client presentations scheduled for this week, and we need to be able to upload comprehensive project files to the platform. We have also noticed that the crash sometimes corrupts unsaved work in other areas of the application, leading to data loss. Our IT department has confirmed that the issue is not related to our internet connection, firewall settings, or local system configurations. We urgently need this resolved as it's affecting our ability to serve our clients effectively and meet our project deadlines.",
        status: "escalated",
        priority: "critical",
        flag: "important",
        email_id: "critical-bug-003@company.com",
        caller_details: {
            first_name: "Emma",
            last_name: "Wilson",
            email: "emma.w@company.org",
            phone_number: "+1-555-2004"
        },
        escalation: {
            reason: "Critical system issue affecting multiple users in production environment causing complete workflow disruption and potential client relationship damage"
        }
    },
    {
        title: "Password Reset Not Working",
        description: "I have been unable to reset my password for the past 24 hours despite multiple attempts through the standard password reset process. The issue began yesterday morning when I attempted to log into my account and realized I couldn't remember my password after returning from a two-week vacation. I immediately clicked on the 'Forgot Password' link on the login page and entered my registered email address (d.brown@outlook.com). The system displayed a confirmation message stating that password reset instructions would be sent to my email within 5-10 minutes. However, I have not received any password reset emails despite waiting for over an hour on the first attempt. I have since tried the password reset process six additional times over the past 24 hours, with attempts spaced several hours apart to avoid any potential rate limiting issues. I have thoroughly checked my email inbox, spam folder, junk folder, and even searched for emails from your domain across all folders. I have also confirmed that my email account is functioning properly by sending test emails to myself and colleagues. Additionally, I verified that emails from your domain are not being blocked by checking my email provider's blocked sender list and security settings. I even temporarily disabled my email's spam filter to ensure no legitimate emails were being filtered out. I have also tried using an alternative email address that I have on file with your system, but the same issue persists - no password reset emails are being received. This is preventing me from accessing important work documents and communications that are stored in my account. I contacted my supervisor to confirm that my account is still active and hasn't been suspended or terminated, and they confirmed that my account status shows as active in their admin panel. I'm particularly concerned because I have several time-sensitive projects that require access to files and information stored in my account, and this delay is starting to impact my work schedule and deadlines. Could you please investigate why the password reset emails are not being sent and help me regain access to my account as soon as possible?",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "pwd-reset-004@company.com",
        caller_details: {
            first_name: "David",
            last_name: "Brown",
            email: "d.brown@outlook.com",
            phone_number: "+1-555-2005"
        }
    },
    {
        title: "Product Compatibility Question",
        description: "I am reaching out to request detailed information about the compatibility of our current software version (v4.2.1) with the recently released Windows 11 operating system update. Our organization is planning a comprehensive system upgrade across all departments scheduled for next month, and we need to ensure that our mission-critical applications will continue to function properly after the Windows 11 implementation. Currently, we have approximately 200 workstations running your software on Windows 10, and the IT department has been tasked with evaluating the compatibility requirements before proceeding with the OS upgrade. We have been using your software successfully for the past three years, and it has become an integral part of our daily operations, handling everything from client data management to financial reporting and project tracking. The Windows 11 update includes several significant changes to system architecture, security protocols, and hardware requirements that could potentially impact software compatibility. Specifically, we are concerned about potential issues with TPM 2.0 requirements, Secure Boot functionality, hardware-based security features, and changes to the Windows registry structure. We have also heard about potential compatibility issues with certain database drivers and networking protocols that our software relies on. Additionally, we need to understand if there are any specific hardware requirements or system configurations that need to be addressed before or after the Windows 11 upgrade. Our IT team has prepared a detailed inventory of our current hardware specifications, including processor types, RAM configurations, storage systems, and network adapters, which we can provide if needed for a comprehensive compatibility assessment. We would greatly appreciate if you could provide information about: 1) Official Windows 11 compatibility status for version 4.2.1, 2) Any known issues or limitations, 3) Recommended system requirements, 4) Whether any software updates or patches are required, 5) Timeline for any necessary updates, and 6) Best practices for migration. This information is crucial for our planning process and will help ensure a smooth transition without disrupting our business operations.",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Lisa",
            last_name: "Johnson",
            email: "lisa.johnson@tech.com",
            phone_number: "+1-555-2006"
        }
    },
    {
        title: "Slow Performance During Peak Hours",
        description: "We are experiencing severe performance degradation issues that occur consistently every weekday between 2:00 PM and 4:00 PM Eastern Time. This performance problem has been ongoing for approximately two weeks and is significantly impacting our team's productivity during what should be our most productive afternoon hours. During these peak hours, the system becomes extremely sluggish with response times that are 300-500% slower than normal operations. Simple actions like loading customer records, running basic reports, or navigating between different modules take 30-45 seconds instead of the usual 3-5 seconds. More complex operations like generating comprehensive reports or processing batch updates either time out completely or take over 10 minutes to complete. We have documented this issue extensively with screenshots showing load times and have identified that database queries appear to be the primary bottleneck. Our internal monitoring tools show that SQL queries that normally execute in under 500 milliseconds are taking 15-30 seconds during these peak periods. The timeout errors are particularly problematic because they often result in partial data processing, requiring manual intervention to complete transactions and verify data integrity. This timing coincides with our highest usage period when most of our customer service team is actively processing client requests, updating records, and generating daily reports. The performance issues are affecting our ability to meet customer service level agreements and are causing frustration among staff members who rely on the system for their daily tasks. We have confirmed that the issue is not related to our local network infrastructure or internet connectivity, as other cloud-based applications continue to perform normally during these same time periods. Our IT department has also verified that our local systems have sufficient resources and are not experiencing any hardware-related performance issues. We suspect this might be related to server capacity or database optimization issues on your end, possibly due to increased load from other customers during these peak hours. We would appreciate a thorough investigation into server performance metrics, database query optimization, and resource allocation during these specific time periods. Given that this is affecting our core business hours, we would appreciate urgent attention to resolve this performance bottleneck.",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "performance-005@company.com",
        caller_details: {
            first_name: "Robert",
            last_name: "Taylor",
            email: "r.taylor@business.com",
            phone_number: "+1-555-2007"
        }
    },
    {
        title: "Integration with Third-Party API Failing",
        description: "Our critical integration with the payment gateway API has been experiencing complete failure since yesterday at approximately 3:30 PM EST. This integration is essential for processing customer payments and has been functioning reliably for over 18 months without any significant issues. The failure began suddenly without any changes to our system configuration or API implementation. We are consistently receiving HTTP 500 Internal Server Error responses for all API calls, including basic authentication requests, transaction processing, and status inquiries. Our development team has conducted extensive testing and confirmed that our API implementation code has not changed, our authentication credentials are correct and have not expired, and our API request formatting matches the documented specifications exactly. The 500 errors are occurring for all types of API calls, including GET requests for retrieving transaction status, POST requests for processing new payments, and even simple ping requests to verify connectivity. We have tested the API calls using multiple tools including Postman, curl commands, and our development environment, and all produce the same 500 error responses. This is particularly concerning because these same API endpoints were working perfectly until yesterday afternoon, and we have not made any changes to our integration code, server configuration, or network settings. The timing is critical as this failure is preventing us from processing any customer payments, which is directly impacting our revenue and customer satisfaction. We have approximately 200 pending transactions that customers are attempting to complete, and they are receiving payment failure messages, which is causing confusion and potential loss of sales. Our customer service team is being overwhelmed with calls from frustrated customers who cannot complete their purchases. We have reviewed the payment gateway provider's status page and social media channels, but there are no reported outages or maintenance activities that would explain these API failures. We have also verified that our server's IP address has not been blacklisted and that our API rate limits have not been exceeded. Our logs show that the requests are being sent successfully from our servers, but the responses consistently return 500 errors with generic error messages that don't provide specific information about the cause of the failure. We urgently need assistance in diagnosing whether this is an issue with our integration, a problem with the payment gateway service, or a configuration issue that needs to be resolved immediately.",
        status: "escalated",
        priority: "critical",
        flag: "important",
        email_id: "api-integration-006@company.com",
        caller_details: {
            first_name: "Jennifer",
            last_name: "Davis",
            email: "jen.davis@enterprise.com",
            phone_number: "+1-555-2008"
        },
        escalation: {
            reason: "Payment processing system is completely down affecting all customer transactions and causing immediate revenue loss with potential for significant customer relationship damage"
        }
    },
    {
        title: "Request for Training Materials",
        description: "I am writing to request access to comprehensive training materials and documentation for our newly hired team members who will be joining our customer support department over the next month. We are expanding our team significantly due to increased customer demand and will be onboarding eight new employees who will need thorough training on your software platform. The new hires come from diverse backgrounds with varying levels of technical experience, so we need training materials that can accommodate different learning styles and skill levels. Currently, we have been using training documentation that was provided during our initial implementation two years ago, but we have noticed that many of the screenshots, feature descriptions, and workflow processes are outdated due to the various updates and enhancements that have been released since then. We need access to the most current version of user manuals, step-by-step guides, video tutorials, and any interactive training modules that might be available. Specifically, we are looking for materials that cover: basic navigation and interface orientation, customer record management procedures, ticket creation and tracking processes, reporting and analytics features, integration with other tools, troubleshooting common issues, security protocols and best practices, and advanced features for experienced users. Additionally, if there are any certification programs or structured learning paths available, we would be very interested in enrolling our new team members in those programs. We would also appreciate any training materials that focus on customer service best practices within your platform, as well as any industry-specific use cases that might be relevant to our business sector. Our training schedule is quite intensive, with new employees expected to be fully productive within three weeks of their start date, so having comprehensive and up-to-date training resources is crucial for their success. We would also be interested in scheduling live training sessions or webinars if those are available, as we find that interactive learning opportunities are particularly effective for complex software platforms. If there are any costs associated with accessing premium training materials or certification programs, please provide detailed pricing information so we can budget accordingly. We believe that investing in proper training will not only help our new employees become productive more quickly but will also ensure they are utilizing your platform to its full potential, ultimately benefiting both our organizations.",
        status: "resolved",
        priority: "low",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Amanda",
            last_name: "Garcia",
            email: "amanda.garcia@corp.com",
            phone_number: "+1-555-2009"
        }
    },
    {
        title: "Data Export Feature Not Working",
        description: "I am experiencing a persistent issue with the data export functionality that has been preventing me from generating essential customer reports for the past week. The problem specifically occurs when attempting to export customer data to CSV format using the export feature in the Customer Management module. When I select the customers I want to export (typically 500-1000 records at a time), choose the CSV format option, and click the 'Export Data' button, the system appears to begin processing the request as indicated by the loading spinner, but then nothing happens. The button becomes unresponsive, and no download dialog appears even after waiting for up to 30 minutes. I have tried this process with different data sets, including smaller samples of 50-100 records, but the issue persists regardless of the export size. This functionality was working perfectly until last Monday, when I successfully exported a comprehensive customer database containing over 2,000 records for our quarterly review. Since then, I have been unable to export any data at all. I have tested this issue across multiple browsers including Chrome (version 91.0.4472.124), Firefox (version 90.0), and Edge (version 91.0.864.59), and the problem occurs consistently in all of them. I have also tried clearing browser cache, disabling browser extensions, and using incognito/private browsing mode, but none of these steps resolved the issue. The export feature is crucial for our monthly reporting processes, where we need to analyze customer data in external analytics tools and share sanitized customer information with our marketing partners. Additionally, we use the CSV exports to create backup copies of critical customer data and to import information into our secondary CRM system for redundancy purposes. The timing of this issue is particularly problematic because we are approaching our month-end reporting deadline, and our management team is expecting comprehensive customer analytics reports that depend on this exported data. I have also noticed that while the CSV export is not working, the PDF export functionality in the same module appears to be working correctly, though PDF format is not suitable for our data analysis needs. Furthermore, I verified that my user account has the necessary permissions for data export by checking with our system administrator, and they confirmed that my access levels have not changed recently. Could you please investigate this issue urgently and provide a solution or workaround that would allow us to export our customer data in CSV format?",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: "data-export-007@company.com",
        caller_details: {
            first_name: "Kevin",
            last_name: "Martinez",
            email: "k.martinez@data.com",
            phone_number: "+1-555-2010"
        }
    },
    {
        title: "Feature Request: Dark Mode Toggle",
        description: "Would like to request a dark mode option for the application interface to improve user experience during night time usage.",
        status: "pending",
        priority: "low",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Mike",
            last_name: "Stevens",
            email: "mike.stevens@gmail.com",
            phone_number: "+1-555-2003"
        }
    },
    {
        title: "System Crash During File Upload",
        description: "Application crashes consistently when trying to upload files larger than 10MB. This is affecting our daily workflow.",
        status: "escalated",
        priority: "critical",
        flag: "important",
        email_id: "critical-bug-003@company.com",
        caller_details: {
            first_name: "Emma",
            last_name: "Wilson",
            email: "emma.w@company.org",
            phone_number: "+1-555-2004"
        },
        escalation: {
            reason: "Critical system issue affecting multiple users in production environment"
        }
    },
    {
        title: "Password Reset Not Working",
        description: "Password reset emails are not being received. Checked spam folder and tried multiple times over the past 24 hours.",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "pwd-reset-004@company.com",
        caller_details: {
            first_name: "David",
            last_name: "Brown",
            email: "d.brown@outlook.com",
            phone_number: "+1-555-2005"
        }
    },
    {
        title: "Product Compatibility Question",
        description: "Need to confirm if our current software version is compatible with the new Windows 11 update before proceeding.",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Lisa",
            last_name: "Johnson",
            email: "lisa.johnson@tech.com",
            phone_number: "+1-555-2006"
        }
    },
    {
        title: "Slow Performance During Peak Hours",
        description: "System becomes extremely slow between 2-4 PM daily. Database queries are timing out and users are experiencing delays.",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "performance-005@company.com",
        caller_details: {
            first_name: "Robert",
            last_name: "Taylor",
            email: "r.taylor@business.com",
            phone_number: "+1-555-2007"
        }
    },
    {
        title: "Integration with Third-Party API Failing",
        description: "Our integration with the payment gateway API started failing yesterday. Getting 500 error responses consistently.",
        status: "escalated",
        priority: "critical",
        flag: "important",
        email_id: "api-integration-006@company.com",
        caller_details: {
            first_name: "Jennifer",
            last_name: "Davis",
            email: "jen.davis@enterprise.com",
            phone_number: "+1-555-2008"
        },
        escalation: {
            reason: "Payment processing is down affecting customer transactions"
        }
    },
    {
        title: "Request for Training Materials",
        description: "New team members need access to updated training documentation and video tutorials for the latest software version.",
        status: "resolved",
        priority: "low",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Amanda",
            last_name: "Garcia",
            email: "amanda.garcia@corp.com",
            phone_number: "+1-555-2009"
        }
    },
    {
        title: "Data Export Feature Not Working",
        description: "Unable to export customer data to CSV format. The export button appears to be unresponsive when clicked.",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: "data-export-007@company.com",
        caller_details: {
            first_name: "Kevin",
            last_name: "Martinez",
            email: "k.martinez@data.com",
            phone_number: "+1-555-2010"
        }
    },
    {
        title: "Security Concern: Unusual Login Activity",
        description: "Noticed multiple failed login attempts from unknown IP addresses. Requesting security audit and access log review.",
        status: "active",
        priority: "critical",
        flag: "important",
        email_id: "security-alert-008@company.com",
        caller_details: {
            first_name: "Rachel",
            last_name: "Anderson",
            email: "rachel.anderson@secure.com",
            phone_number: "+1-555-2011"
        }
    },
    {
        title: "Mobile App Installation Problems",
        description: "Unable to install the mobile application on iOS devices. App Store shows compatibility issues with latest iOS version.",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Chris",
            last_name: "Thompson",
            email: "chris.thompson@mobile.com",
            phone_number: "+1-555-2012"
        }
    },
    {
        title: "Refund Request for Duplicate Charge",
        description: "Was charged twice for the same service this month. Need assistance processing a refund for the duplicate transaction.",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "refund-request-009@company.com",
        caller_details: {
            first_name: "Nicole",
            last_name: "White",
            email: "nicole.white@email.net",
            phone_number: "+1-555-2013"
        }
    },
    {
        title: "GDPR Compliance Data Request",
        description: "Requesting access to all personal data stored in accordance with GDPR regulations. Need complete data export within 30 days.",
        status: "pending",
        priority: "medium",
        flag: "important",
        email_id: "gdpr-request-010@company.com",
        caller_details: {
            first_name: "Daniel",
            last_name: "Moore",
            email: "daniel.moore@privacy.org",
            phone_number: "+1-555-2014"
        }
    },
    {
        title: "Dashboard Widget Configuration Help",
        description: "Need assistance configuring custom dashboard widgets. The documentation seems outdated and some features are missing.",
        status: "resolved",
        priority: "low",
        flag: "moderate",
        email_id: null,
        caller_details: {
            first_name: "Stephanie",
            last_name: "Lee",
            email: "stephanie.lee@config.com",
            phone_number: "+1-555-2015"
        }
    },
    {
        title: "Database Backup Restoration Issue",
        description: "Need urgent help restoring database from last week's backup. Current database appears to be corrupted after power outage.",
        status: "escalated",
        priority: "critical",
        flag: "important",
        email_id: "db-restore-011@company.com",
        caller_details: {
            first_name: "Mark",
            last_name: "Robinson",
            email: "mark.robinson@database.com",
            phone_number: "+1-555-2016"
        },
        escalation: {
            reason: "Database corruption is preventing all business operations"
        }
    },
    {
        title: "Email Notifications Not Sending",
        description: "Automated email notifications stopped working since yesterday. Users are not receiving important system alerts and updates.",
        status: "active",
        priority: "high",
        flag: "important",
        email_id: "email-system-012@company.com",
        caller_details: {
            first_name: "Catherine",
            last_name: "Miller",
            email: "catherine.miller@notify.com",
            phone_number: "+1-555-2017"
        }
    },
    {
        title: "User Permission Management Issue",
        description: "Unable to modify user permissions in the admin panel. Getting 'Access Denied' error despite having admin privileges.",
        status: "pending",
        priority: "medium",
        flag: "moderate",
        email_id: "permissions-013@company.com",
        caller_details: {
            first_name: "Brian",
            last_name: "Wilson",
            email: "brian.wilson@admin.com",
            phone_number: "+1-555-2018"
        }
    },
    {
        title: "API Rate Limit Exceeded Error",
        description: "Our application is hitting API rate limits during normal operation. Need assistance increasing limits or optimizing API calls.",
        status: "active",
        priority: "medium",
        flag: "moderate",
        email_id: "api-limits-014@company.com",
        caller_details: {
            first_name: "Melissa",
            last_name: "Clark",
            email: "melissa.clark@api.com",
            phone_number: "+1-555-2019"
        }
    },
    {
        title: "Suspicious Activity Report Generation",
        description: "Need assistance generating compliance reports for suspicious activity. The automated report system is not capturing all required data fields.",
        status: "pending",
        priority: "high",
        flag: "important",
        email_id: "compliance-015@company.com",
        caller_details: {
            first_name: "Thomas",
            last_name: "Harris",
            email: "thomas.harris@compliance.gov",
            phone_number: "+1-555-2020"
        }
    }
];





export async function initializeData() {
    try {
        await User.deleteMany().then(() => console.log('Cleared existing users.'));
        await Customer.deleteMany().then(() => console.log('Cleared existing customers.'));
        await TicCat.deleteMany().then(() => console.log('Cleared existing ticket categories.'));
        await Ticket.deleteMany().then(() => console.log('Cleared existing tickets.'));
        console.log('seeding data...');

        // Seed users, customers, and categories first
        const seededUsers = await User.insertMany(userSeedData);
        console.log('Users seeded successfully.');

        const seededCustomers = await Customer.insertMany(customerSeedData);
        console.log('Customers seeded successfully.');

        const seededCategories = await TicCat.insertMany(ticCatSeedData);
        console.log('Ticket categories seeded successfully.');

        // Extract IDs for random assignment
        const userIds = seededUsers.map(user => user._id);
        const customerIds = seededCustomers.map(customer => customer._id);
        const categoryIds = seededCategories.map(category => category._id);

        // Function to get random ID from array
        const getRandomId = (array: any[]) => array[Math.floor(Math.random() * array.length)];

        // Function to get random user ID with specific role (for escalation)
        const getRandomUserByRole = (role: string) => {
            const usersWithRole = seededUsers.filter(user => user.role === role);
            return usersWithRole.length > 0 ?
                usersWithRole[Math.floor(Math.random() * usersWithRole.length)]._id :
                getRandomId(userIds);
        };

        // Create tickets with random assignments
        const ticketsToInsert = ticketSeedData.map(ticket => ({
            ...ticket,
            assigned_agent: getRandomId(userIds),
            customer: getRandomId(customerIds),
            category: getRandomId(categoryIds),
            // Add escalation.raised_by for escalated tickets
            ...(ticket.escalation && {
                escalation: {
                    ...ticket.escalation,
                    raised_by: getRandomUserByRole('manager') // Assign manager or admin for escalations
                }
            })
        }));

        await Ticket.insertMany(ticketsToInsert);
        console.log('Tickets seeded successfully.');

        console.log('Database seeding completed');
        console.log(`Seeded ${seededUsers.length} users, ${seededCustomers.length} customers, ${seededCategories.length} categories, and ${ticketsToInsert.length} tickets`);
    } catch (error) {
        console.error('Database seeding failed:', error);
    }
}