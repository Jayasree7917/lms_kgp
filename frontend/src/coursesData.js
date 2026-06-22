// Import All Course Image Assets
import djangoImg from './assets/Django.jpg';
import nodeImg from './assets/Node.jpg';
import reactImg from './assets/React.jpg';
import cppImg from './assets/c++programming.jpg';
import cImg from './assets/c-programming.jpg';
import cloudImg from './assets/cloudcomputing.jpg';
import cyberImg from './assets/cybersecurity.jpg';
import goImg from './assets/golang.png';
import mlImg from './assets/ml.jpg';
import nlpImg from './assets/nlp.jpg';
import psImg from './assets/ps.jpg';
import pythonImg from './assets/python.jpg';
import ragImg from './assets/rag.png';
import videoImg from './assets/videoediting.jpg';
import jsImg from './assets/javascript_course_thumb.png';
import compSciImg from './assets/computer_science_thumb.png';
import webDesignImg from './assets/web_design_thumb.png';
import dataScienceImg from './assets/data_science_thumb.png';

// Course Mock Database with Structure & YouTube Embed URLs
export const INITIAL_COURSES = [
  {
    id: 1,
    title: 'React JS Development',
    category: 'Technology',
    rating: 4.9,
    reviews: 1420,
    duration: '6 weeks',
    difficulty: 'Intermediate',
    instructor: 'Alex Rivera',
    price: '$49.99',
    icon: '⚛️',
    image: reactImg,
    description: 'Learn React JS from scratch. Master components, state, hooks, routing, and context API. Build modern interactive single page applications.',
    structure: [
      {
        title: 'Getting Started with React',
        totalTime: '35 minutes',
        lectures: [
          { id: 'react1', code: '1.1', title: 'What is React and Why React?', duration: '15 minutes', videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' },
          { id: 'react2', code: '1.2', title: 'Setting Up React Project', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' }
        ]
      },
      {
        title: 'Components and Props',
        totalTime: '40 minutes',
        lectures: [
          { id: 'react3', code: '2.1', title: 'Functional Components & Props', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' },
          { id: 'react4', code: '2.2', title: 'Understanding Hooks: useState & useEffect', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/DLX62G4lc44' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Django Backend Masterclass',
    category: 'Technology',
    rating: 4.8,
    reviews: 950,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    instructor: 'Prof. Michael Chen',
    price: '$39.99',
    icon: '🐍',
    image: djangoImg,
    description: 'Dive deep into backend web design with Django. Learn MVC architecture, models, database relations, REST APIs, and authentication.',
    structure: [
      {
        title: 'Django Fundamentals',
        totalTime: '55 minutes',
        lectures: [
          { id: 'django1', code: '1.1', title: 'Setting Up Django & Server Routing', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
          { id: 'django2', code: '1.2', title: 'Django Views & HTTP Requests', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' }
        ]
      },
      {
        title: 'Django ORM & Admin Console',
        totalTime: '45 minutes',
        lectures: [
          { id: 'django3', code: '2.1', title: 'Models, Migrations & SQLite Admin', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
          { id: 'django4', code: '2.2', title: 'Integrating Templates & CSS', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Node JS & Express Development',
    category: 'Technology',
    rating: 4.7,
    reviews: 1100,
    duration: '6 weeks',
    difficulty: 'Advanced',
    instructor: 'Alex Rivera',
    price: 'Free',
    icon: '🟢',
    image: nodeImg,
    description: 'Build fast, scalable server-side web applications with Node.js and Express. Manage asynchronous processes, filesystem APIs, and MongoDB routing.',
    structure: [
      {
        title: 'Node JS Basics',
        totalTime: '50 minutes',
        lectures: [
          { id: 'node1', code: '1.1', title: 'Introduction to Asynchronous Engine', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' },
          { id: 'node2', code: '1.2', title: 'Node Modules & File Streams', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Cyber Security Essentials',
    category: 'Security',
    rating: 4.9,
    reviews: 1840,
    duration: '8 weeks',
    difficulty: 'Beginner',
    instructor: 'Emma Watson',
    price: 'Free',
    icon: '🛡️',
    image: cyberImg,
    description: 'Master network security, system administration, cryptography basics, firewall configuration, and vulnerability analysis to safeguard business assets.',
    structure: [
      {
        title: 'Intro to Cybersecurity',
        totalTime: '60 minutes',
        lectures: [
          { id: 'sec1', code: '1.1', title: 'The CIA Triad & Cryptography Principles', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/i8Z0q0qh4Yc' },
          { id: 'sec2', code: '1.2', title: 'Network Scanners & Port Analysis', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/i8Z0q0qh4Yc' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Machine Learning Fundamentals',
    category: 'Data Science',
    rating: 4.8,
    reviews: 2150,
    duration: '12 weeks',
    difficulty: 'Advanced',
    instructor: 'Prof. Michael Chen',
    price: '$59.99',
    icon: '🤖',
    image: mlImg,
    description: 'Learn the mathematical foundations and core algorithms of Machine Learning. Covers supervised learning, classification, neural networks, and Python integrations.',
    structure: [
      {
        title: 'Supervised Learning',
        totalTime: '60 minutes',
        lectures: [
          { id: 'ml1', code: '1.1', title: 'Linear Regression & Cost Minimization', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0' },
          { id: 'ml2', code: '1.2', title: 'Logistic Regression & Binary Classification', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'JavaScript Fundamentals & Scope',
    category: 'Technology',
    rating: 4.9,
    reviews: 1850,
    duration: '5 weeks',
    difficulty: 'Beginner',
    instructor: 'Dr. Sarah Jenkins',
    price: 'Free',
    icon: '🟨',
    image: jsImg,
    description: 'Learn the core principles of JavaScript. Master variables, scope, hoisting, closures, datatypes, and build modern interactive web programs.',
    structure: [
      {
        title: 'Getting Started with JavaScript',
        totalTime: '35 minutes',
        lectures: [
          { id: 'js1', code: '1.1', title: 'Introduction to JavaScript', duration: '15 minutes', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
          { id: 'js2', code: '1.2', title: 'Setting up developer environment', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' }
        ]
      },
      {
        title: 'Variables and Data Types',
        totalTime: '30 minutes',
        lectures: [
          { id: 'js3', code: '2.1', title: 'Understanding Variables & Hoisting', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
          { id: 'js4', code: '2.2', title: 'Data Types in JavaScript', duration: '10 minutes', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Natural Language Processing (NLP)',
    category: 'Data Science',
    rating: 4.8,
    reviews: 620,
    duration: '8 weeks',
    difficulty: 'Advanced',
    instructor: 'Prof. Michael Chen',
    price: '$79.99',
    icon: '💬',
    image: nlpImg,
    description: 'Understand how text algorithms process language. Covers tokenization, TF-IDF, Word Embeddings, Transformers, and fine-tuning language models.',
    structure: [
      {
        title: 'NLP Preprocessing',
        totalTime: '45 minutes',
        lectures: [
          { id: 'nlp1', code: '1.1', title: 'Tokenization, Stemming & Lemmatization', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/fOvTtapxa9c' },
          { id: 'nlp2', code: '1.2', title: 'Word Vectors & Semantic Maps', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/fOvTtapxa9c' }
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'Retrieval Augmented Generation (RAG)',
    category: 'Data Science',
    rating: 4.9,
    reviews: 580,
    duration: '6 weeks',
    difficulty: 'Advanced',
    instructor: 'Prof. Michael Chen',
    price: '$99.99',
    icon: '🧠',
    image: ragImg,
    description: 'Learn the state-of-the-art technique in GenAI. Build pipelines that index files in vector stores, retrieve relevant contexts, and prompt LLMs dynamically.',
    structure: [
      {
        title: 'RAG Architecture',
        totalTime: '55 minutes',
        lectures: [
          { id: 'rag1', code: '1.1', title: 'Embedding Models & Chunking strategies', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/sVcwVQRHIc8' },
          { id: 'rag2', code: '1.2', title: 'Vector Database Indexing & Searching', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/sVcwVQRHIc8' }
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'Photoshop Design Foundations',
    category: 'Design',
    rating: 4.7,
    reviews: 730,
    duration: '4 weeks',
    difficulty: 'Beginner',
    instructor: 'Alex Rivera',
    price: '$19.99',
    icon: '🖌️',
    image: psImg,
    description: 'Master photo editing, background removals, layout masking, vector shapes, layers panel, and exporting design cards with Adobe Photoshop.',
    structure: [
      {
        title: 'Getting Started with Photoshop',
        totalTime: '40 minutes',
        lectures: [
          { id: 'ps1', code: '1.1', title: 'Exploring Layout tools & Layers Panel', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs' },
          { id: 'ps2', code: '1.2', title: 'Basic Selection & Background Masking', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs' }
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Professional Video Editing',
    category: 'Design',
    rating: 4.8,
    reviews: 640,
    duration: '5 weeks',
    difficulty: 'Beginner',
    instructor: 'Alex Rivera',
    price: '$29.99',
    icon: '🎬',
    image: videoImg,
    description: 'Learn professional video storytelling, cutting clips, timeline controls, color grading, sound mixing, and transitions in Premiere Pro.',
    structure: [
      {
        title: 'Video Cut & Transitions',
        totalTime: '45 minutes',
        lectures: [
          { id: 've1', code: '1.1', title: 'Timeline Setup & Importing Media', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/8eDsvKwM40U' },
          { id: 've2', code: '1.2', title: 'Audio Alignments & Color Adjustments', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/8eDsvKwM40U' }
        ]
      }
    ]
  },
  {
    id: 11,
    title: 'Python Programming Bootcamp',
    category: 'Technology',
    rating: 4.9,
    reviews: 3100,
    duration: '8 weeks',
    difficulty: 'Beginner',
    instructor: 'Dr. Sarah Jenkins',
    price: 'Free',
    icon: '🐍',
    image: pythonImg,
    description: 'A complete introduction to Python programming. Master data collections, control flows, file operations, error handling, and OOP concepts.',
    structure: [
      {
        title: 'Python Essentials',
        totalTime: '55 minutes',
        lectures: [
          { id: 'py1', code: '1.1', title: 'Python Syntax & Dynamic Typing', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw' },
          { id: 'py2', code: '1.2', title: 'Data Structures: Lists, Dicts & Tuples', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw' }
        ]
      }
    ]
  },
  {
    id: 12,
    title: 'C Programming for Foundations',
    category: 'Technology',
    rating: 4.7,
    reviews: 420,
    duration: '6 weeks',
    difficulty: 'Beginner',
    instructor: 'Dr. Sarah Jenkins',
    price: 'Free',
    icon: '💻',
    image: cImg,
    description: 'Understand system-level development. Learn pointers, memory allocation, structure alignment, code headers, and compiling simple C files.',
    structure: [
      {
        title: 'C Fundamentals',
        totalTime: '40 minutes',
        lectures: [
          { id: 'c1', code: '1.1', title: 'Variables, If statements & Compilers', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0' },
          { id: 'c2', code: '1.2', title: 'Pointers & Address Declarations', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0' }
        ]
      }
    ]
  },
  {
    id: 13,
    title: 'C++ Systems Programming',
    category: 'Technology',
    rating: 4.8,
    reviews: 580,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    instructor: 'Dr. Sarah Jenkins',
    price: '$39.99',
    icon: '⚙️',
    image: cppImg,
    description: 'Unlock object-oriented systems design. Covers C++ classes, constructors, destructor alignment, virtual functions, templates, and STL library.',
    structure: [
      {
        title: 'OOP in C++',
        totalTime: '50 minutes',
        lectures: [
          { id: 'cpp1', code: '1.1', title: 'Classes, Objects & Virtual Descriptors', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y' },
          { id: 'cpp2', code: '1.2', title: 'Standard Template Library (STL)', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y' }
        ]
      }
    ]
  },
  {
    id: 14,
    title: 'Go Language (Golang) Essentials',
    category: 'Technology',
    rating: 4.9,
    reviews: 790,
    duration: '6 weeks',
    difficulty: 'Intermediate',
    instructor: 'Alex Rivera',
    price: '$45.00',
    icon: '🐹',
    image: goImg,
    description: 'Learn Go, the programming language designed for backend microservices. Covers goroutines, channel routing, interfaces, and testing packages.',
    structure: [
      {
        title: 'Go Structs & Routing',
        totalTime: '45 minutes',
        lectures: [
          { id: 'go1', code: '1.1', title: 'Go Structs, Interfaces & Pointers', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo' },
          { id: 'go2', code: '1.2', title: 'Concurrency: Goroutines & Channels', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo' }
        ]
      }
    ]
  },
  {
    id: 15,
    title: 'Cloud Computing Essentials',
    category: 'Technology',
    rating: 4.8,
    reviews: 670,
    duration: '5 weeks',
    difficulty: 'Beginner',
    instructor: 'Emma Watson',
    price: 'Free',
    icon: '☁️',
    image: cloudImg,
    description: 'Understand cloud services, dynamic infrastructure, load balancers, server scalability, and billing metrics on AWS, GCP, and Azure.',
    structure: [
      {
        title: 'Cloud Core Services',
        totalTime: '40 minutes',
        lectures: [
          { id: 'cloud1', code: '1.1', title: 'Cloud Models: IaaS, PaaS & SaaS', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc' },
          { id: 'cloud2', code: '1.2', title: 'Virtual Machines & Storage Blocks', duration: '20 minutes', videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc' }
        ]
      }
    ]
  },
  {
    id: 16,
    title: 'Introduction to Computer Science',
    category: 'Technology',
    rating: 4.8,
    reviews: 1200,
    duration: '8 weeks',
    difficulty: 'Beginner',
    instructor: 'Dr. Sarah Jenkins',
    price: 'Free',
    icon: '💻',
    image: compSciImg,
    description: 'Dive into the world of CS. Covers Harvard CS50 curriculum principles, binary system, code layouts, variables, statements, and algorithms.',
    structure: [
      {
        title: 'CS50 Foundations',
        totalTime: '60 minutes',
        lectures: [
          { id: 'csf1', code: '1.1', title: 'Harvard CS50 Course Introduction', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/LfaMVlDaQ24' },
          { id: 'csf2', code: '1.2', title: 'Binary, Data & Code compilation', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/LfaMVlDaQ24' }
        ]
      }
    ]
  },
  {
    id: 17,
    title: 'Responsive Web Design (HTML/CSS)',
    category: 'Design',
    rating: 4.9,
    reviews: 840,
    duration: '6 weeks',
    difficulty: 'Beginner',
    instructor: 'Alex Rivera',
    price: '$49.99',
    icon: '🎨',
    image: webDesignImg,
    description: 'Learn HTML5 and CSS3 layouts, wireframes, styling principles, typography selection, CSS Flexbox and responsive grids to build gorgeous pages.',
    structure: [
      {
        title: 'HTML & CSS Fundamentals',
        totalTime: '50 minutes',
        lectures: [
          { id: 'webd1', code: '1.1', title: 'Responsive Design Principles', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc' },
          { id: 'webd2', code: '1.2', title: 'Flexbox, Grid & Media Queries', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc' }
        ]
      }
    ]
  },
  {
    id: 18,
    title: 'Data Science foundations',
    category: 'Data Science',
    rating: 4.7,
    reviews: 930,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    instructor: 'Prof. Michael Chen',
    price: '$69.99',
    icon: '📊',
    image: dataScienceImg,
    description: 'Master statistics, probability models, Python pandas dataframe pipelines, matrix analysis, and data plotting to explore complex datasets.',
    structure: [
      {
        title: 'Data Science Basics',
        totalTime: '55 minutes',
        lectures: [
          { id: 'dat1', code: '1.1', title: 'Intro to Statistics & Probability', duration: '25 minutes', videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30' },
          { id: 'dat2', code: '1.2', title: 'Pandas Dataframes & Matplotlib', duration: '30 minutes', videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30' }
        ]
      }
    ]
  }
];
