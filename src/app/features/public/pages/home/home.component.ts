import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../../core/services/site-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly content = inject(SiteContentService);

  readonly stats = this.content.homeStats;
  readonly services = this.content.serviceCards;
  readonly caseStudies = this.content.caseStudies;
  readonly whyUs = this.content.whyVidyaOps;
  readonly testimonials = this.content.testimonials;
  readonly csr = this.content.csrCards;
  readonly partners = this.content.partners;
  readonly cta = this.content.footerCta;

  readonly techTicker: Array<{ id: string; name: string; color: string }> = [
    { id: 'aws',          name: 'AWS',                 color: '#FF9900' },
    { id: 'azure',        name: 'Microsoft Azure',     color: '#0078D4' },
    { id: 'googlecloud',  name: 'Google Cloud',        color: '#4285F4' },
    { id: 'docker',       name: 'Docker',              color: '#2496ED' },
    { id: 'kubernetes',   name: 'Kubernetes',          color: '#326CE5' },
    { id: 'github',       name: 'GitHub',              color: '#181717' },
    { id: 'git',          name: 'Git',                 color: '#F05032' },
    { id: 'jenkins',      name: 'Jenkins',             color: '#D24939' },
    { id: 'terraform',    name: 'Terraform',           color: '#844FBA' },
    { id: 'ansible',      name: 'Ansible',             color: '#EE0000' },
    { id: 'python',       name: 'Python',              color: '#3776AB' },
    { id: 'javascript',   name: 'JavaScript',          color: '#F7DF1E' },
    { id: 'typescript',   name: 'TypeScript',          color: '#3178C6' },
    { id: 'react',        name: 'React',               color: '#61DAFB' },
    { id: 'angular',      name: 'Angular',             color: '#DD0031' },
    { id: 'nodejs',       name: 'Node.js',             color: '#339933' },
    { id: 'nextdotjs',    name: 'Next.js',             color: '#000000' },
    { id: 'flutter',      name: 'Flutter',             color: '#02569B' },
    { id: 'go',           name: 'Go',                  color: '#00ADD8' },
    { id: 'rust',         name: 'Rust',                color: '#000000' },
    { id: 'mongodb',      name: 'MongoDB',             color: '#47A248' },
    { id: 'mysql',        name: 'MySQL',               color: '#4479A1' },
    { id: 'postgresql',   name: 'PostgreSQL',          color: '#4169E1' },
    { id: 'redis',        name: 'Redis',               color: '#DC382D' },
    { id: 'kafka',        name: 'Apache Kafka',        color: '#231F20' },
    { id: 'spark',        name: 'Apache Spark',        color: '#E25A1C' },
    { id: 'tensorflow',   name: 'TensorFlow',          color: '#FF6F00' },
    { id: 'pytorch',      name: 'PyTorch',             color: '#EE4C2C' },
    { id: 'spring',       name: 'Spring',              color: '#6DB33F' },
    { id: 'huggingface',  name: 'Hugging Face',        color: '#FFD21E' },
    { id: 'mlflow',       name: 'MLflow',              color: '#0194E2' },
    { id: 'splunk',       name: 'Splunk',              color: '#000000' },
    { id: 'kaggle',       name: 'Kaggle',              color: '#20BEFF' },
    { id: 'linux',        name: 'Linux',               color: '#FCC624' },
    { id: 'grafana',      name: 'Grafana',             color: '#F46800' },
    { id: 'kalilinux',    name: 'Kali Linux',          color: '#557C94' }
  ];

  readonly heroSlides = [
    {
      src: 'https://images.pexels.com/photos/7693692/pexels-photo-7693692.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Team collaborating together in a meeting',
      caption: 'Partnership and collaboration that drive real outcomes'
    },
    {
      src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Instructor guiding learners during a training session',
      caption: 'Interactive training in small, engaged groups'
    },
    {
      src: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Team collaborating around a table during a meeting',
      caption: 'Strategy and collaboration sessions that drive outcomes'
    },
    {
      src: 'https://images.pexels.com/photos/14851464/pexels-photo-14851464.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Colleagues having a meeting together',
      caption: 'Industry-aligned labs mirroring the real workplace'
    }
  ];

  carouselIndex = 0;
  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.timer = setInterval(() => this.carouselNext(), 5500);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  carouselPrev(): void {
    this.carouselIndex =
      (this.carouselIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  carouselNext(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.heroSlides.length;
  }

  carouselGo(index: number): void {
    this.carouselIndex = index;
  }
}
