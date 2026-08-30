import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobconnect.settings')
django.setup()

from accounts.models import User, SeekerProfile
from companies.models import Company
from jobs.models import Category, Skill, Job, SavedJob
from applications.models import Application

def seed_database():
    print("🌱 Starting database seeding for JobConnect...")

    # 1. Create Admin Account
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@jobconnect.com',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'ADMIN',
            'is_staff': True,
            'is_superuser': True,
            'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("  ✅ Admin user created: admin@jobconnect.com / admin123")

    # 2. Create Employer 1
    emp1_user, created = User.objects.get_or_create(
        username='employer_abc',
        defaults={
            'email': 'employer@techcorp.com',
            'first_name': 'Anand',
            'last_name': 'Verma',
            'role': 'EMPLOYER',
            'phone': '+91 98765 43210',
            'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        emp1_user.set_password('employer123')
        emp1_user.save()

    company1, created = Company.objects.get_or_create(
        owner=emp1_user,
        defaults={
            'name': 'ABC Technologies',
            'logo_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
            'website': 'https://abctechnologies.example.com',
            'industry': 'IT & Software Development',
            'location': 'Chennai, Tamil Nadu',
            'about': 'ABC Technologies is a premier cloud software engineering and digital transformation provider empowering enterprise clients worldwide.',
            'size': '100-500 employees'
        }
    )

    # Employer 2
    emp2_user, created = User.objects.get_or_create(
        username='employer_datawave',
        defaults={
            'email': 'employer2@datawave.com',
            'first_name': 'Deepak',
            'last_name': 'Reddy',
            'role': 'EMPLOYER',
            'phone': '+91 91234 56789',
            'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        emp2_user.set_password('employer123')
        emp2_user.save()

    company2, created = Company.objects.get_or_create(
        owner=emp2_user,
        defaults={
            'name': 'DataWave Analytics',
            'logo_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80',
            'website': 'https://datawave.example.com',
            'industry': 'Data Science & AI',
            'location': 'Bangalore, Karnataka',
            'about': 'Leading AI and big data intelligence engine powering smart decision automation for fintech & retail leaders.',
            'size': '50-200 employees'
        }
    )

    # Employer 3
    emp3_user, created = User.objects.get_or_create(
        username='employer_designhub',
        defaults={
            'email': 'hr@designhub.com',
            'first_name': 'Sarah',
            'last_name': 'Jenkins',
            'role': 'EMPLOYER',
            'avatar_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        emp3_user.set_password('employer123')
        emp3_user.save()

    company3, created = Company.objects.get_or_create(
        owner=emp3_user,
        defaults={
            'name': 'DesignHub Studio',
            'logo_url': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=150&q=80',
            'website': 'https://designhub.example.com',
            'industry': 'UI/UX & Product Design',
            'location': 'Hyderabad / Remote',
            'about': 'Creative product design studio crafting world-class mobile apps and web experiences.',
            'size': '20-50 employees'
        }
    )
    print("  ✅ Employer accounts & companies initialized.")

    # 3. Create Categories matching screenshot
    categories_data = [
        {'name': 'IT & Software', 'icon': 'Code', 'description': 'Full Stack, Backend, Frontend, and Cloud Software Engineering'},
        {'name': 'Data Science', 'icon': 'Database', 'description': 'AI, Machine Learning, Data Analytics, and Big Data'},
        {'name': 'Design', 'icon': 'Palette', 'description': 'UI/UX Design, Graphic Design, Product Design'},
        {'name': 'Mobile Development', 'icon': 'Smartphone', 'description': 'Android, iOS, React Native, and Flutter'},
        {'name': 'Business', 'icon': 'Briefcase', 'description': 'Business Analysis, Project Management, Strategy'},
        {'name': 'Healthcare', 'icon': 'HeartPulse', 'description': 'HealthTech, Medical Devices, Clinical Informatics'},
        {'name': 'Marketing', 'icon': 'TrendingUp', 'description': 'Digital Marketing, SEO, Growth Hacking, Content'},
        {'name': 'Finance', 'icon': 'Coins', 'description': 'Fintech, Accounting, Investment Banking, Audit'},
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = Category.objects.get_or_create(name=c_data['name'], defaults=c_data)
        cat_map[c_data['name']] = cat
    print(f"  ✅ {len(cat_map)} Categories created.")

    # 4. Create Job Seekers
    seeker1, created = User.objects.get_or_create(
        username='rahul_seeker',
        defaults={
            'email': 'seeker@gmail.com',
            'first_name': 'Rahul',
            'last_name': 'Kumar',
            'role': 'SEEKER',
            'phone': '+91 99887 76655',
            'avatar_url': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        seeker1.set_password('seeker123')
        seeker1.save()

    profile1, _ = SeekerProfile.objects.get_or_create(
        user=seeker1,
        defaults={
            'headline': 'Python Full Stack Developer | Django & React',
            'bio': 'Passionate software developer with 2+ years experience building scalable Web APIs and responsive React applications.',
            'experience_years': 2,
            'current_location': 'Chennai',
            'preferred_location': 'Chennai / Remote',
            'expected_salary': '₹6 - ₹8 LPA',
            'skills': ['Python', 'Django', 'React', 'PostgreSQL', 'REST API', 'Tailwind CSS'],
            'resume_url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'resume_filename': 'Rahul_Kumar_Resume.pdf',
            'education': [{'degree': 'B.E. Computer Science', 'institution': 'Anna University', 'year': '2023', 'grade': '8.5 CGPA'}],
            'experience': [{'title': 'Junior Python Developer', 'company': 'InnoTech Systems', 'duration': '2023 - Present', 'description': 'Built REST endpoints in DRF and integrated Postgres database.'}],
            'github_url': 'https://github.com/rahulkumar-dev',
            'linkedin_url': 'https://linkedin.com/in/rahulkumar-dev'
        }
    )

    seeker2, created = User.objects.get_or_create(
        username='priya_designer',
        defaults={
            'email': 'seeker2@gmail.com',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'role': 'SEEKER',
            'phone': '+91 98112 23344',
            'avatar_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
        }
    )
    if created:
        seeker2.set_password('seeker123')
        seeker2.save()

    profile2, _ = SeekerProfile.objects.get_or_create(
        user=seeker2,
        defaults={
            'headline': 'UI/UX & Product Designer',
            'bio': 'Creative visual designer specialized in user research, wireframing, Figma prototyping, and modern design systems.',
            'experience_years': 3,
            'current_location': 'Bangalore',
            'preferred_location': 'Bangalore / Remote',
            'expected_salary': '₹8 - ₹12 LPA',
            'skills': ['Figma', 'UI/UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
            'resume_url': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'resume_filename': 'Priya_Sharma_UX_Resume.pdf',
            'portfolio_url': 'https://priyasharma.design'
        }
    )
    print("  ✅ Job Seeker accounts & profiles created.")

    # 5. Create Sample Jobs matching screenshot & listing requirements
    jobs_data = [
        {
            'employer': emp1_user,
            'company': company1,
            'category': cat_map['IT & Software'],
            'title': 'Python Developer',
            'job_type': 'FULL_TIME',
            'experience_level': 'FRESHER',
            'location': 'Chennai',
            'salary_min': 400000,
            'salary_max': 700000,
            'salary_text': '₹4 - ₹7 LPA',
            'skills_required': ['Python', 'Django', 'SQL', 'REST APIs', 'Git'],
            'description': 'We are looking for a enthusiastic Python Developer to design and develop scalable web applications using Django & Django REST Framework.',
            'responsibilities': '• Develop robust backend APIs using Django REST Framework.\n• Integrate database queries with PostgreSQL and Supabase.\n• Collaborate with frontend developers to construct seamless API contracts.',
            'requirements': '• Strong proficiency in Python 3, object-oriented concepts, and Django.\n• Basic understanding of SQL databases and REST architectures.\n• Good problem solving skills and passion for clean code.',
            'is_featured': True,
            'is_active': True,
        },
        {
            'employer': emp3_user,
            'company': company3,
            'category': cat_map['Design'],
            'title': 'UI/UX Designer',
            'job_type': 'REMOTE',
            'experience_level': 'MID',
            'location': 'Remote / Bangalore',
            'salary_min': 500000,
            'salary_max': 900000,
            'salary_text': '₹5 - ₹9 LPA',
            'skills_required': ['Figma', 'Wireframing', 'UI/UX Design', 'Prototyping'],
            'description': 'Craft elegant user journeys, visual components, and interactive prototypes for SaaS applications.',
            'responsibilities': '• Conduct user research and create user personas.\n• Build high-fidelity Figma components and design system libraries.\n• Perform usability testing on mobile & desktop web applications.',
            'requirements': '• 2+ years experience in Figma, Adobe XD, or Sketch.\n• Strong portfolio demonstrating end-to-end design process.',
            'is_featured': True,
            'is_active': True,
        },
        {
            'employer': emp2_user,
            'company': company2,
            'category': cat_map['Data Science'],
            'title': 'Data Scientist',
            'job_type': 'FULL_TIME',
            'experience_level': 'JUNIOR',
            'location': 'Bangalore',
            'salary_min': 600000,
            'salary_max': 1000000,
            'salary_text': '₹6 - ₹10 LPA',
            'skills_required': ['Python', 'Pandas', 'Scikit-Learn', 'SQL', 'Machine Learning'],
            'description': 'Analyze large data streams, train predictive models, and deliver actionable analytics dashboards.',
            'responsibilities': '• Clean and analyze structured and unstructured dataset streams.\n• Implement predictive ML models using Python and PyTorch/Scikit-Learn.\n• Present findings to technical stakeholders.',
            'requirements': '• Bachelor\'s degree in Computer Science, Data Science, or Statistics.\n• Hands-on proficiency with Pandas, NumPy, SQL, and Matplotlib.',
            'is_featured': True,
            'is_active': True,
        },
        {
            'employer': emp1_user,
            'company': company1,
            'category': cat_map['IT & Software'],
            'title': 'Backend Developer',
            'job_type': 'FULL_TIME',
            'experience_level': 'MID',
            'location': 'Chennai / Remote',
            'salary_min': 700000,
            'salary_max': 1200000,
            'salary_text': '₹7 - ₹12 LPA',
            'skills_required': ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
            'description': 'Build microservices architectures, high-performance API gateways, and asynchronous task queues.',
            'responsibilities': '• Maintain microservices handling millions of daily API requests.\n• Optimize SQL queries and Redis caching layers.\n• Containerize services using Docker & Kubernetes.',
            'requirements': '• 3+ years experience with Python backend frameworks.\n• Deep knowledge of relational databases and caching strategies.',
            'is_featured': True,
            'is_active': True,
        },
        {
            'employer': emp1_user,
            'company': company1,
            'category': cat_map['IT & Software'],
            'title': 'Frontend Developer',
            'job_type': 'FULL_TIME',
            'experience_level': 'JUNIOR',
            'location': 'Bangalore',
            'salary_min': 500000,
            'salary_max': 800000,
            'salary_text': '₹5 - ₹8 LPA',
            'skills_required': ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'HTML5'],
            'description': 'Join our frontend engineering team to build sleek, lightning-fast web applications using React.js.',
            'responsibilities': '• Translate Figma specs into clean React components.\n• Integrate RESTful endpoints and state management.\n• Ensure cross-browser responsiveness and accessibility.',
            'requirements': '• Strong proficiency with JavaScript (ES6+), React.js, and CSS/Tailwind.\n• Familiarity with Axios and state management libraries.',
            'is_featured': False,
            'is_active': True,
        },
        {
            'employer': emp2_user,
            'company': company2,
            'category': cat_map['Mobile Development'],
            'title': 'Flutter Developer',
            'job_type': 'CONTRACT',
            'experience_level': 'JUNIOR',
            'location': 'Remote',
            'salary_min': 450000,
            'salary_max': 750000,
            'salary_text': '₹4.5 - ₹7.5 LPA',
            'skills_required': ['Flutter', 'Dart', 'Firebase', 'REST API'],
            'description': 'Develop cross-platform iOS & Android mobile applications using Flutter framework.',
            'responsibilities': '• Build beautiful mobile interfaces with responsive Dart components.\n• Integrate Supabase & Firebase authentication and push notifications.',
            'requirements': '• Experience delivering at least 1 published Flutter application.',
            'is_featured': False,
            'is_active': True,
        }
    ]

    created_jobs = []
    for j_data in jobs_data:
        job, _ = Job.objects.get_or_create(
            title=j_data['title'],
            company=j_data['company'],
            defaults=j_data
        )
        created_jobs.append(job)
    print(f"  ✅ {len(created_jobs)} Job listings seeded.")

    # 6. Create Applications
    app1, _ = Application.objects.get_or_create(
        job=created_jobs[0], # Python Developer
        seeker=seeker1, # Rahul
        defaults={
            'resume_url': profile1.resume_url,
            'resume_filename': profile1.resume_filename,
            'cover_note': 'I am extremely excited to apply for the Python Developer position at ABC Technologies!',
            'status': 'SHORTLISTED',
            'employer_notes': 'Strong Python & DRF foundation. Scheduled for technical interview round.'
        }
    )

    app2, _ = Application.objects.get_or_create(
        job=created_jobs[1], # UI/UX Designer
        seeker=seeker2, # Priya
        defaults={
            'resume_url': profile2.resume_url,
            'resume_filename': profile2.resume_filename,
            'cover_note': 'Check out my portfolio at priyasharma.design!',
            'status': 'INTERVIEW',
            'employer_notes': 'Impressive portfolio. Technical interview set for Friday.'
        }
    )

    app3, _ = Application.objects.get_or_create(
        job=created_jobs[3], # Backend Developer
        seeker=seeker1, # Rahul
        defaults={
            'resume_url': profile1.resume_url,
            'resume_filename': profile1.resume_filename,
            'cover_note': 'Looking forward to discussing backend architecture.',
            'status': 'UNDER_REVIEW',
        }
    )
    print("  ✅ Sample applications seeded.")

    # 7. Create Saved Jobs
    SavedJob.objects.get_or_create(user=seeker1, job=created_jobs[1])
    SavedJob.objects.get_or_create(user=seeker1, job=created_jobs[2])
    print("  ✅ Saved jobs initialized.")

    print("\n🎉 Database Seeding Complete!")
    print("--------------------------------------------------")
    print("Demo Credentials for Quick Testing:")
    print("  👑 Admin:     admin@jobconnect.com / admin123")
    print("  🏢 Employer:  employer@techcorp.com / employer123")
    print("  👨💼 Seeker:    seeker@gmail.com / seeker123")
    print("--------------------------------------------------\n")

if __name__ == '__main__':
    seed_database()
