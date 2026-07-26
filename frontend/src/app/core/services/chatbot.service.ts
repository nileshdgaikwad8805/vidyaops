import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ChatMessage, LeadCaptureData } from '../models/site.models';
import { RuntimeConfigService } from './runtime-config.service';

const WEB3FORMS_ACCESS_KEY = '0be77e00-31bc-46c1-ae9f-f2533b47dd86';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  private readonly knowledgeBase: Record<string, string> = {
    contact: 'You can reach VidyaOps by phone at 9503685152, email at info@vidyaops.com, or WhatsApp us for a faster reply. Visit the Contact page for the inquiry form.',
    audience: 'VidyaOps is built for college students, freshers, early professionals, knowledge seekers, institutions, corporate teams, and anyone looking to build practical tech skills.',
    location: 'VidyaOps is based in Pune, Maharashtra, India. We serve learners globally with online and blended delivery models.',
    services: 'VidyaOps offers 6 core services: IT Training & Certifications, Software Development, Digital Learning, Corporate Training, R&D Internships, and Collaborations.',
    workshops: 'VidyaOps runs both free and paid workshops. Free workshops are great entry points to explore a topic. Paid workshops offer deeper practice. Check the Workshops page for upcoming batches or contact us for the next schedule.',
    programs: 'VidyaOps offers three program formats: Starter Workshops (low-risk entry points), Deep-Dive Programs (structured learning with guidance), and Group/Institutional formats (tailored for colleges and teams). Visit the Programs page for details.',
    certifications: 'VidyaOps provides certification-oriented training across Cloud (AWS, Azure, GCP), Data Analysis, AI, and Cybersecurity. Programs include foundation tracks, hands-on labs, and exam-focused support.',
    cloud: 'VidyaOps offers practical Cloud training covering AWS, Azure, and GCP fundamentals. Programs include guided labs, project work, and certification preparation. Suitable for students, freshers, and early professionals.',
    data: 'Our Data Analysis training covers practical data workflows, SQL, Python, BI tools, and career-relevant exercises. A great fit for learners who want to work with real datasets and build portfolio-ready work.',
    ai: 'VidyaOps provides AI training covering machine learning concepts, responsible AI use, practical tools, and GenAI exposure. Programs range from introductory workshops to structured career-focused tracks.',
    cyber: 'Our Cybersecurity training covers security fundamentals, practical exercises, and career pathways in infosec. Built for learners who want a practical starting point and clearer security career direction.',
    corporate: 'VidyaOps designs corporate training programs with customized curriculum, flexible scheduling (online, on-site, or blended), and progress tracking. Ideal for teams, colleges, and organized learner groups.',
    software: 'VidyaOps offers custom software development services including web apps, mobile apps, enterprise systems, architecture planning, MVP delivery, deployment, and long-term maintenance.',
    digital_learning: 'Our Digital Learning services include custom eLearning content design, LMS solutions, gamified modules, and multimedia learning experiences. Built for teams creating structured learning at scale.',
    internship: 'VidyaOps R&D Internships give students and freshers hands-on experience working on real Cloud, AI, and Data projects. Includes mentor support, guided review cycles, and career confidence building.',
    collaborations: 'VidyaOps collaborates with institutions, startups, enterprises, and CSR programs. Collaboration areas include joint workshops, institutional programs, innovation projects, and outreach partnerships.',
    pricing: 'Pricing depends on the program format. Free workshops are available as accessible entry points. Paid workshops and training tracks have specific pricing shared during enrollment. Contact us at 9503685152 or info@vidyaops.com for current pricing details.',
    faq: 'Common questions: Who is it for? Students, freshers, professionals, and teams. Free and paid workshops? Yes, both are available. Custom programs? Yes, for colleges and corporate teams. How to choose? Contact us and we will guide you.',
    career: 'VidyaOps helps with career guidance including resume feedback, interview preparation, and direction setting. Our training connects practical skills to career outcomes.',
    privacy: 'VidyaOps collects contact details and inquiry context shared through forms or chatbot conversations. This data is used to respond to inquiries, guide learners, and support program enrollment.',
    terms: 'VidyaOps website terms: the site shares information about services and workshops. Users should provide accurate inquiry info. Program details may evolve, so confirm specifics with our team.',
    csr: 'VidyaOps runs CSR initiatives in Education for All, Women Empowerment, Environmental Sustainability, Veteran Welfare, Rural Digital Inclusion, and Open-Source Contributions.',
    partners: 'VidyaOps partners with technology companies, educational institutions, startup ecosystems, CSR programs, and industry alliances to expand access to practical tech education.',
    about: 'VidyaOps exists to close the gap between academic knowledge and career readiness. We build practical training experiences with hands-on workshops, mentorship, and guided learning in Cloud, Data, AI, and Cybersecurity.',
    impact: 'VidyaOps has trained 500+ students, delivered 50+ workshops, covers 4 core domains, and maintains 95% positive feedback from learners.',
    mentor: 'All VidyaOps programs are led by practitioners currently working in Cloud, AI, Data, and Security. Mentors provide hands-on guidance, doubt clearing, and career support.',
    hands_on: 'Every VidyaOps session uses live labs, coding exercises, project work, and real tools instead of theory-only teaching. This is our core philosophy.',
    schedule: 'VidyaOps offers flexible scheduling including weekend batches, evening sessions, self-paced options, and customized corporate delivery models. Contact us for the latest schedule.',
    whatsapp: 'You can message VidyaOps on WhatsApp at +91 9503685152 for quick responses about workshops, training schedules, pricing, or any questions.',
    email: 'Email VidyaOps at info@vidyaops.com for inquiries, program details, partnership discussions, and general questions.',
    phone: 'Call VidyaOps at 9503685152 for direct assistance with training, workshops, and program inquiries.',
    recommendation: 'If you are just starting, a free workshop is a strong first step. If you want deeper practice, a structured training program is a better fit. Contact us and we will recommend the best path for your goals.',
    thanks: 'You are welcome! If you have more questions about VidyaOps training, workshops, or programs, feel free to ask anytime.',
    greeting: 'Welcome to VidyaOps! I can help you with information about our training programs, workshops, services, pricing, contact details, and more. What would you like to know?',
    bye: 'Thank you for visiting VidyaOps! Feel free to come back anytime. You can also reach us on WhatsApp or through the Contact page. Have a great day!',
  };

  async getReply(message: string, history: ChatMessage[]): Promise<string> {
    if (this.runtimeConfig.isStaticRuntime) {
      return this.getLocalReply(message);
    }

    try {
      const payload = await firstValueFrom(
        this.http.post<{ reply?: string }>(this.runtimeConfig.apiUrl('/api/chat'), {
          sessionId: this.getSessionId(),
          message,
          messages: history,
        }),
      );

      return payload.reply || this.getLocalReply(message);
    } catch {
      return this.getLocalReply(message);
    }
  }

  async getCounselorReply(learnerType: string, interest: string, goal: string): Promise<string> {
    const localFallback = this.getLocalCounselorReply(learnerType, interest, goal);

    if (this.runtimeConfig.isStaticRuntime) {
      return localFallback;
    }

    try {
      const counselorPrompt =
        `Learner type: ${learnerType}\n` +
        `Interest area: ${interest}\n` +
        `Goal: ${goal}\n` +
        'Please recommend the best VidyaOps starting path.';

      const payload = await firstValueFrom(
        this.http.post<{ reply?: string }>(this.runtimeConfig.apiUrl('/api/chat'), {
          sessionId: this.getSessionId(),
          mode: 'counselor',
          message: counselorPrompt,
          messages: [{ role: 'user', content: counselorPrompt }],
        }),
      );

      return payload.reply || localFallback;
    } catch {
      return localFallback;
    }
  }

  async saveLead(lead: LeadCaptureData): Promise<void> {
    if (this.runtimeConfig.isStaticRuntime) {
      this.persistLead(lead);
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(this.runtimeConfig.apiUrl('/api/leads'), {
          sessionId: this.getSessionId(),
          ...lead,
        }),
      );
    } catch {
      try {
        await firstValueFrom(
          this.http.post('https://api.web3forms.com/submit', {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New VidyaOps Chatbot Lead — ${lead.name}`,
            name: lead.name,
            contact: lead.contact,
            learnerType: lead.learnerType,
            interest: lead.interest,
            source: 'chatbot',
            from_name: 'VidyaOps Chatbot Lead',
          }),
        );
      } catch {
        // silently fail — lead is persisted locally
      }
    } finally {
      this.persistLead(lead);
    }
  }

  readPersistedLead(): LeadCaptureData | null {
    const raw = localStorage.getItem('vidyaops_lead_prefill');

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as LeadCaptureData;
    } catch {
      return null;
    }
  }

  private getLocalReply(message: string): string {
    const lower = message.toLowerCase().trim();

    // Greetings
    if (lower.match(/^(hi|hello|hey|good morning|good evening|good afternoon|hola|namaste|namaskar)/)) {
      return this.knowledgeBase['greeting'];
    }

    // Goodbye
    if (lower.match(/(bye|goodbye|see you|thank you|thanks|thank)/) && lower.length < 30) {
      if (lower.match(/(thank|thanks)/)) {
        return this.knowledgeBase['thanks'];
      }
      return this.knowledgeBase['bye'];
    }

    // About VidyaOps
    if (lower.includes('about') || lower.includes('who are you') || lower.includes('what is vidyaops') || lower.includes('tell me about') || lower.includes('what do you do')) {
      return this.knowledgeBase['about'] + ' ' + this.knowledgeBase['impact'];
    }

    // Mission / Story
    if (lower.includes('mission') || lower.includes('story') || lower.includes('why vidyaops') || lower.includes('purpose')) {
      return this.knowledgeBase['about'];
    }

    // Impact / Stats
    if (lower.includes('impact') || lower.includes('stat') || lower.includes('how many') || lower.includes('result') || lower.includes('feedback')) {
      return this.knowledgeBase['impact'];
    }

    // Services overview
    if (lower.includes('service') || lower.includes('what do you offer') || lower.includes('what can you') || lower.includes('solutions')) {
      return this.knowledgeBase['services'];
    }

    // Cloud
    if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure') || lower.includes('gcp') || lower.includes('google cloud')) {
      return this.knowledgeBase['cloud'] + ' ' + this.knowledgeBase['contact'];
    }

    // Data Analysis
    if (lower.includes('data') || lower.includes('analytics') || lower.includes('sql') || lower.includes('python') || lower.includes('bi ')) {
      return this.knowledgeBase['data'] + ' ' + this.knowledgeBase['contact'];
    }

    // AI / ML
    if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('machine learning') || lower.includes('ml') || lower.includes('genai') || lower.includes('nlp') || lower.includes('deep learning')) {
      return this.knowledgeBase['ai'] + ' ' + this.knowledgeBase['contact'];
    }

    // Cybersecurity
    if (lower.includes('cyber') || lower.includes('security') || lower.includes('infosec') || lower.includes('penetration') || lower.includes('forensic')) {
      return this.knowledgeBase['cyber'] + ' ' + this.knowledgeBase['contact'];
    }

    // Certifications
    if (lower.includes('certification') || lower.includes('certificate') || lower.includes('exam') || lower.includes('credential')) {
      return this.knowledgeBase['certifications'] + ' ' + this.knowledgeBase['contact'];
    }

    // Corporate Training
    if (lower.includes('corporate') || lower.includes('team training') || lower.includes('institution') || lower.includes('college training') || lower.includes('upskill')) {
      return this.knowledgeBase['corporate'] + ' ' + this.knowledgeBase['contact'];
    }

    // Software Development
    if (lower.includes('software') || lower.includes('web app') || lower.includes('mobile app') || lower.includes('development') || lower.includes('mvp') || lower.includes('deploy')) {
      return this.knowledgeBase['software'];
    }

    // Digital Learning / eLearning / LMS
    if (lower.includes('digital learning') || lower.includes('elearning') || lower.includes('lms') || lower.includes('gamif') || lower.includes('online course') || lower.includes('e-learning')) {
      return this.knowledgeBase['digital_learning'];
    }

    // Internship
    if (lower.includes('intern') || lower.includes('internship') || lower.includes('rd ') || lower.includes('r&d') || lower.includes('research')) {
      return this.knowledgeBase['internship'] + ' ' + this.knowledgeBase['contact'];
    }

    // Collaborations
    if (lower.includes('collaborat') || lower.includes('partner') || lower.includes('partnership')) {
      return this.knowledgeBase['collaborations'] + ' ' + this.knowledgeBase['contact'];
    }

    // Programs
    if (lower.includes('program') || lower.includes('track') || lower.includes('path') || lower.includes('course') || lower.includes('curriculum')) {
      return this.knowledgeBase['programs'];
    }

    // Workshops
    if (lower.includes('workshop') || lower.includes('batch') || lower.includes('upcoming') || lower.includes('session')) {
      return this.knowledgeBase['workshops'];
    }

    // Free workshops
    if (lower.includes('free') || lower.includes('no cost') || lower.includes('without fee')) {
      return 'VidyaOps offers free workshops as accessible entry points to explore Cloud, Data, AI, and Cybersecurity topics. Check the Workshops page or contact us to learn about upcoming free sessions.';
    }

    // Paid workshops
    if (lower.includes('paid') || lower.includes('pricing') || lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('how much') || lower.includes('rate')) {
      return this.knowledgeBase['pricing'];
    }

    // CSR
    if (lower.includes('csr') || lower.includes('social') || lower.includes('giving back') || lower.includes('community') || lower.includes('women') || lower.includes('rural') || lower.includes('veteran') || lower.includes('sustain')) {
      return this.knowledgeBase['csr'];
    }

    // Contact info
    if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('whatsapp') || lower.includes('call') || lower.includes('reach')) {
      return this.knowledgeBase['contact'];
    }

    // Location
    if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('office') || lower.includes('city') || lower.includes('pune')) {
      return this.knowledgeBase['location'];
    }

    // Schedule / Timing
    if (lower.includes('schedule') || lower.includes('timing') || lower.includes('when') || lower.includes('time') || lower.includes('weekend') || lower.includes('evening')) {
      return this.knowledgeBase['schedule'];
    }

    // Audience / Who is it for
    if (lower.includes('student') || lower.includes('fresher') || lower.includes('beginner') || lower.includes('professional') || lower.includes('who') || lower.includes('适合') || lower.includes('for me')) {
      return this.knowledgeBase['audience'] + ' ' + this.knowledgeBase['recommendation'];
    }

    // Career guidance
    if (lower.includes('career') || lower.includes('job') || lower.includes('resume') || lower.includes('interview') || lower.includes('placement') || lower.includes('hiring')) {
      return this.knowledgeBase['career'] + ' ' + this.knowledgeBase['contact'];
    }

    // Mentors
    if (lower.includes('mentor') || lower.includes('teacher') || lower.includes('instructor') || lower.includes('faculty') || lower.includes('who teach')) {
      return this.knowledgeBase['mentor'];
    }

    // Hands-on
    if (lower.includes('hands') || lower.includes('practical') || lower.includes('lab') || lower.includes('project') || lower.includes('real')) {
      return this.knowledgeBase['hands_on'];
    }

    // Privacy
    if (lower.includes('privacy') || lower.includes('data') && lower.includes('collect') || lower.includes('personal')) {
      return this.knowledgeBase['privacy'];
    }

    // Terms
    if (lower.includes('terms') || lower.includes('condition') || lower.includes('policy')) {
      return this.knowledgeBase['terms'];
    }

    // FAQ
    if (lower.includes('faq') || lower.includes('question') || lower.includes('doubt') || lower.includes('confused') || lower.includes('help me')) {
      return this.knowledgeBase['faq'];
    }

    // Partners
    if (lower.includes('partner') || lower.includes('alliance') || lower.includes('ecosystem') || lower.includes('collaboration')) {
      return this.knowledgeBase['partners'];
    }

    // Recommendation
    if (lower.includes('recommend') || lower.includes('best') || lower.includes('start') || lower.includes('which') || lower.includes('suggest') || lower.includes('advice')) {
      return this.knowledgeBase['recommendation'];
    }

    // How it works
    if (lower.includes('how') && (lower.includes('work') || lower.includes('it work') || lower.includes('process'))) {
      return 'VidyaOps follows a simple process: Discover (we understand your background and goals) → Design (we shape a training plan around your outcomes) → Deliver (guided sessions with hands-on labs and real-world application). Contact us to get started.';
    }

    // Default fallback
    return 'I can help with VidyaOps trainings, workshops, services, pricing, contact info, and career guidance. You can ask about:\n\n• Cloud, Data, AI, or Cybersecurity training\n• Free and paid workshops\n• Corporate and institutional programs\n• Software development services\n• R&D internships and collaborations\n• Pricing and scheduling\n• How to get started\n\nWhat would you like to know?';
  }

  private getLocalCounselorReply(learnerType: string, interest: string, goal: string): string {
    const learner = learnerType.toLowerCase();
    const area = interest.toLowerCase();
    const objective = goal.toLowerCase();

    let recommendation = 'a free workshop';
    let reason = 'because it gives you a low-risk and practical way to explore the domain first.';

    if (area.includes('cloud') || area.includes('data') || area.includes('ai') || area.includes('cyber')) {
      if (objective.includes('career') || objective.includes('practical') || objective.includes('skill')) {
        recommendation = `our ${interest} training program`;
        reason = 'because you want deeper practical growth, not just an introduction. It includes hands-on labs, project work, and certification preparation.';
      } else if (objective.includes('explore') || objective.includes('first') || objective.includes('try')) {
        recommendation = `a ${interest} free workshop`;
        reason = 'because it gives you clarity before you commit to a larger program. You will get hands-on exposure in a single session.';
      } else if (objective.includes('certification') || objective.includes('credential')) {
        recommendation = `the ${interest} certification track`;
        reason = 'because it combines practical learning with structured exam preparation and mentor guidance.';
      }
    }

    if (area.includes('software') || area.includes('development') || area.includes('web') || area.includes('mobile')) {
      recommendation = 'a software development project experience';
      reason = 'because building real projects is the best way to learn development. VidyaOps can guide you through hands-on project work.';
    }

    if (learner.includes('student') || learner.includes('fresher') || learner.includes('college')) {
      reason += ' For your stage, clarity and momentum matter more than trying to learn everything at once. An R&D internship might also be a great fit for real project exposure.';
    }

    if (learner.includes('professional') || learner.includes('working')) {
      reason += ' As a working professional, our flexible scheduling with weekend and evening batches would suit your availability.';
    }

    if (learner.includes('team') || learner.includes('college') || learner.includes('institution')) {
      recommendation = 'a customized corporate or institutional training program';
      reason = 'because group learning works best with tailored curricula, flexible scheduling, and measurable outcomes.';
    }

    return `Based on what you shared, I recommend starting with ${recommendation} ${reason}\n\nYou can contact VidyaOps at 9503685152, email info@vidyaops.com, or WhatsApp us for a personalized recommendation. Shall I help you get started?`;
  }

  private getSessionId(): string {
    const key = 'vidyaops_chat_session_id';
    const existing = localStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const generated = crypto.randomUUID();
    localStorage.setItem(key, generated);
    return generated;
  }

  private persistLead(lead: LeadCaptureData): void {
    localStorage.setItem('vidyaops_lead_prefill', JSON.stringify(lead));
  }
}
