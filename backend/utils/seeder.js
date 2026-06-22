const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Assessment = require('../models/Assessment');
const Review = require('../models/Review');

const defaultCoursesData = [
  {
    title: 'React JS Development',
    category: 'Web Development',
    description: 'Learn React JS from scratch. Master components, state, hooks, routing, and context API. Build modern interactive single page applications.',
    difficulty: 'Intermediate',
    price: 49.99,
    duration: 75,
    tags: ['react', 'javascript', 'frontend'],
    lectures: [
      { title: 'What is React and Why React?', isFree: true, videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' },
      { title: 'Setting Up React Project', isFree: false, videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' },
      { title: 'Functional Components & Props', isFree: false, videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' },
      { title: 'Understanding Hooks: useState & useEffect', isFree: false, videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' }
    ]
  },
  {
    title: 'Django Backend Masterclass',
    category: 'Web Development',
    description: 'Dive deep into backend web design with Django. Learn MVC architecture, models, database relations, REST APIs, and authentication.',
    difficulty: 'Intermediate',
    price: 39.99,
    duration: 110,
    tags: ['django', 'python', 'backend'],
    lectures: [
      { title: 'Setting Up Django & Server Routing', isFree: true, videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
      { title: 'Django Views & HTTP Requests', isFree: false, videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
      { title: 'Models, Migrations & SQLite Admin', isFree: false, videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
      { title: 'Integrating Templates & CSS', isFree: false, videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' }
    ]
  },
  {
    title: 'Node JS & Express Development',
    category: 'Web Development',
    description: 'Build fast, scalable server-side web applications with Node.js and Express. Manage asynchronous processes, filesystem APIs, and MongoDB routing.',
    difficulty: 'Advanced',
    price: 0,
    duration: 50,
    tags: ['nodejs', 'express', 'backend'],
    lectures: [
      { title: 'Introduction to Asynchronous Engine', isFree: true, videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' },
      { title: 'Node Modules & File Streams', isFree: false, videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' }
    ]
  },
  {
    title: 'Cyber Security Essentials',
    category: 'Cybersecurity',
    description: 'Master network security, system administration, cryptography basics, firewall configuration, and vulnerability analysis to safeguard business assets.',
    difficulty: 'Beginner',
    price: 0,
    duration: 60,
    tags: ['security', 'network', 'cybersecurity'],
    lectures: [
      { title: 'The CIA Triad & Cryptography Principles', isFree: true, videoUrl: 'https://www.youtube.com/embed/i8Z0q0qh4Yc' },
      { title: 'Network Scanners & Port Analysis', isFree: false, videoUrl: 'https://www.youtube.com/embed/i8Z0q0qh4Yc' }
    ]
  },
  {
    title: 'Machine Learning Fundamentals',
    category: 'Machine Learning',
    description: 'Learn the mathematical foundations and core algorithms of Machine Learning. Covers supervised learning, classification, neural networks, and Python integrations.',
    difficulty: 'Advanced',
    price: 59.99,
    duration: 60,
    tags: ['ml', 'data-science', 'python'],
    lectures: [
      { title: 'Linear Regression & Cost Minimization', isFree: true, videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0' },
      { title: 'Logistic Regression & Binary Classification', isFree: false, videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0' }
    ]
  },
  {
    title: 'JavaScript Fundamentals & Scope',
    category: 'Programming Languages',
    description: 'Learn the core principles of JavaScript. Master variables, scope, hoisting, closures, datatypes, and build modern interactive web programs.',
    difficulty: 'Beginner',
    price: 0,
    duration: 65,
    tags: ['javascript', 'js', 'frontend'],
    lectures: [
      { title: 'Introduction to JavaScript', isFree: true, videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
      { title: 'Setting up developer environment', isFree: false, videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
      { title: 'Understanding Variables & Hoisting', isFree: false, videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
      { title: 'Data Types in JavaScript', isFree: false, videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' }
    ]
  },
  {
    title: 'Natural Language Processing (NLP)',
    category: 'Data Science',
    description: 'Understand how text algorithms process language. Covers tokenization, TF-IDF, Word Embeddings, Transformers, and fine-tuning language models.',
    difficulty: 'Advanced',
    price: 79.99,
    duration: 45,
    tags: ['nlp', 'ai', 'data-science'],
    lectures: [
      { title: 'Tokenization, Stemming & Lemmatization', isFree: true, videoUrl: 'https://www.youtube.com/embed/fOvTtapxa9c' },
      { title: 'Word Vectors & Semantic Maps', isFree: false, videoUrl: 'https://www.youtube.com/embed/fOvTtapxa9c' }
    ]
  },
  {
    title: 'Retrieval Augmented Generation (RAG)',
    category: 'Data Science',
    description: 'Learn the state-of-the-art technique in GenAI. Build pipelines that index files in vector stores, retrieve relevant contexts, and prompt LLMs dynamically.',
    difficulty: 'Advanced',
    price: 99.99,
    duration: 55,
    tags: ['rag', 'genai', 'vector-db'],
    lectures: [
      { title: 'Embedding Models & Chunking strategies', isFree: true, videoUrl: 'https://www.youtube.com/embed/sVcwVQRHIc8' },
      { title: 'Vector Database Indexing & Searching', isFree: false, videoUrl: 'https://www.youtube.com/embed/sVcwVQRHIc8' }
    ]
  },
  {
    title: 'Photoshop Design Foundations',
    category: 'Design',
    description: 'Master photo editing, background removals, layout masking, vector shapes, layers panel, and exporting design cards with Adobe Photoshop.',
    difficulty: 'Beginner',
    price: 19.99,
    duration: 40,
    tags: ['photoshop', 'ps', 'design'],
    lectures: [
      { title: 'Exploring Layout tools & Layers Panel', isFree: true, videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs' },
      { title: 'Basic Selection & Background Masking', isFree: false, videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs' }
    ]
  },
  {
    title: 'Professional Video Editing',
    category: 'Video Editing',
    description: 'Learn professional video storytelling, cutting clips, timeline controls, color grading, sound mixing, and transitions in Premiere Pro.',
    difficulty: 'Beginner',
    price: 29.99,
    duration: 45,
    tags: ['video', 'editing', 'premiere'],
    lectures: [
      { title: 'Timeline Setup & Importing Media', isFree: true, videoUrl: 'https://www.youtube.com/embed/8eDsvKwM40U' },
      { title: 'Audio Alignments & Color Adjustments', isFree: false, videoUrl: 'https://www.youtube.com/embed/8eDsvKwM40U' }
    ]
  },
  {
    title: 'Python Programming Bootcamp',
    category: 'Programming Languages',
    description: 'A complete introduction to Python programming. Master data collections, control flows, file operations, error handling, and OOP concepts.',
    difficulty: 'Beginner',
    price: 0,
    duration: 55,
    tags: ['python', 'basics', 'programming'],
    lectures: [
      { title: 'Python Syntax & Dynamic Typing', isFree: true, videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw' },
      { title: 'Data Structures: Lists, Dicts & Tuples', isFree: false, videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw' }
    ]
  },
  {
    title: 'C Programming for Foundations',
    category: 'Programming Languages',
    description: 'Understand system-level development. Learn pointers, memory allocation, structure alignment, code headers, and compiling simple C files.',
    difficulty: 'Beginner',
    price: 0,
    duration: 40,
    tags: ['c', 'compilers', 'pointers'],
    lectures: [
      { title: 'Variables, If statements & Compilers', isFree: true, videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0' },
      { title: 'Pointers & Address Declarations', isFree: false, videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0' }
    ]
  },
  {
    title: 'C++ Systems Programming',
    category: 'Programming Languages',
    description: 'Unlock object-oriented systems design. Covers C++ classes, constructors, destructor alignment, virtual functions, templates, and STL library.',
    difficulty: 'Intermediate',
    price: 39.99,
    duration: 50,
    tags: ['cpp', 'classes', 'stl'],
    lectures: [
      { title: 'Classes, Objects & Virtual Descriptors', isFree: true, videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y' },
      { title: 'Standard Template Library (STL)', isFree: false, videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y' }
    ]
  },
  {
    title: 'Go Language (Golang) Essentials',
    category: 'Programming Languages',
    description: 'Learn Go, the programming language designed for backend microservices. Covers goroutines, channel routing, interfaces, and testing packages.',
    difficulty: 'Intermediate',
    price: 45.00,
    duration: 45,
    tags: ['golang', 'go', 'concurrency'],
    lectures: [
      { title: 'Go Structs, Interfaces & Pointers', isFree: true, videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo' },
      { title: 'Concurrency: Goroutines & Channels', isFree: false, videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo' }
    ]
  },
  {
    title: 'Cloud Computing Essentials',
    category: 'Cloud Computing',
    description: 'Understand cloud services, dynamic infrastructure, load balancers, server scalability, and billing metrics on AWS, GCP, and Azure.',
    difficulty: 'Beginner',
    price: 0,
    duration: 40,
    tags: ['aws', 'cloud', 'architecture'],
    lectures: [
      { title: 'Cloud Models: IaaS, PaaS & SaaS', isFree: true, videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc' },
      { title: 'Virtual Machines & Storage Blocks', isFree: false, videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc' }
    ]
  },
  {
    title: 'Introduction to Computer Science',
    category: 'Computer Science',
    description: 'Dive into the world of CS. Covers Harvard CS50 curriculum principles, binary system, code layouts, variables, statements, and algorithms.',
    difficulty: 'Beginner',
    price: 0,
    duration: 60,
    tags: ['cs50', 'fundamentals', 'binary'],
    lectures: [
      { title: 'Harvard CS50 Course Introduction', isFree: true, videoUrl: 'https://www.youtube.com/embed/LfaMVlDaQ24' },
      { title: 'Binary, Data & Code compilation', isFree: false, videoUrl: 'https://www.youtube.com/embed/LfaMVlDaQ24' }
    ]
  },
  {
    title: 'Responsive Web Design (HTML/CSS)',
    category: 'Design',
    description: 'Learn HTML5 and CSS3 layouts, wireframes, styling principles, typography selection, CSS Flexbox and responsive grids to build gorgeous pages.',
    difficulty: 'Beginner',
    price: 49.99,
    duration: 50,
    tags: ['html', 'css', 'responsive'],
    lectures: [
      { title: 'Responsive Design Principles', isFree: true, videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc' },
      { title: 'Flexbox, Grid & Media Queries', isFree: false, videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc' }
    ]
  },
  {
    title: 'Data Science foundations',
    category: 'Data Science',
    description: 'Master statistics, probability models, Python pandas dataframe pipelines, matrix analysis, and data plotting to explore complex datasets.',
    difficulty: 'Intermediate',
    price: 69.99,
    duration: 55,
    tags: ['pandas', 'numpy', 'statistics'],
    lectures: [
      { title: 'Intro to Statistics & Probability', isFree: true, videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30' },
      { title: 'Pandas Dataframes & Matplotlib', isFree: false, videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Check if the React course is already seeded
    const reactCourseExists = await Course.findOne({ title: 'React JS Development' });
    if (reactCourseExists) {
      console.log('ℹ️ Default courses already seeded. Skipping seeding.');
      return;
    }

    console.log('🌱 Starting automatic database seeding...');
    
    // Clear old data to avoid duplication/clutter of half-empty DBs
    await Course.deleteMany({});
    await Lecture.deleteMany({});
    await Assessment.deleteMany({});
    await Review.deleteMany({});

    // Find or create default Instructor
    let instructor = await User.findOne({ email: 'instructor@lms.com' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Default Instructor',
        email: 'instructor@lms.com',
        password: 'Instructor@123',
        role: 'instructor',
        avatar: 'I'
      });
      console.log('✅ Created Default Instructor profile.');
    }

    // Find or create default Student
    let student = await User.findOne({ email: 'student@lms.com' });
    if (!student) {
      student = await User.create({
        name: 'Default Student',
        email: 'student@lms.com',
        password: 'Student@123',
        role: 'student',
        avatar: 'S'
      });
      console.log('✅ Created Default Student profile.');
    }

    // Seed courses
    for (const cData of defaultCoursesData) {
      const course = await Course.create({
        title: cData.title,
        description: cData.description,
        category: cData.category,
        difficulty: cData.difficulty,
        price: cData.price,
        tags: cData.tags,
        instructor: instructor._id,
        isPublished: true,
        duration: cData.duration
      });

      // Create lectures
      const lectureIds = [];
      for (let i = 0; i < cData.lectures.length; i++) {
        const lecData = cData.lectures[i];
        const lecture = await Lecture.create({
          course: course._id,
          title: lecData.title,
          description: `Master variables and core structure of ${course.title}.`,
          videoUrl: lecData.videoUrl,
          publicId: `mock_${course._id}_lec_${i}`,
          duration: 900, // 15 mins
          order: i + 1,
          isFree: lecData.isFree
        });
        lectureIds.push(lecture._id);
      }

      // Link lectures back to course
      course.lectures = lectureIds;
      await course.save();

      // Create a default MCQ assessment/quiz for the course
      await Assessment.create({
        course: course._id,
        title: `${course.title} Quiz`,
        description: `Test your understanding of the concepts introduced in ${course.title}.`,
        passingScore: 60,
        attempts: 3,
        isPublished: true,
        questions: [
          {
            questionText: `What is the primary usage of ${course.title}?`,
            options: [
              'Building scalable, maintainable architectures',
              'Low-level registers control',
              'Unstructured system virtualization',
              'None of the above'
            ],
            correctAnswer: 0
          },
          {
            questionText: 'Which of the following describes a key design rule?',
            options: [
              'Writing verbose spaghetti code',
              'Modularity and separation of concerns',
              'Avoiding proper linting protocols',
              'Over-complicating function arguments'
            ],
            correctAnswer: 1
          }
        ]
      });

      // Leave a default high-quality review
      await Review.create({
        course: course._id,
        student: student._id,
        rating: 5,
        review: `This is an absolutely fantastic course on ${course.title}! The explanation is extremely clear and structured.`
      });
    }

    console.log('🎉 Database seeding completed successfully! 18 technical course tracks populated.');
  } catch (err) {
    console.error('❌ Database seeding failed:', err.message);
  }
};

module.exports = { seedDatabase };
