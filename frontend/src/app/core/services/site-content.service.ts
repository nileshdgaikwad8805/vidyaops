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
    { label: 'IT Training & Certifications', path: '/services/certifications', pageKey: 'services' },
    { label: 'Software Development', path: '/services/software-development', pageKey: 'services' },
    { label: 'Digital Learning', path: '/services/digital-learning', pageKey: 'services' },
    { label: 'Corporate Training', path: '/services/corporate-training', pageKey: 'services' },
    { label: 'R&D Internship', path: '/services/rd-internship', pageKey: 'services' },
    { label: 'Collaborations', path: '/services/collaborations', pageKey: 'services' },
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
      link: '/services/certifications',
      linkText: 'Learn more',
      badge: '01',
    },
    {
      title: 'Software Development',
      text: 'Custom web, mobile, and enterprise software delivery with architecture, prototyping, deployment, and maintenance support.',
      link: '/services/software-development',
      linkText: 'Learn more',
      badge: '02',
    },
    {
      title: 'Digital Learning',
      text: 'Custom eLearning content, LMS solutions, gamified modules, and multimedia experiences for scalable learning programs.',
      link: '/services/digital-learning',
      linkText: 'Learn more',
      badge: '03',
    },
    {
      title: 'Corporate Training',
      text: 'Structured upskilling programs for teams, colleges, and organized learner groups with measurable outcomes.',
      link: '/services/corporate-training',
      linkText: 'Learn more',
      badge: '04',
    },
    {
      title: 'R&D Internship',
      text: 'Mentored internship experiences that expose students and freshers to practical Cloud, AI, and Data workflows.',
      link: '/services/rd-internship',
      linkText: 'Learn more',
      badge: '05',
    },
    {
      title: 'Collaborations',
      text: 'Partnerships with institutions, startups, and enterprises that create real-world learning and innovation outcomes.',
      link: '/services/collaborations',
      linkText: 'Learn more',
      badge: '06',
    },
  ];

  readonly caseStudies: FeatureCard[] = [
    {
      badge: 'Cloud Training',
      title: 'Cloud Training for College Batches',
      text: 'Delivered structured AWS and Azure fundamentals across three engineering college batches with strong lab completion rates.',
      link: '/services/certifications',
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
            heading: 'Service lines built around practical outcomes.',
            layout: 'cards',
            cards: this.serviceCards,
          },
          {
            eyebrow: 'Why teams choose us',
            heading: 'One partner for learning, delivery, and capability building.',
            layout: 'cards',
            cards: [
              { title: 'Hands-on by default', text: 'Every engagement focuses on usable outcomes instead of passive content.' },
              { title: 'Built for different audiences', text: 'Students, freshers, institutions, and corporate teams each get tailored delivery.' },
              { title: 'Flexible execution', text: 'Programs can be delivered online, on site, or in blended formats.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'certifications',
      {
        key: 'certifications',
        seoTitle: 'VidyaOps | IT Training & Certifications',
        seoDescription: 'Practical certification-oriented training for Cloud, Data, AI, and Cybersecurity learners.',
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
            heading: 'What the training includes.',
            layout: 'cards',
            cards: [
              { title: 'Foundation tracks', text: 'Clear entry points for learners exploring Cloud, Data, AI, or Security.' },
              { title: 'Hands-on labs', text: 'Practical exercises that connect concepts to real implementation.' },
              { title: 'Certification support', text: 'Guidance for preparation strategy, practice, and doubt clearing.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'software-development',
      {
        key: 'software-development',
        seoTitle: 'VidyaOps | Software Development',
        seoDescription: 'Custom software development services for web, mobile, and enterprise use cases.',
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
            heading: 'How we support software delivery.',
            layout: 'cards',
            cards: [
              { title: 'Architecture and planning', text: 'Define scope, architecture, and roadmap with clarity before delivery begins.' },
              { title: 'Modern engineering', text: 'Build maintainable systems using practical tooling and deployment workflows.' },
              { title: 'Long-term support', text: 'Continue improving the product after launch with maintenance and enhancements.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'digital-learning',
      {
        key: 'digital-learning',
        seoTitle: 'VidyaOps | Digital Learning',
        seoDescription: 'Digital learning solutions including eLearning content, LMS experiences, and gamified training.',
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
            heading: 'Digital learning capabilities.',
            layout: 'cards',
            cards: [
              { title: 'Custom content design', text: 'Build content around real learners, roles, and training outcomes.' },
              { title: 'Platform-enabled learning', text: 'Support LMS and digital distribution models for scale.' },
              { title: 'Engaging delivery', text: 'Use multimedia, modular design, and practice-driven structures.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'corporate-training',
      {
        key: 'corporate-training',
        seoTitle: 'VidyaOps | Corporate Training',
        seoDescription: 'Corporate and institutional training programs tailored to teams, colleges, and learner groups.',
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
            heading: 'What corporate and institutional clients get.',
            layout: 'cards',
            cards: [
              { title: 'Need-based curriculum', text: 'Programs are mapped to the target audience, role needs, and maturity level.' },
              { title: 'Flexible scheduling', text: 'Delivery models fit the practical realities of colleges and working teams.' },
              { title: 'Visible outcomes', text: 'Learning goals and progress checkpoints stay clear throughout the engagement.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'rd-internship',
      {
        key: 'rd-internship',
        seoTitle: 'VidyaOps | R&D Internship',
        seoDescription: 'Hands-on R&D internship opportunities for students and freshers working on real problems.',
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
            heading: 'Internship structure.',
            layout: 'cards',
            cards: [
              { title: 'Real problem solving', text: 'Learners contribute to meaningful work instead of isolated theory tasks.' },
              { title: 'Guided review cycles', text: 'Mentor feedback helps learners improve both clarity and execution quality.' },
              { title: 'Confidence building', text: 'Interns leave with practical talking points for interviews and next opportunities.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'collaborations',
      {
        key: 'collaborations',
        seoTitle: 'VidyaOps | Collaborations',
        seoDescription: 'Collaboration models for institutions, startups, and ecosystem partners.',
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
            heading: 'How collaborations create impact.',
            layout: 'cards',
            cards: [
              { title: 'Stronger access', text: 'Partnerships expand reach and improve access to practical technology education.' },
              { title: 'Shared execution', text: 'Programs can combine partner context with VidyaOps training delivery expertise.' },
              { title: 'Real ecosystem value', text: 'Collaboration models create outcomes beyond a single workshop or event.' },
            ],
          },
        ],
        cta: this.footerCta,
      },
    ],
    [
      'programs',
      {
        key: 'programs',
        seoTitle: 'VidyaOps | Programs',
        seoDescription: 'Explore VidyaOps program formats for students, freshers, and working professionals.',
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
            heading: 'Program formats.',
            layout: 'cards',
            cards: [
              { title: 'Starter workshops', text: 'Low-risk entry points for learners exploring a topic for the first time.' },
              { title: 'Deep-dive programs', text: 'Structured learning experiences with more practice, guidance, and accountability.' },
              { title: 'Group and institutional formats', text: 'Programs tailored for colleges, teams, and coordinated learner cohorts.' },
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
