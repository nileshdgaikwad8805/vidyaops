import { Injectable } from '@angular/core';

import {
  ContentPageData,
  CtaContent,
  FeatureCard,
  NavLink,
  StatItem,
} from '../models/site.models';

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/', pageKey: 'home' },
    { label: 'About', path: '/about', pageKey: 'about' },
    { label: 'Services', path: '/services', pageKey: 'services' },
    { label: 'Programs', path: '/programs', pageKey: 'programs' },
    { label: 'Workshops', path: '/workshops', pageKey: 'workshops' },
    { label: 'Contact', path: '/contact', pageKey: 'contact' },
  ];

  readonly serviceLinks: NavLink[] = [
    { label: 'All Services', path: '/services', pageKey: 'services' },
    { label: 'IT Training & Certifications', path: '/certifications', pageKey: 'certifications' },
    { label: 'Software Development', path: '/software-development', pageKey: 'software-development' },
    { label: 'Digital Learning', path: '/digital-learning', pageKey: 'digital-learning' },
    { label: 'Corporate Training', path: '/corporate-training', pageKey: 'corporate-training' },
    { label: 'R&D Internship', path: '/rd-internship', pageKey: 'rd-internship' },
    { label: 'Collaborations', path: '/collaborations', pageKey: 'collaborations' },
  ];

  readonly homeStats: StatItem[] = [
    { value: '500+', count: 500, label: 'Students Trained' },
    { value: '50+', count: 50, label: 'Workshops Delivered' },
    { value: '4', count: 4, label: 'Core Domains' },
    { value: '95%', count: 95, label: 'Positive Feedback' },
  ];

  readonly serviceCards: FeatureCard[] = [
    {
      title: 'IT Training & Certifications',
      text: 'Instructor-led and self-paced training across Cloud, Data, AI, and Cybersecurity with practical labs and certification pathways.',
      link: '/certifications',
      linkText: 'Learn more',
      badge: '01',
    },
    {
      title: 'Software Development',
      text: 'Custom web, mobile, and enterprise software delivery with architecture, prototyping, deployment, and maintenance support.',
      link: '/software-development',
      linkText: 'Learn more',
      badge: '02',
    },
    {
      title: 'Digital Learning',
      text: 'Custom eLearning content, LMS solutions, gamified modules, and multimedia experiences for scalable learning programs.',
      link: '/digital-learning',
      linkText: 'Learn more',
      badge: '03',
    },
    {
      title: 'Corporate Training',
      text: 'Structured upskilling programs for teams, colleges, and organized learner groups with measurable outcomes.',
      link: '/corporate-training',
      linkText: 'Learn more',
      badge: '04',
    },
    {
      title: 'R&D Internship',
      text: 'Mentored internship experiences that expose students and freshers to practical Cloud, AI, and Data workflows.',
      link: '/rd-internship',
      linkText: 'Learn more',
      badge: '05',
    },
    {
      title: 'Collaborations',
      text: 'Partnerships with institutions, startups, and enterprises that create real-world learning and innovation outcomes.',
      link: '/collaborations',
      linkText: 'Learn more',
      badge: '06',
    },
  ];

  readonly caseStudies: FeatureCard[] = [
    {
      badge: 'Cloud Training',
      title: 'Cloud Training for College Batches',
      text: 'Delivered structured AWS and Azure fundamentals across three engineering college batches with strong lab completion rates.',
      link: '/certifications',
      linkText: 'Read case study',
    },
    {
      badge: 'Data Analysis',
      title: 'Data Analysis Upskilling',
      text: 'A six-week practical sprint where most participants produced portfolio-ready work and gained clearer career direction.',
      link: '/services',
      linkText: 'Read case study',
    },
    {
      badge: 'AI Workshop',
      title: 'AI Awareness Workshop',
      text: 'Introductory AI session attended by learners from multiple colleges with strong post-session confidence gains.',
      link: '/workshops',
      linkText: 'Read case study',
    },
  ];

  readonly whyVidyaOps: FeatureCard[] = [
    { title: '100% Hands-on', text: 'Live labs, coding exercises, and project work are part of every learning experience.' },
    { title: 'Expert Mentors', text: 'Programs are led by practitioners working in Cloud, AI, Data, and Security right now.' },
    { title: 'Flexible Schedule', text: 'Weekend, evening, self-paced, and customized corporate delivery models are available.' },
    { title: 'Certification Ready', text: 'Structured preparation for industry-recognized certifications with guided support.' },
    { title: 'Small Batch Sizes', text: 'Learners get personal attention, real doubt clearing, and mentor interaction.' },
    { title: 'Career Guidance', text: 'Resume feedback, interview prep, and direction setting help learners connect training to outcomes.' },
  ];

  readonly testimonials: FeatureCard[] = [
    {
      title: 'Priya M.',
      badge: 'Cloud Basics Workshop',
      text: 'The workshop gave me clarity on which cloud domain to pursue. The hands-on labs made concepts click quickly.',
    },
    {
      title: 'Rohan K.',
      badge: 'Data Analysis Sprint',
      text: 'The exercises and mentor support made all the difference. Within weeks I had portfolio work I could show in interviews.',
    },
    {
      title: 'Sneha P.',
      badge: 'AI Career Starter',
      text: 'VidyaOps helped me build a roadmap and real skills I could use as a fresher.',
    },
  ];

  readonly csrCards: FeatureCard[] = [
    { title: 'Education for All', text: 'Free and subsidized workshops for underserved communities and first-generation learners.' },
    { title: 'Women Empowerment', text: 'Dedicated skilling tracks and mentorship programs that help women build lasting tech careers.' },
    { title: 'Environmental Sustainability', text: 'Workshops and campus initiatives that connect technology with responsible building.' },
    { title: 'Veteran Welfare', text: 'Transition support and upskilling for veterans entering civilian technology careers.' },
    { title: 'Rural Digital Inclusion', text: 'Learning programs that reach semi-urban and rural learners with accessible formats.' },
    { title: 'Open-Source Contributions', text: 'Encouraging learners to collaborate on meaningful open-source work.' },
  ];

  readonly partners = [
    'Technology Partners',
    'Educational Institutions',
    'Startup Ecosystems',
    'CSR Programs',
    'Industry Alliances',
  ];

  readonly footerCta: CtaContent = {
    eyebrow: 'Ready to begin?',
    title: 'Take the next step in your tech career.',
    text: 'Whether you are a student, fresher, or enterprise team, VidyaOps helps you choose the right path and start with confidence.',
    primaryLabel: 'Explore Services',
    primaryPath: '/services',
    secondaryLabel: 'Talk to Us',
    secondaryPath: '/contact',
  };

  private readonly contentPages = new Map<string, ContentPageData>([
    [
      'about',
      {
        key: 'about',
        seoTitle: 'VidyaOps | About',
        seoDescription: 'Learn about VidyaOps, our mission, practical learning model, and learner-first approach.',
        hero: {
          eyebrow: 'About VidyaOps',
          title: 'We turn curiosity into practical capability for students and freshers.',
          description: 'VidyaOps exists to close the gap between academic knowledge and career readiness through hands-on workshops, mentorship, and guided learning in Cloud, Data Analysis, AI, and Cybersecurity.',
          chips: ['Practical-first', 'Hands-on', 'Learner guided', 'Career focused'],
          panelLabel: 'Our focus',
          panelTitle: 'Knowledge that turns into confidence.',
          panelItems: [
            'Cloud, Data Analysis, AI, and Cybersecurity',
            'Built for students, freshers, and early professionals',
            'Free and paid workshop pathways',
            'Mentorship-driven and community-backed learning',
          ],
        },
        sections: [
          {
            eyebrow: 'Our mission and story',
            heading: 'Help learners become future-ready with more confidence, clarity, and direction.',
            intro: 'We build practical training experiences for learners who need structure, relevant exposure, and a trusted starting point.',
            layout: 'cards',
            cards: [
              { title: 'Practical first', text: 'Every session uses labs, real tools, and project-based learning instead of theory-only teaching.' },
              { title: 'Learner focused', text: 'Programs meet learners where they are, whether they are early in college or just starting career exploration.' },
              { title: 'Accessible growth', text: 'Free workshops and guided learning paths reduce the barrier to building real capability.' },
            ],
          },
          {
            eyebrow: 'How we work',
            heading: 'A practical learning model, not just theory-heavy teaching.',
            intro: 'Every learner gets the right starting point, the right content, and the right support.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Discover', text: 'We understand the learner’s background, goals, and skill level before recommending a path.' },
              { badge: '02', title: 'Design', text: 'We shape a training plan around useful and career-relevant outcomes.' },
              { badge: '03', title: 'Deliver', text: 'We run guided sessions with hands-on labs and real-world application.' },
            ],
          },
          {
            eyebrow: 'Our impact',
            heading: 'The numbers behind our mission.',
            layout: 'stats',
            stats: this.homeStats,
          },
        ],
        cta: {
          title: 'Start your learning journey today.',
          text: 'Whether you are a student, fresher, or early professional, VidyaOps has a practical path for you.',
          primaryLabel: 'Talk to Us',
          primaryPath: '/contact',
          secondaryLabel: 'Explore Services',
          secondaryPath: '/services',
        },
      },
    ],
    [
      'services',
      {
        key: 'services',
        seoTitle: 'VidyaOps | Services',
        seoDescription: 'Explore VidyaOps services across certifications, software development, digital learning, corporate training, and internships.',
        hero: {
          eyebrow: 'Our Services',
          title: 'Comprehensive technology solutions across training, development, and digital learning.',
          description: 'From individual certification preparation to enterprise capability building, VidyaOps delivers practical learning and execution support.',
          chips: ['Training', 'Development', 'Digital Learning', 'Corporate Enablement'],
          panelLabel: 'What we cover',
          panelTitle: 'End-to-end capability building.',
          panelItems: [
            'Certification-led training',
            'Custom software delivery',
            'Digital learning solutions',
            'Corporate and institutional programs',
          ],
        },
        sections: [
          {
            eyebrow: 'Our service lines',
            heading: 'Practical technology solutions designed for real outcomes.',
            intro: 'Each service line is built around delivering measurable value, not just activity. Choose the service that matches your current need.',
            layout: 'cards',
            cards: this.serviceCards,
          },
          {
            eyebrow: 'Why teams choose us',
            heading: 'One partner for learning, delivery, and capability building.',
            intro: 'VidyaOps combines training expertise with execution capability so you get a single partner for multiple technology needs.',
            layout: 'cards',
            cards: [
              { title: 'Hands-on by default', text: 'Every engagement focuses on usable outcomes instead of passive content. Labs, projects, and real tools are central to every service.' },
              { title: 'Built for different audiences', text: 'Students, freshers, institutions, and corporate teams each get tailored delivery. We do not use a one-size-fits-all approach.' },
              { title: 'Flexible execution', text: 'Programs can be delivered online, on-site, or in blended formats. Software projects follow agile workflows with regular demos.' },
              { title: 'End-to-end support', text: 'From initial consultation to post-delivery support, we stay engaged to ensure the outcomes meet your expectations.' },
            ],
          },
          {
            eyebrow: 'Impact across services',
            heading: 'The results that matter to the people we work with.',
            layout: 'stats',
            stats: this.homeStats,
          },
          {
            eyebrow: 'How to get started',
            heading: 'A simple process to find the right service for your needs.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Tell us what you need', text: 'Share your goals, audience, timeline, and constraints. We will listen carefully and ask the right questions.' },
              { badge: '02', title: 'We recommend an approach', text: 'Based on your needs, we suggest the right service, format, and program structure with clear scope and pricing.' },
              { badge: '03', title: 'We deliver with quality', text: 'Once aligned, we execute with structured milestones, regular updates, and a focus on outcomes you can measure.' },
            ],
          },
        ],
        cta: {
          title: 'Not sure which service you need?',
          text: 'Talk to VidyaOps. We will help you figure out the best starting point based on your goals, audience, and budget.',
          primaryLabel: 'Talk to Us',
          primaryPath: '/contact',
          secondaryLabel: 'Explore Programs',
          secondaryPath: '/programs',
        },
      },
    ],
    [
      'certifications',
      {
        key: 'certifications',
        seoTitle: 'VidyaOps | IT Training & Certifications',
        seoDescription: 'Practical certification-oriented training for Cloud, Data, AI, and Cybersecurity learners with hands-on labs, mentor support, and career guidance.',
        hero: {
          eyebrow: 'IT Training & Certifications',
          title: 'Certification-ready learning with practical labs and mentor guidance.',
          description: 'Structured programs across Cloud, Data, AI, and Cybersecurity help learners build confidence while preparing for recognized credentials.',
          chips: ['AWS', 'Azure', 'Google Cloud', 'Cybersecurity'],
          panelLabel: 'Program fit',
          panelTitle: 'Best for learners who want both clarity and credentials.',
          panelItems: [
            'Beginner-friendly entry points',
            'Hands-on labs and guided practice',
            'Exam-focused support',
            'Career-ready project exposure',
          ],
        },
        sections: [
          {
            eyebrow: 'What the training covers',
            heading: 'A structured path from foundational knowledge to certification readiness.',
            intro: 'Every certification track is designed to build skills progressively, starting from fundamentals and moving toward exam-level competence with real lab work.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Foundation tracks', text: 'Clear entry points for learners exploring Cloud, Data, AI, or Cybersecurity for the first time. Concepts are introduced with practical context so learners understand both the what and the why.' },
              { badge: '02', title: 'Hands-on labs', text: 'Practical exercises that connect concepts to real implementation. Learners work with actual cloud consoles, CLI tools, and security dashboards instead of just reading about them.' },
              { badge: '03', title: 'Certification support', text: 'Guidance for preparation strategy, timed practice sessions, and structured doubt-clearing so learners approach the exam with confidence and not anxiety.' },
            ],
          },
          {
            eyebrow: 'Domains we cover',
            heading: 'Training programs built around the most in-demand technology domains.',
            intro: 'Each domain has its own curriculum design, lab environment, and certification pathway to ensure learners get focused and relevant preparation.',
            layout: 'cards',
            cards: [
              { title: 'Cloud Platforms', text: 'AWS, Azure, and Google Cloud certification tracks covering architecture, deployment, security, and cost management with real cloud environments for practice.' },
              { title: 'Data Analysis', text: 'Excel, SQL, Power BI, and Python-based data workflows. Learners build dashboards, run queries, and present insights using tools employers actually use.' },
              { title: 'Artificial Intelligence', text: 'Foundations of machine learning, prompt engineering, and AI tooling with practical projects that demonstrate real-world application beyond surface-level tutorials.' },
              { title: 'Cybersecurity', text: 'Security fundamentals, threat analysis, network security, and compliance readiness with hands-on labs that simulate real attack-and-defense scenarios.' },
            ],
          },
          {
            eyebrow: 'How certification prep works',
            heading: 'A step-by-step process that turns preparation into a clear, manageable journey.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Skill assessment', text: 'We evaluate the learner current knowledge, academic background, and career goals to recommend the right certification track and starting point.' },
              { badge: '02', title: 'Structured learning', text: 'Content is delivered in focused modules with instructor-led explanations, reading material, and guided exercises that build week by week.' },
              { badge: '03', title: 'Lab practice', text: 'Learners get dedicated time in sandbox environments to practice configurations, run commands, and troubleshoot real scenarios.' },
              { badge: '04', title: 'Exam readiness', text: 'Mock tests, revision cycles, and doubt-clearing sessions ensure learners are fully prepared before attempting the actual certification exam.' },
            ],
          },
          {
            eyebrow: 'Who this is for',
            heading: 'Built for learners at different stages of their technology journey.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'College students',
                items: [
                  'Learners in B.Tech, BCA, MCA, or related programs who want practical skills alongside their degree.',
                  'Students exploring Cloud, AI, or Security as a career focus area.',
                  'Learners preparing for campus placements and need industry-relevant credentials.',
                ],
              },
              {
                title: 'Freshers and early professionals',
                items: [
                  'Recent graduates looking to strengthen their resume with recognized certifications.',
                  'Early professionals switching into Cloud, Data, or Security roles.',
                  'Self-taught learners who want structured guidance and a verified credential.',
                ],
              },
              {
                title: 'Working professionals',
                items: [
                  'Professionals needing cloud or security certifications for role transitions.',
                  'Team leads exploring certification programs for their teams.',
                  'Engineers wanting formal credentials to complement their experience.',
                ],
              },
            ],
          },
          {
            eyebrow: 'Why VidyaOps for certification training',
            heading: 'More than just exam preparation.',
            intro: 'We focus on building genuine competence, not just passing an exam. Learners leave with skills they can apply immediately.',
            layout: 'cards',
            cards: [
              { title: 'Practical-first approach', text: 'Every concept is taught through real implementation, not just slides. Learners configure, deploy, and troubleshoot in live environments.' },
              { title: 'Small batch sizes', text: 'Limited seats per batch ensure every learner gets individual attention, feedback, and support from instructors.' },
              { title: 'Career guidance', text: 'Beyond certification, learners get guidance on how to present their skills, build portfolios, and prepare for interviews.' },
              { title: 'Affordable pathways', text: 'Free introductory workshops help learners test the waters before committing to a full certification track.' },
            ],
          },
        ],
        cta: {
          title: 'Ready to earn your certification with confidence?',
          text: 'Talk to VidyaOps about the right certification track for your goals, or start with a free introductory workshop.',
          primaryLabel: 'Enroll Now',
          primaryPath: '/enroll',
          secondaryLabel: 'Talk to Us',
          secondaryPath: '/contact',
        },
      },
    ],
    [
      'software-development',
      {
        key: 'software-development',
        seoTitle: 'VidyaOps | Software Development',
        seoDescription: 'Custom software development services for web, mobile, and enterprise use cases with architecture, prototyping, deployment, and ongoing support.',
        hero: {
          eyebrow: 'Software Development',
          title: 'Modern software delivery built around real business needs.',
          description: 'VidyaOps designs and develops practical web, mobile, and enterprise solutions with a focus on delivery quality and long-term maintainability.',
          chips: ['Web apps', 'Mobile apps', 'Enterprise systems', 'Maintenance'],
          panelLabel: 'Typical outcomes',
          panelTitle: 'From architecture to deployment.',
          panelItems: [
            'Requirement discovery',
            'Prototype and MVP delivery',
            'Production deployment',
            'Support and iteration',
          ],
        },
        sections: [
          {
            eyebrow: 'How we support software delivery',
            heading: 'End-to-end development from idea to production and beyond.',
            intro: 'Every project starts with understanding the problem, not just the feature list. We help businesses define what to build, how to build it, and how to keep it running.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Architecture and planning', text: 'Define scope, technical architecture, and roadmap with clarity before a single line of code is written. We help you avoid costly pivots later by getting the foundation right.' },
              { badge: '02', title: 'Modern engineering', text: 'Build maintainable systems using proven frameworks, clean code practices, CI/CD pipelines, and deployment workflows that your team can extend and support.' },
              { badge: '03', title: 'Long-term support', text: 'Continue improving the product after launch with bug fixes, performance tuning, feature enhancements, and infrastructure monitoring.' },
            ],
          },
          {
            eyebrow: 'What we build',
            heading: 'Software solutions across web, mobile, and enterprise use cases.',
            intro: 'Whether you need a customer-facing product or an internal tool, we match the right technology to your actual requirements.',
            layout: 'cards',
            cards: [
              { title: 'Web applications', text: 'Responsive, performant web apps built with modern frameworks. From dashboards and portals to SaaS products and internal tools with real-time data.' },
              { title: 'Mobile applications', text: 'Cross-platform and native mobile solutions for iOS and Android. Focused on performance, offline support, and a clean user experience.' },
              { title: 'Enterprise systems', text: 'Integrations, workflows, and data platforms that connect teams, automate processes, and scale with your organization.' },
              { title: 'API and backend services', text: 'RESTful APIs, microservices, and backend infrastructure designed for reliability, security, and future growth.' },
            ],
          },
          {
            eyebrow: 'Our development process',
            heading: 'A structured approach that reduces risk and improves delivery quality.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Discovery', text: 'We sit with stakeholders, understand user needs, map workflows, and document requirements so nothing is assumed or overlooked.' },
              { badge: '02', title: 'Design and prototype', text: 'Wireframes, system design, and interactive prototypes validate the approach before full-scale development begins.' },
              { badge: '03', title: 'Build and test', text: 'Iterative development with regular demos, automated testing, and code reviews ensure quality stays high throughout.' },
              { badge: '04', title: 'Deploy and iterate', text: 'Production deployment with monitoring, user feedback loops, and planned iteration cycles to keep the product improving.' },
            ],
          },
          {
            eyebrow: 'Technologies we work with',
            heading: 'Practical technology choices based on what works, not what is trendy.',
            intro: 'We recommend and implement technologies that fit your project scale, team capability, and long-term maintenance reality.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'Frontend',
                items: [
                  'Angular, React, and Vue for single-page applications.',
                  'Responsive design with modern CSS frameworks.',
                  'Progressive Web App capabilities for offline and mobile experience.',
                ],
              },
              {
                title: 'Backend and infrastructure',
                items: [
                  'Node.js, Python, and Java for API and service layers.',
                  'PostgreSQL, MongoDB, and Redis for data storage.',
                  'AWS, Azure, and GCP for cloud hosting and deployment.',
                ],
              },
              {
                title: 'DevOps and tooling',
                items: [
                  'CI/CD pipelines with GitHub Actions, Jenkins, or GitLab CI.',
                  'Docker and containerized deployment for consistency.',
                  'Monitoring and alerting with industry-standard observability tools.',
                ],
              },
            ],
          },
          {
            eyebrow: 'Who we build for',
            heading: 'Software development support for startups, institutions, and growing businesses.',
            layout: 'cards',
            cards: [
              { title: 'Startups and founders', text: 'MVP development, rapid prototyping, and technical co-pilot support for teams that need to validate ideas quickly and ship with limited resources.' },
              { title: 'Educational institutions', text: 'Custom portals, learning management systems, and administrative tools designed for the specific workflows of colleges and training organizations.' },
              { title: 'Small and mid-size businesses', text: 'Internal tools, customer portals, and automation solutions that solve real operational problems without over-engineering.' },
            ],
          },
        ],
        cta: {
          title: 'Have a software project in mind?',
          text: 'Tell us what you need built. VidyaOps will help you define the scope, choose the right approach, and deliver with quality.',
          primaryLabel: 'Start a Conversation',
          primaryPath: '/contact',
          secondaryLabel: 'View Services',
          secondaryPath: '/services',
        },
      },
    ],
    [
      'digital-learning',
      {
        key: 'digital-learning',
        seoTitle: 'VidyaOps | Digital Learning',
        seoDescription: 'Digital learning solutions including eLearning content, LMS experiences, gamified training modules, and multimedia learning design.',
        hero: {
          eyebrow: 'Digital Learning',
          title: 'Scalable digital learning experiences that make training easier to deliver and easier to complete.',
          description: 'We design learning journeys, eLearning content, LMS workflows, and multimedia assets that improve engagement and trackability.',
          chips: ['eLearning', 'LMS', 'Gamification', 'Multimedia'],
          panelLabel: 'Ideal for',
          panelTitle: 'Teams building structured learning at scale.',
          panelItems: [
            'Custom curriculum design',
            'Trackable learning paths',
            'Interactive content formats',
            'Learner engagement support',
          ],
        },
        sections: [
          {
            eyebrow: 'Digital learning capabilities',
            heading: 'From content design to platform delivery, everything you need to train at scale.',
            intro: 'Digital learning is not just putting slides online. We design experiences that hold attention, reinforce learning, and give administrators real visibility.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Custom content design', text: 'Build learning content around real learners, roles, and training outcomes. Every module is designed for a specific audience with a specific goal, not generic content repurposed from the web.' },
              { badge: '02', title: 'Platform-enabled learning', text: 'Deploy on LMS platforms, custom portals, or cloud-hosted solutions that give administrators progress tracking, completion reports, and learner analytics.' },
              { badge: '03', title: 'Engaging delivery formats', text: 'Use video explainers, interactive quizzes, scenario-based exercises, and modular design to keep learners active instead of passive consumers of content.' },
            ],
          },
          {
            eyebrow: 'What we build',
            heading: 'Digital learning products designed for real training outcomes.',
            intro: 'Each format is chosen based on the learning goal, audience behavior, and administrative needs of the organization.',
            layout: 'cards',
            cards: [
              { title: 'eLearning modules', text: 'Self-paced courses with structured progression, assessments, and completion tracking. Designed for individual learners who need flexibility without losing structure.' },
              { title: 'LMS integration', text: 'Setup, customization, and content population on platforms like Moodle, Canvas, or custom-built learning portals with reporting and certification features.' },
              { title: 'Gamified experiences', text: 'Points, badges, leaderboards, and challenge-based modules that increase completion rates and make learning feel rewarding instead of tedious.' },
              { title: 'Multimedia content', text: 'Video production, animated explainers, infographics, and interactive simulations that bring complex topics to life for visual and hands-on learners.' },
            ],
          },
          {
            eyebrow: 'How we approach digital learning',
            heading: 'A design-first process that ensures content actually works.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Audience analysis', text: 'We study who the learners are, how they learn, what they already know, and what success looks like before designing any content.' },
              { badge: '02', title: 'Content architecture', text: 'We structure the learning journey into modules, milestones, and assessments that build competence progressively.' },
              { badge: '03', title: 'Production', text: 'Content is created using professional tools with attention to visual quality, pacing, interactivity, and accessibility.' },
              { badge: '04', title: 'Deploy and measure', text: 'Launch on the chosen platform with analytics in place to track engagement, completion, and learner performance over time.' },
            ],
          },
          {
            eyebrow: 'Who benefits from digital learning',
            heading: 'Built for organizations that need scalable, trackable training.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'Educational institutions',
                items: [
                  'Colleges and universities building online or blended learning programs.',
                  'Training centers creating self-paced course libraries for students.',
                  'Faculty teams looking to supplement classroom teaching with digital modules.',
                ],
              },
              {
                title: 'Corporate teams',
                items: [
                  'Organizations onboarding new hires with structured digital learning paths.',
                  'Teams upskilling in Cloud, AI, Data, or Security through online programs.',
                  'Compliance and certification training that needs tracking and reporting.',
                ],
              },
              {
                title: 'Training providers',
                items: [
                  'EdTech companies and training firms building content libraries.',
                  'Consultants and coaches scaling their expertise through digital formats.',
                  'Nonprofits and NGOs delivering training to distributed audiences.',
                ],
              },
            ],
          },
          {
            eyebrow: 'Why VidyaOps for digital learning',
            heading: 'We design for the learner, not just the admin dashboard.',
            layout: 'cards',
            cards: [
              { title: 'Learner-first design', text: 'Content is designed around how people actually learn, not what looks good in a feature list. Engagement and retention are the primary goals.' },
              { title: 'Flexible platforms', text: 'We work with your existing LMS or build custom solutions based on your audience size, budget, and administrative needs.' },
              { title: 'Measurable outcomes', text: 'Every deployment includes analytics and reporting so you can see what is working, what is not, and where to improve.' },
              { title: 'Affordable production', text: 'Scaled content production options that match your budget, from rapid video-based modules to fully interactive multimedia experiences.' },
            ],
          },
        ],
        cta: {
          title: 'Want to build better digital learning experiences?',
          text: 'Talk to VidyaOps about your training goals. We will recommend the right content format, platform, and delivery model.',
          primaryLabel: 'Get in Touch',
          primaryPath: '/contact',
          secondaryLabel: 'See Our Programs',
          secondaryPath: '/programs',
        },
      },
    ],
    [
      'corporate-training',
      {
        key: 'corporate-training',
        seoTitle: 'VidyaOps | Corporate Training',
        seoDescription: 'Corporate and institutional training programs tailored to teams, colleges, and learner groups with custom curriculum, flexible delivery, and measurable outcomes.',
        hero: {
          eyebrow: 'Corporate Training',
          title: 'Structured upskilling programs for teams, colleges, and organized learner groups.',
          description: 'VidyaOps designs custom training programs with role-specific curricula, delivery flexibility, and progress visibility.',
          chips: ['Teams', 'Institutions', 'Colleges', 'Custom delivery'],
          panelLabel: 'Program design',
          panelTitle: 'Built around measurable competency growth.',
          panelItems: [
            'Customized curriculum',
            'On-site or remote delivery',
            'Progress tracking',
            'Outcome-focused learning plans',
          ],
        },
        sections: [
          {
            eyebrow: 'What corporate clients get',
            heading: 'Training programs designed around your team actual needs and constraints.',
            intro: 'Off-the-shelf training rarely solves real problems. We build programs that match your audience, their skill levels, and the outcomes your organization needs.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Need-based curriculum', text: 'Programs are mapped to the target audience, role requirements, and skill maturity level. We do not waste time covering what learners already know.' },
              { badge: '02', title: 'Flexible scheduling', text: 'Delivery models fit the practical realities of colleges and working teams. Weekend batches, evening sessions, multi-week sprints, or intensive bootcamps.' },
              { badge: '03', title: 'Visible outcomes', text: 'Learning goals, progress checkpoints, and completion metrics stay transparent throughout the engagement so stakeholders see real value.' },
            ],
          },
          {
            eyebrow: 'Training domains',
            heading: 'Technology upskilling across the most in-demand domains.',
            intro: 'Each domain program is designed with practical labs, real tool exposure, and assessment checkpoints to ensure learners actually gain capability.',
            layout: 'cards',
            cards: [
              { title: 'Cloud Computing', text: 'AWS, Azure, and GCP training for teams migrating to cloud, managing infrastructure, or preparing for cloud certifications with hands-on lab environments.' },
              { title: 'Data and Analytics', text: 'SQL, Excel, Power BI, and Python-based data training for teams that need to work with data, build dashboards, and make data-driven decisions.' },
              { title: 'AI and Machine Learning', text: 'Foundational AI literacy, prompt engineering, and applied ML workshops for teams that need to understand and use AI tools in their daily work.' },
              { title: 'Cybersecurity', text: 'Security awareness, threat identification, and compliance training for IT teams, developers, and organizational staff who handle sensitive data.' },
            ],
          },
          {
            eyebrow: 'How we design programs',
            heading: 'A structured process that ensures training delivers real value.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Needs assessment', text: 'We analyze your team current skills, gaps, and organizational goals to build a training plan that targets what matters most.' },
              { badge: '02', title: 'Curriculum design', text: 'Content is structured around practical outcomes with modules, labs, and assessments aligned to real job requirements.' },
              { badge: '03', title: 'Delivery and facilitation', text: 'Experienced instructors deliver sessions with hands-on exercises, real-world examples, and interactive workshops.' },
              { badge: '04', title: 'Evaluation and reporting', text: 'Post-training assessments, completion reports, and feedback loops ensure measurable impact and continuous improvement.' },
            ],
          },
          {
            eyebrow: 'Engagement models',
            heading: 'Flexible ways to work with VidyaOps based on your organization needs.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'College and institutional programs',
                items: [
                  'Semester-long or multi-week training integrated into academic schedules.',
                  'Lab-based workshops for final-year students and pre-placement training.',
                  'Faculty development programs to build internal training capacity.',
                ],
              },
              {
                title: 'Corporate team training',
                items: [
                  'Batch-based upskilling programs for IT and non-IT teams.',
                  'Leadership and manager-focused technology literacy workshops.',
                  'Certification preparation tracks for teams needing formal credentials.',
                ],
              },
              {
                title: 'Custom and hybrid models',
                items: [
                  'Blended learning combining online modules with in-person workshops.',
                  'Long-term training partnerships with quarterly refresh cycles.',
                  'Event-based training for hackathons, innovation sprints, and tech days.',
                ],
              },
            ],
          },
          {
            eyebrow: 'Why organizations choose VidyaOps',
            heading: 'Training that respects your team time and delivers real results.',
            layout: 'cards',
            cards: [
              { title: 'Customization over generic content', text: 'Every program is built from scratch around your audience, their skill level, and your organizational goals.' },
              { title: 'Practical, not theoretical', text: 'Sessions use real tools, real data, and real scenarios so learners can apply what they learn immediately.' },
              { title: 'Scalable delivery', text: 'From small team workshops to large-batch institutional programs, we scale our delivery without losing quality.' },
              { title: 'Post-training support', text: 'Learners get access to resources, doubt-clearing channels, and community support after the formal program ends.' },
            ],
          },
          {
            eyebrow: 'Frequently asked questions',
            heading: 'Common questions from corporate and institutional clients.',
            layout: 'faq',
            faqs: [
              { question: 'How long does a typical corporate training program run?', answer: 'Programs range from 1-day workshops to 12-week structured tracks. Duration depends on the domain depth, audience size, and learning outcomes you want to achieve.' },
              { question: 'Can you train non-technical teams on technology topics?', answer: 'Yes. We design programs for mixed audiences including management, operations, and non-IT staff who need technology literacy without deep technical immersion.' },
              { question: 'Do you provide completion certificates?', answer: 'Yes. Participants receive completion certificates with details of the program, duration, and topics covered. We can also include assessment scores if required.' },
              { question: 'Can the training be conducted at our campus or office?', answer: 'Yes. We offer on-site delivery for local organizations and fully remote sessions for distributed teams. Hybrid models combining both are also available.' },
            ],
          },
        ],
        cta: {
          title: 'Need a training program built for your team?',
          text: 'Tell us about your team, their skill levels, and your goals. VidyaOps will design a program that fits your timeline and budget.',
          primaryLabel: 'Request a Program',
          primaryPath: '/contact',
          secondaryLabel: 'Explore Programs',
          secondaryPath: '/programs',
        },
      },
    ],
    [
      'rd-internship',
      {
        key: 'rd-internship',
        seoTitle: 'VidyaOps | R&D Internship',
        seoDescription: 'Hands-on R&D internship opportunities for students and freshers working on real problems in Cloud, AI, and Data with mentor support.',
        hero: {
          eyebrow: 'R&D Internship',
          title: 'Hands-on internship experiences for learners who need real project exposure.',
          description: 'Students and freshers work on practical Cloud, AI, and Data challenges with mentor support and structured feedback.',
          chips: ['Projects', 'Mentorship', 'Real tools', 'Career readiness'],
          panelLabel: 'What learners gain',
          panelTitle: 'Exposure that feels like real work.',
          panelItems: [
            'Practical project experience',
            'Mentor-guided learning',
            'Tool familiarity',
            'Career confidence',
          ],
        },
        sections: [
          {
            eyebrow: 'Internship structure',
            heading: 'A structured program that balances learning with real contribution.',
            intro: 'Unlike generic internships, every participant works on a meaningful problem with clear milestones, regular feedback, and a tangible outcome they can present.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Real problem solving', text: 'Interns contribute to meaningful work instead of isolated theory tasks. Projects are sourced from real organizational needs or guided research challenges.' },
              { badge: '02', title: 'Guided review cycles', text: 'Regular mentor feedback helps learners improve both clarity and execution quality. Code reviews, design critiques, and progress check-ins are built into the process.' },
              { badge: '03', title: 'Portfolio-ready outcomes', text: 'Interns leave with documented project work, GitHub contributions, and presentation-ready talking points for interviews and career conversations.' },
            ],
          },
          {
            eyebrow: 'Focus areas',
            heading: 'Internship tracks across the most relevant technology domains.',
            intro: 'Each track provides domain-specific mentorship, tools, and project exposure that matches current industry demand.',
            layout: 'cards',
            cards: [
              { title: 'Cloud and DevOps', text: 'Work with AWS, Azure, or GCP infrastructure. Learn deployment, monitoring, CI/CD pipelines, and cloud architecture through real project work.' },
              { title: 'Data Analysis and Engineering', text: 'Build data pipelines, create dashboards, run analysis on real datasets, and learn tools like Python, SQL, Power BI, and Excel for practical data work.' },
              { title: 'AI and Machine Learning', text: 'Explore applied AI projects including model training, prompt engineering, data preprocessing, and building AI-powered applications with real datasets.' },
              { title: 'Cybersecurity', text: 'Learn threat analysis, network security fundamentals, vulnerability assessment, and security tooling through guided exercises and project-based work.' },
            ],
          },
          {
            eyebrow: 'How the internship works',
            heading: 'From application to completion, a clear and supportive journey.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Application and screening', text: 'Submit your application with your academic background and interests. We match you to a track based on your goals and current skill level.' },
              { badge: '02', title: 'Onboarding and orientation', text: 'Get familiar with tools, workflows, project expectations, and mentor communication channels before starting hands-on work.' },
              { badge: '03', title: 'Project execution', text: 'Work on assigned tasks and projects with regular mentor check-ins. Track progress through milestones and deliverables.' },
              { badge: '04', title: 'Review and certification', text: 'Present your work, receive feedback, and get an internship completion certificate with details of your contributions and skills demonstrated.' },
            ],
          },
          {
            eyebrow: 'Who should apply',
            heading: 'Built for learners who want more than a certificate.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'College students',
                items: [
                  'Students in B.Tech, BCA, MCA, or related programs looking for hands-on experience.',
                  'Learners in pre-final or final year who want real project work for their resume.',
                  'Students exploring career paths in Cloud, AI, Data, or Security.',
                ],
              },
              {
                title: 'Fresh graduates',
                items: [
                  'Recent graduates who need practical exposure before entering the job market.',
                  'Self-taught learners who want guided mentorship and structured project work.',
                  'Career changers transitioning into technology roles.',
                ],
              },
              {
                title: 'What you need',
                items: [
                  'Basic familiarity with programming or technology concepts in your chosen track.',
                  'Willingness to learn, ask questions, and work on challenging problems.',
                  'Commitment to the internship duration and meeting project milestones.',
                ],
              },
            ],
          },
          {
            eyebrow: 'What interns gain beyond skills',
            heading: 'The internship builds career readiness, not just technical knowledge.',
            layout: 'cards',
            cards: [
              { title: 'Mentor relationships', text: 'Direct access to experienced professionals who provide guidance, feedback, and career advice throughout the program.' },
              { title: 'Real-world exposure', text: 'Understand how technology projects work in practice, including collaboration, version control, documentation, and delivery expectations.' },
              { title: 'Interview readiness', text: 'Concrete project stories, demonstrated skills, and presentation experience that make interviews more confident and credible.' },
              { title: 'Community access', text: 'Join the VidyaOps alumni network for ongoing support, job referrals, and continued learning opportunities after the internship.' },
            ],
          },
        ],
        cta: {
          title: 'Ready to gain real internship experience?',
          text: 'Apply for the VidyaOps R&D Internship and work on real projects with mentor support across Cloud, AI, Data, or Security.',
          primaryLabel: 'Apply Now',
          primaryPath: '/volunteer',
          secondaryLabel: 'Talk to Us',
          secondaryPath: '/contact',
        },
      },
    ],
    [
      'collaborations',
      {
        key: 'collaborations',
        seoTitle: 'VidyaOps | Collaborations',
        seoDescription: 'Partnership and collaboration models for educational institutions, startups, enterprises, and ecosystem partners working together on practical learning outcomes.',
        hero: {
          eyebrow: 'Collaborations',
          title: 'Partnerships that bring practical learning and innovation closer to real communities.',
          description: 'VidyaOps collaborates with institutions, startups, and enterprises to deliver stronger learner outcomes and more applied programs.',
          chips: ['Institutions', 'Startups', 'Enterprises', 'CSR'],
          panelLabel: 'Collaboration areas',
          panelTitle: 'Built for shared outcomes.',
          panelItems: [
            'Joint workshops',
            'Institutional programs',
            'Innovation projects',
            'CSR and outreach partnerships',
          ],
        },
        sections: [
          {
            eyebrow: 'How collaborations create impact',
            heading: 'Partnerships that go beyond one-time events.',
            intro: 'Every collaboration is designed to create lasting value, not just a single workshop or branded event. We focus on outcomes that benefit both sides.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Stronger access', text: 'Partnerships expand reach and improve access to practical technology education for learners who might not find it otherwise.' },
              { badge: '02', title: 'Shared execution', text: 'Programs combine partner context and audience knowledge with VidyaOps training delivery expertise and curriculum design.' },
              { badge: '03', title: 'Real ecosystem value', text: 'Collaboration models create outcomes beyond a single session, including ongoing programs, talent pipelines, and community growth.' },
            ],
          },
          {
            eyebrow: 'Collaboration models',
            heading: 'Flexible partnership structures built around different organizational needs.',
            intro: 'Whether you are a college, a startup, a corporation, or a nonprofit, there is a collaboration model that fits your goals.',
            layout: 'cards',
            cards: [
              { title: 'Co-branded workshops', text: 'Jointly designed and delivered workshops that combine VidyaOps training content with partner branding, audience reach, and venue support.' },
              { title: 'Institutional training programs', text: 'Semester-length or multi-week training integrated into college curricula, placement preparation, or faculty development initiatives.' },
              { title: 'Innovation and R&D projects', text: 'Joint research, prototyping, and product development projects where students and teams work on real problems with shared mentorship.' },
              { title: 'CSR and outreach programs', text: 'Technology education initiatives funded through CSR budgets or community outreach programs targeting underserved learner groups.' },
            ],
          },
          {
            eyebrow: 'Who we partner with',
            heading: 'Collaborations designed for different types of organizations.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'Educational institutions',
                items: [
                  'Engineering colleges and universities looking to add practical training to their curriculum.',
                  'Training centers and coaching institutes wanting to offer technology certification programs.',
                  'Student clubs and technical communities organizing workshops and hackathons.',
                ],
              },
              {
                title: 'Startups and technology companies',
                items: [
                  'Startups seeking technical interns or project collaborators for early-stage products.',
                  'Technology companies wanting to sponsor training programs as part of their community initiatives.',
                  'Product companies looking for pilot users and feedback from trained learner communities.',
                ],
              },
              {
                title: 'Enterprises and CSR teams',
                items: [
                  'Corporations funding technology education through CSR programs.',
                  'Industry bodies and trade organizations running skill development initiatives.',
                  'Government and semi-government organizations supporting digital literacy and employment programs.',
                ],
              },
            ],
          },
          {
            eyebrow: 'What a collaboration looks like',
            heading: 'A clear process from first conversation to delivered program.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Conversation and alignment', text: 'We start with understanding your goals, audience, constraints, and what success looks like for your organization.' },
              { badge: '02', title: 'Program design', text: 'Together we design the program structure, content scope, delivery format, timeline, and shared responsibilities.' },
              { badge: '03', title: 'Execution', text: 'VidyaOps handles training delivery, content creation, and learner management while you manage audience reach and logistics.' },
              { badge: '04', title: 'Review and continuation', text: 'After delivery, we review outcomes together and explore opportunities for continued or expanded partnerships.' },
            ],
          },
          {
            eyebrow: 'Why partner with VidyaOps',
            heading: 'A partner focused on outcomes, not just activity metrics.',
            layout: 'cards',
            cards: [
              { title: 'Curriculum quality', text: 'Training content is practical, current, and designed for real skill outcomes rather than surface-level engagement.' },
              { title: 'Delivery reliability', text: 'Structured processes, professional instructors, and consistent quality regardless of program size or format.' },
              { title: 'Learner focus', text: 'We care about whether learners actually gain capability, not just whether seats were filled or events happened.' },
              { title: 'Long-term thinking', text: 'We prefer partnerships that grow over time, with each program building on the outcomes of the previous one.' },
            ],
          },
        ],
        cta: {
          title: 'Interested in partnering with VidyaOps?',
          text: 'Let us know about your organization and goals. We will explore how a collaboration can create real value for your learners and community.',
          primaryLabel: 'Start a Partnership',
          primaryPath: '/contact',
          secondaryLabel: 'View Our Services',
          secondaryPath: '/services',
        },
      },
    ],
    [
      'programs',
      {
        key: 'programs',
        seoTitle: 'VidyaOps | Programs',
        seoDescription: 'Explore VidyaOps program formats for students, freshers, and working professionals across workshops, guided tracks, and institutional programs.',
        hero: {
          eyebrow: 'Programs',
          title: 'Learning pathways built for different starting points and different goals.',
          description: 'VidyaOps offers workshop-led entry points, guided practical programs, and structured training paths for individuals and groups.',
          chips: ['Workshops', 'Tracks', 'Mentorship', 'Career support'],
          panelLabel: 'Choose your path',
          panelTitle: 'Flexible programs for practical growth.',
          panelItems: [
            'Free and paid workshops',
            'Guided training tracks',
            'Mentorship support',
            'Career-linked progression',
          ],
        },
        sections: [
          {
            eyebrow: 'Program formats',
            heading: 'Different formats for different goals, budgets, and commitment levels.',
            intro: 'Not every learner needs the same thing. VidyaOps offers a range of program formats from low-commitment workshops to structured multi-week tracks.',
            layout: 'cards',
            cards: [
              { badge: '01', title: 'Starter workshops', text: 'Low-risk entry points for learners exploring a topic for the first time. Free and paid options let you test the water before committing to a deeper program.' },
              { badge: '02', title: 'Deep-dive programs', text: 'Structured learning experiences with more practice, guidance, and accountability. These tracks include projects, mentor reviews, and outcome-focused milestones.' },
              { badge: '03', title: 'Group and institutional formats', text: 'Programs tailored for colleges, teams, and coordinated learner cohorts with shared schedules, progress tracking, and group-based learning outcomes.' },
            ],
          },
          {
            eyebrow: 'Domain tracks',
            heading: 'Training programs built around the most relevant technology domains.',
            intro: 'Each domain has its own curriculum, lab environment, and learning path designed for practical competence, not just theory.',
            layout: 'cards',
            cards: [
              { title: 'Cloud Computing', text: 'AWS, Azure, and GCP training from fundamentals to advanced architecture. Hands-on labs, deployment practice, and certification preparation paths.' },
              { title: 'Data Analysis', text: 'Excel, SQL, Power BI, and Python for data workflows. Build dashboards, run analyses, and present insights using tools employers actually use.' },
              { title: 'Artificial Intelligence', text: 'AI foundations, prompt engineering, and applied ML projects. Learn how to use and build with AI tools in practical, career-relevant contexts.' },
              { title: 'Cybersecurity', text: 'Security fundamentals, threat analysis, and compliance readiness with hands-on lab scenarios that simulate real-world challenges.' },
            ],
          },
          {
            eyebrow: 'How to choose',
            heading: 'Not sure where to start? Here is how to pick the right program.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'If you are just exploring',
                items: [
                  'Start with a free introductory workshop to understand the domain and teaching style.',
                  'No commitment required. Attend, learn, and decide if a deeper track makes sense for you.',
                ],
              },
              {
                title: 'If you want structured learning',
                items: [
                  'Choose a deep-dive track with guided content, projects, and mentor feedback.',
                  'Best for learners who want to build genuine skills and have something concrete for their resume.',
                ],
              },
              {
                title: 'If you are part of a team or college',
                items: [
                  'Explore group and institutional programs with shared schedules and progress tracking.',
                  'Contact VidyaOps for custom program design that fits your group needs and timeline.',
                ],
              },
            ],
          },
          {
            eyebrow: 'What learners say',
            heading: 'Feedback from participants who completed VidyaOps programs.',
            layout: 'cards',
            cards: [
              { title: 'Practical and relevant', text: 'The workshops and tracks focus on real tools and real workflows. What I learned is directly useful in my coursework and interviews.' },
              { title: 'Supportive mentors', text: 'Instructors are patient, knowledgeable, and genuinely invested in helping learners understand, not just complete the syllabus.' },
              { title: 'Career confidence', text: 'After completing a track, I had projects to show and skills I could talk about in interviews. That made a real difference.' },
            ],
          },
        ],
        cta: {
          title: 'Need help choosing the right program?',
          text: 'Talk to VidyaOps and we will recommend the best starting point for your goals and current level.',
          primaryLabel: 'Talk to Us',
          primaryPath: '/contact',
          secondaryLabel: 'Browse Workshops',
          secondaryPath: '/workshops',
        },
      },
    ],
    [
      'faq',
      {
        key: 'faq',
        seoTitle: 'VidyaOps | FAQ',
        seoDescription: 'Answers to common questions about VidyaOps training, workshops, and learner support.',
        hero: {
          eyebrow: 'FAQ',
          title: 'Common questions before you get started.',
          description: 'Find quick answers about VidyaOps training formats, workshop options, learner support, and who the programs are built for.',
          chips: ['Workshops', 'Support', 'Learner fit', 'Pricing guidance'],
        },
        sections: [
          {
            heading: 'Frequently asked questions.',
            layout: 'faq',
            faqs: [
              { question: 'Who are VidyaOps programs built for?', answer: 'Students, freshers, early professionals, institutions, and teams who want practical technology learning.' },
              { question: 'Do you offer both free and paid workshops?', answer: 'Yes. VidyaOps uses free workshops as an accessible first step and paid workshops or training tracks for deeper learning.' },
              { question: 'Can teams or colleges request customized programs?', answer: 'Yes. Corporate and institutional programs can be designed around specific goals, technologies, and learner groups.' },
              { question: 'How do I choose the right starting path?', answer: 'The fastest option is to contact VidyaOps with your background and goal so the team can recommend the right path.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'privacy',
      {
        key: 'privacy',
        seoTitle: 'VidyaOps | Privacy Policy',
        seoDescription: 'Understand how VidyaOps handles contact details, inquiry data, and learner information.',
        hero: {
          eyebrow: 'Privacy Policy',
          title: 'How VidyaOps handles inquiries and learner information.',
          description: 'This summary explains how inquiry details and learning-related information are handled in the current VidyaOps experience.',
        },
        sections: [
          {
            heading: 'Privacy summary.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'What we collect',
                items: ['Contact details shared through forms or chatbot conversations.', 'Inquiry context such as interests, organization, and message details.'],
              },
              {
                title: 'Why we collect it',
                items: ['To respond to inquiries, guide learners, and support workshop or program enrollment.', 'To improve the relevance of recommendations and follow-up communication.'],
              },
              {
                title: 'How it is used',
                items: ['Inquiry data is used for support, follow-up, and operational communication related to VidyaOps services.'],
              },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'terms',
      {
        key: 'terms',
        seoTitle: 'VidyaOps | Terms of Service',
        seoDescription: 'Summary terms for using VidyaOps websites, inquiries, and learning-related experiences.',
        hero: {
          eyebrow: 'Terms of Service',
          title: 'General usage terms for the VidyaOps experience.',
          description: 'These summary terms outline how the website, inquiry forms, and related training information are intended to be used.',
        },
        sections: [
          {
            heading: 'Terms summary.',
            layout: 'list',
            bulletGroups: [
              {
                title: 'Use of the site',
                items: ['The site is intended to share information about VidyaOps services, workshops, and contact channels.', 'Users should provide accurate information when submitting inquiries.'],
              },
              {
                title: 'Service information',
                items: ['Program details, schedules, and formats may evolve over time.', 'Specific commitments should be confirmed directly with the VidyaOps team.'],
              },
              {
                title: 'Responsible use',
                items: ['Users should not misuse forms, chatbot features, or any connected services.', 'Operational access may be limited or updated to protect the platform.'],
              },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
  ]);

  constructor() { }

  getPage(pageKey: string): ContentPageData | undefined {
    return this.contentPages.get(pageKey);
  }
}
