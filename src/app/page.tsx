'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import VoiceAssistant from '@/components/VoiceAssistant';
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Server,
  Brain,
  ArrowRight,
  Monitor,
  Smartphone,
  Database,
  Check,
  Menu,
  X,
  Globe,
  GraduationCap,
  Send,
  Star,
  ChevronDown,
  ShoppingCart,
  HeartPulse,
  Building2,
  Truck,
  Gamepad2,
  Layers,
  Code2,
  Zap,
  Briefcase,
  Award,
} from 'lucide-react';

// ── Brand SVG Icons ────────────────────────────────────────────────────────────
function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  );
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function UpworkIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-3.793 0-6.166 2.541-6.709 5.378-1.503-2.223-2.617-4.839-3.158-7.396H5.452v7.26c0 2.05-1.668 3.718-3.718 3.718v3.242c3.837 0 6.96-3.123 6.96-6.96V4.992c.531 2.27 1.543 4.606 2.91 6.643l-2.483 11.666h3.313l1.802-8.468c1.328.847 2.846 1.341 4.325 1.341 3.284 0 5.947-2.663 5.947-5.947 0-3.285-2.663-5.948-5.947-5.948z" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CourseItem {
  id: string;
  num: string;
  title: string;
  duration: '3 Months' | '6 Months' | 'Bonus Free';
  category: '3-month' | '6-month';
  tagline: string;
  desc: string;
  tech: string;
  highlight?: boolean;
  featured?: boolean;
  roadmap: { stage: string; title: string; topics: string[] }[];
}

// ── Nav Config ────────────────────────────────────────────────────────────────
const NAV_SERVICES = [
  { label: 'Desktop Apps (Electron.js)', href: '#services', icon: '🖥️' },
  { label: 'Full-Stack Web & SaaS', href: '#services', icon: '🌐' },
  { label: 'Mobile Apps (React Native)', href: '#services', icon: '📱' },
  { label: 'eSports Platforms', href: '#services', icon: '🎮' },
  { label: 'Microservices Architecture', href: '#services', icon: '⚙️' },
  { label: 'Real-Time Voice AI', href: '#services', icon: '🎙️' },
];

const NAV_PRODUCTS = [
  { label: 'Bakery POS Desktop ERP', href: '#products', icon: '🏪' },
  { label: 'NutriCare Clinical SaaS', href: '#products', icon: '💊' },
  { label: 'Arenyxa eSports Platform', href: '#products', icon: '🎮' },
  { label: 'Haider Voice AI Agent', href: '#products', icon: '🤖' },
  { label: 'GG IT Academy ERP', href: '#products', icon: '🎓' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { token } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const [courseFilter, setCourseFilter] = useState<'all' | '3-month' | '6-month'>('all');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const [inquiryType, setInquiryType] = useState<'client' | 'student'>('client');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Desktop POS & ERP Application (Electron.js)');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const closeMobile = () => { setMobileMenuOpen(false); setMobileExpanded(null); };

  const courses: CourseItem[] = [
    {
      id: 'desktop-apps', num: '01', title: 'Desktop App Engineering', duration: '6 Months', category: '6-month',
      tagline: 'Offline-First Enterprise Desktop with Electron.js',
      desc: 'Build cross-platform desktop apps for Windows, Mac & Linux using Electron.js, React 19, Headless NestJS, and SQLite/MySQL.',
      tech: 'Electron.js · React 19 · NestJS · SQLite WAL · MySQL · IPC', highlight: true,
      roadmap: [
        { stage: 'Stage 1', title: 'Web Core Fundamentals', topics: ['HTML5 Semantic Markup & Modern CSS3', 'JavaScript ES6+ Promises & Async/Await', 'DOM Manipulation & Event Listeners'] },
        { stage: 'Stage 2', title: 'Modern React Client Systems', topics: ['React 19 Components, State & Custom Hooks', 'Tailwind CSS & Component Architecture', 'Client State Management & Local Storage'] },
        { stage: 'Stage 3', title: 'NestJS Backend Architecture', topics: ['Node.js Runtime & TypeScript Mastery', 'NestJS Controllers, Services & DI', 'TypeORM Entity Modeling & Repository Pattern'] },
        { stage: 'Stage 4', title: 'Databases: SQL & Offline', topics: ['MySQL Relational Schema Design & Indexing', 'SQLite with WAL (Write-Ahead Logging) Mode', 'Data Migrations, Seeding & Integrity Checks'] },
        { stage: 'Stage 5', title: 'Electron.js Desktop Deep Dive', topics: ['Main vs Renderer Process Architecture', 'Context Bridge & Secure IPC Communication', 'Hardware: Thermal Printers & Barcode Scanners'] },
        { stage: 'Stage 6', title: 'Production & Career', topics: ['Electron Builder, Code Signing & Auto-Updates', 'Bakery POS / ERP Capstone Project', 'Upwork & Freelance Delivery Strategies'] },
      ],
    },
    {
      id: 'web-dev', num: '02', title: 'Full-Stack Web Development', duration: '6 Months', category: '6-month',
      tagline: 'Enterprise SaaS & Web Platforms',
      desc: 'Master full-stack web engineering with HTML, React, Next.js, NestJS, PostgreSQL/MongoDB, and cloud deployments.',
      tech: 'HTML5 · CSS3 · React · Next.js · NestJS · PostgreSQL',
      roadmap: [
        { stage: 'Stage 1', title: 'Web Foundation', topics: ['HTML5, CSS3 Responsive Layouts', 'Modern JavaScript ES6+, Async/Await', 'Git Version Control & GitHub Workflows'] },
        { stage: 'Stage 2', title: 'React & Next.js Full Stack', topics: ['React Components, Hooks, State & Context', 'Next.js App Router, SSR, SSG & Server Actions', 'Tailwind CSS & Design Systems'] },
        { stage: 'Stage 3', title: 'Node.js & NestJS Architecture', topics: ['Node.js Event Loop & Express Basics', 'NestJS Enterprise Modular Architecture', 'JWT Authentication, RBAC & Middleware'] },
        { stage: 'Stage 4', title: 'Database Engineering', topics: ['PostgreSQL Relational Design & Constraints', 'MongoDB Document Modeling with Mongoose', 'TypeORM / Prisma ORM & Transactions'] },
        { stage: 'Stage 5', title: 'Real-time & APIs', topics: ['RESTful API Design & Validation', 'Socket.io WebSockets for Live Notifications', 'Stripe Payment Gateway Integration'] },
        { stage: 'Stage 6', title: 'DevOps & Job Placement', topics: ['Docker Containerization & AWS/Vercel', 'Production Capstone SaaS Project', 'Upwork & Fiverr Bidding Masterclass'] },
      ],
    },
    {
      id: 'mobile-dev', num: '03', title: 'Mobile App Development', duration: '6 Months', category: '6-month',
      tagline: 'Native Performance for iOS & Android',
      desc: 'Build cross-platform mobile apps with React Native and Flutter. Native device APIs, push notifications, offline caching.',
      tech: 'React Native · Flutter · Expo · Firebase · Store Publishing',
      roadmap: [
        { stage: 'Stage 1', title: 'Programming & JS Core', topics: ['JavaScript ES6+, Destructuring, Modules', 'Mobile UI Design Principles & Viewports', 'Dart Fundamentals for Flutter'] },
        { stage: 'Stage 2', title: 'React Native & Expo', topics: ['Native Components: View, Text, FlatList', 'React Navigation (Tabs, Stacks, Drawers)', 'State Management with Redux Toolkit / Zustand'] },
        { stage: 'Stage 3', title: 'Device Hardware & Features', topics: ['Camera, Geolocation & Biometric Auth', 'Push Notifications (FCM)', 'Offline Storage with SQLite'] },
        { stage: 'Stage 4', title: 'Backend Integration', topics: ['Connecting to NestJS REST APIs', 'JWT Token Storage in SecureStore', 'Real-time Chat with WebSockets'] },
        { stage: 'Stage 5', title: 'Flutter & Dart Deep Dive', topics: ['Widget Tree, Stateless & Stateful', 'Provider & Bloc Pattern', 'Native Performance Optimization'] },
        { stage: 'Stage 6', title: 'Store Deployment & Portfolio', topics: ['App Store & Google Play Submission', 'Complete Mobile Capstone App', 'Freelance Mobile App Bidding'] },
      ],
    },
    {
      id: 'gen-ai', num: '04', title: 'Generative & Agentic AI', duration: '3 Months', category: '3-month',
      tagline: 'Autonomous Agents & Sub-Second Voice AI',
      desc: 'Design, deploy, and scale autonomous AI systems. LLMs, custom Deepgram voice pipelines, and multi-tool agents.',
      tech: 'Deepgram · Gemini API · LangChain · Twilio · WebSockets', highlight: true,
      roadmap: [
        { stage: 'Stage 1', title: 'Python & AI Foundations', topics: ['Python 3 OOP, Asyncio & Setup', 'Prompt Engineering & Few-Shot Learning', 'Tokenization, Embeddings & Vector Spaces'] },
        { stage: 'Stage 2', title: 'LLM Orchestration & APIs', topics: ['Gemini 2.0 API & Structured JSON Output', 'Tool Calling & Dynamic Actions', 'Retrieval Augmented Generation (RAG)'] },
        { stage: 'Stage 3', title: 'Real-Time Voice AI', topics: ['Deepgram Live Streaming STT & TTS', 'WebSockets for Audio Chunk Streaming', 'Twilio Media Streams for Live Calls'] },
        { stage: 'Stage 4', title: 'Autonomous Multi-Agent Systems', topics: ['Agentic Workflows with Memory & Planning', 'Building Real-time Voice Care Agent', 'Production Deployment on Cloud Servers'] },
      ],
    },
    {
      id: 'python-backend', num: '05', title: 'Python & Microservices', duration: '3 Months', category: '3-month',
      tagline: 'High-Concurrency Server Architecture',
      desc: 'Fundamentals to advanced algorithms. Data structures, OOP, async programming, FastAPI, and microservice deployments.',
      tech: 'Python 3 · FastAPI · Asyncio · PostgreSQL · Docker · Redis',
      roadmap: [
        { stage: 'Stage 1', title: 'Python Fundamentals to OOP', topics: ['Data Types, Lists, Dicts, Comprehensions', 'Object-Oriented Programming', 'Error Handling & Unit Testing'] },
        { stage: 'Stage 2', title: 'Modern FastAPI Web Services', topics: ['Pydantic Data Validation & Schemas', 'Async Endpoints & Background Tasks', 'JWT Authentication & Password Hashing'] },
        { stage: 'Stage 3', title: 'Database & Caching', topics: ['SQLAlchemy ORM & Alembic Migrations', 'PostgreSQL Connection Pooling', 'Redis Caching & Pub/Sub Messaging'] },
        { stage: 'Stage 4', title: 'Microservices & Deployment', topics: ['Dockerizing Python Applications', 'Building Scalable Task Queues (Celery)', 'API Documentation & Swagger UI'] },
      ],
    },
    {
      id: 'sql-nosql', num: '06', title: 'SQL Postgres / NoSQL Mongo', duration: '3 Months', category: '3-month',
      tagline: 'Enterprise Data Modeling & Performance',
      desc: 'Master database designs. Complex SQL joins, index optimizations, transactions in PostgreSQL/MySQL, and MongoDB queries.',
      tech: 'PostgreSQL · MySQL · MongoDB · Redis · Indexing · Transactions',
      roadmap: [
        { stage: 'Stage 1', title: 'Relational Theory & SQL Mastery', topics: ['Entity Relationship Diagrams & Normalization', 'Complex Joins, Aggregations & Subqueries', 'Primary Keys, Foreign Keys & Constraints'] },
        { stage: 'Stage 2', title: 'Transactions, ACID & Performance', topics: ['ACID Properties, Isolation Levels & Locks', 'Indexing Strategies (B-Tree, Hash, GIN)', 'EXPLAIN ANALYZE & Query Optimization'] },
        { stage: 'Stage 3', title: 'NoSQL with MongoDB', topics: ['Document Schemas vs Relational Tables', 'Aggregation Pipeline & Indexing', 'Embedding vs Referencing Design'] },
        { stage: 'Stage 4', title: 'Enterprise Backups & HA', topics: ['SQLite WAL Mode & Replication Concepts', 'Automated Daily Dump Scripts', 'Data Migration Pipelines'] },
      ],
    },
    {
      id: 'interactive-js', num: '07', title: 'JavaScript Deep Dive (ES6+)', duration: '3 Months', category: '3-month',
      tagline: 'Modern ECMAScript & Browser APIs',
      desc: 'Deep JavaScript mastery. Asynchronous scripting, DOM APIs, AJAX, event loops, and OOP architectures.',
      tech: 'ES6+ · Event Loop · Web APIs · OOP · Async/Await',
      roadmap: [
        { stage: 'Stage 1', title: 'Core Syntax & Memory', topics: ['Scope, Hoisting, Closures & Execution Contexts', 'Prototypes, Classes & Object Patterns', 'Array Operations & Functional Programming'] },
        { stage: 'Stage 2', title: 'Asynchronous JavaScript', topics: ['Event Loop, Microtasks vs Macrotasks', 'Promises, Promise.all, Async/Await', 'Fetch API & Error Handling'] },
        { stage: 'Stage 3', title: 'Browser Web APIs & DOM', topics: ['Event Bubbling, Capturing & Delegation', 'LocalStorage, SessionStorage & Cookies', 'Canvas 2D API & Audio Context'] },
        { stage: 'Stage 4', title: 'Frontend Architecture Capstone', topics: ['Modular Code Organization & Bundlers', 'Building an Interactive SPA', 'Preparation for React Framework'] },
      ],
    },
    {
      id: 'freelancing', num: '08', title: 'Freelancing & Remote Career', duration: 'Bonus Free', category: '6-month',
      tagline: 'Crack Remote Contracts & Upwork/Fiverr',
      desc: 'Upwork & Fiverr bidding strategies, portfolio construction, CV formatting, international client communication & mock interviews.',
      tech: 'Upwork · Fiverr · Remote Jobs · Portfolios · Mock Interviews', featured: true,
      roadmap: [
        { stage: 'Stage 1', title: 'Profile & Portfolio Setup', topics: ['Crafting a 100% Complete Upwork Profile', 'Fiverr Gigs Architecture & Keyword Research', 'GitHub Portfolio & Live Project Deployments'] },
        { stage: 'Stage 2', title: 'High-Converting Proposals', topics: ['Analyzing Client Job Descriptions', 'Writing Personalized Video/Text Proposals', 'Pricing Strategies: Hourly vs Fixed Price'] },
        { stage: 'Stage 3', title: 'Client Communication', topics: ['Conducting Zoom Discovery Calls', 'Managing Scope Creep & Milestones', 'Handling Ratings & Top-Rated Status'] },
        { stage: 'Stage 4', title: 'Technical Interview Prep', topics: ['Data Structures & Algorithm Questions', 'System Design Walkthroughs', 'Live Mock Coding Interviews'] },
      ],
    },
  ];

  const filteredCourses = courseFilter === 'all'
    ? courses
    : courses.filter(c => c.category === courseFilter || c.featured);

  return (
    <div
      className="min-h-screen font-sans text-slate-800 flex flex-col antialiased"
      style={{ background: 'linear-gradient(160deg, #d6edf9 0%, #e4f2fb 25%, #eef7fd 55%, #f7fbff 80%, #ffffff 100%)' }}
    >

      {/* ═══════════════════════════════ TOP NOTIFICATION BAR ═══════════════════════════════ */}
      <aside aria-label="Global announcement" className="relative z-50 bg-gradient-to-r from-[#061e38] via-[#0284c7] to-[#061e38] text-white px-3 sm:px-4 py-2 text-xs sm:text-[13px] border-b border-sky-400/25 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-sky-100 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Software House &amp; Academy
          </span>
          <span className="text-slate-100">
            Enterprise Desktop &amp; Web Apps, Microservices, Voice AI &amp; Professional IT Training Admissions Open
          </span>
          <a
            href="#contact"
            className="inline-flex items-center gap-1 text-sky-200 hover:text-white font-bold underline underline-offset-4 decoration-sky-300 hover:decoration-white transition"
          >
            Hire Us / Enroll Today →
          </a>
        </div>
      </aside>

      {/* ═══════════════════════════════ NAVBAR ═══════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.jpg" alt="GG IT Solutions" width={38} height={38}
              className="h-9 w-9 rounded-xl object-contain border border-sky-200 shadow-sm p-0.5 bg-white" />
            <span className="leading-tight hidden sm:block">
              <span className="block text-[13px] font-black tracking-[0.14em] text-[#0b2f58]">GG IT SOLUTIONS</span>
              <span className="block text-[10px] font-semibold tracking-[0.1em] text-sky-500 uppercase">Software House & Academy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5">
            <a href="#about-us" className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">About</a>

            {/* Products dropdown */}
            <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <button type="button" onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">
                Products
                <ChevronDown className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white shadow-xl border border-sky-100 py-2 px-1.5 z-50">
                  {NAV_PRODUCTS.map(item => (
                    <a key={item.label} href={item.href} onClick={() => setProductsOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button type="button" onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">
                Services
                <ChevronDown className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white shadow-xl border border-sky-100 py-2 px-1.5 z-50">
                  {NAV_SERVICES.map(item => (
                    <a key={item.label} href={item.href} onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#courses" className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">Courses</a>
            <a href="#success" className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">Alumni</a>
            <a href="#contact" className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition">Contact</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:inline-flex items-center text-[12px] font-bold uppercase tracking-widest text-sky-700 hover:text-sky-900 px-3 py-2 rounded-lg hover:bg-sky-50 transition">
              Portal
            </Link>
            {token ? (
              <Link href="/profile" className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-white transition shadow-sm">
                Dashboard →
              </Link>
            ) : (
              <a href="#contact" className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-white transition shadow-sm">
                Hire Us
              </a>
            )}
            {/* Hamburger */}
            <button type="button" className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-sky-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Drawer ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 bg-white px-4 py-3 shadow-xl">
            <nav className="flex flex-col divide-y divide-sky-50">

              <a href="#about-us" className="py-3 text-sm font-semibold text-slate-700 hover:text-sky-700 transition" onClick={closeMobile}>About Us</a>

              {/* Products accordion */}
              <div>
                <button type="button" className="w-full py-3 flex items-center justify-between text-sm font-semibold text-slate-700"
                  onClick={() => setMobileExpanded(mobileExpanded === 'products' ? null : 'products')}>
                  Products
                  <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform ${mobileExpanded === 'products' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === 'products' && (
                  <div className="pl-4 pb-2 space-y-0.5">
                    {NAV_PRODUCTS.map(item => (
                      <a key={item.label} href={item.href} onClick={closeMobile}
                        className="flex items-center gap-2 py-2 text-xs text-slate-600 hover:text-sky-700 transition">
                        <span>{item.icon}</span><span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Services accordion */}
              <div>
                <button type="button" className="w-full py-3 flex items-center justify-between text-sm font-semibold text-slate-700"
                  onClick={() => setMobileExpanded(mobileExpanded === 'services' ? null : 'services')}>
                  Services
                  <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform ${mobileExpanded === 'services' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === 'services' && (
                  <div className="pl-4 pb-2 space-y-0.5">
                    {NAV_SERVICES.map(item => (
                      <a key={item.label} href={item.href} onClick={closeMobile}
                        className="flex items-center gap-2 py-2 text-xs text-slate-600 hover:text-sky-700 transition">
                        <span>{item.icon}</span><span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="#courses" className="py-3 text-sm font-semibold text-slate-700 hover:text-sky-700 transition" onClick={closeMobile}>Courses & Roadmaps</a>
              <a href="#success" className="py-3 text-sm font-semibold text-slate-700 hover:text-sky-700 transition" onClick={closeMobile}>Alumni Success</a>
              <a href="#contact" className="py-3 text-sm font-semibold text-slate-700 hover:text-sky-700 transition" onClick={closeMobile}>Contact</a>
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={closeMobile}
                className="text-center py-2.5 rounded-xl border border-sky-200 text-sky-800 font-bold text-xs hover:bg-sky-50 transition">
                Portal Login
              </Link>
              <a href="#contact" onClick={closeMobile}
                className="text-center py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition shadow-sm">
                Hire Us / Apply
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        id="hero"
        className="relative overflow-hidden px-4 sm:px-6 lg:px-10 pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32 text-center"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(125,211,252,0.28) 0%, transparent 70%)',
            }}
          />

          <div
            className="absolute bottom-0 right-0 w-[420px] h-[260px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(103,232,249,0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-5xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            Software House · IT Services · IT Training
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-4xl font-black tracking-[-0.035em] leading-[1.06] text-[#0b2f58] sm:text-5xl lg:text-[4rem]">
            We Build Software That
            <span
              className="block mt-1"
              style={{
                background:
                  'linear-gradient(135deg, #0284c7 0%, #06b6d4 55%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Moves Businesses Forward.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Custom web, backend, desktop and AI solutions for businesses —
            backed by practical IT training for the next generation of developers.
          </p>

          {/* Service pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              'Web & Backend',
              'Desktop Apps',
              'AI & Voice',
              'Cloud Systems',
              'IT Training',
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-sky-200/80 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold text-sky-800 shadow-sm backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-sky-700 hover:shadow-lg sm:w-auto"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#courses"
              className="inline-flex w-full items-center justify-center rounded-xl border border-sky-300 bg-white/80 px-7 py-3.5 text-sm font-bold text-[#0b2f58] shadow-sm transition hover:border-sky-400 hover:bg-white sm:w-auto"
            >
              Explore IT Training
            </a>

            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white/70 px-6 py-3.5 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-white sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-sky-500" />
              Talk to AI
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ ABOUT ═══════════════════════════════ */}
      <section id="about-us" className="py-20 px-4 sm:px-6 lg:px-10 bg-white border-y border-sky-100">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[0.35fr_1fr] gap-10 items-center">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b from-sky-50 to-[#eef7fd] border border-sky-100">
            <Image src="/logo.jpg" alt="GG IT Solutions" width={90} height={90}
              className="rounded-2xl object-contain bg-white p-1.5 border border-sky-200 shadow-sm mb-3" />
            <h3 className="text-base font-black text-[#0b2f58] tracking-wider">GG IT SOLUTIONS</h3>
            <p className="text-[10px] font-bold text-sky-500 tracking-widest uppercase mt-1">INNOVATION · AGILITY · VALUE</p>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-4">We are GG IT Solutions!</h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-3">
              A technology powerhouse delivering cutting-edge desktop POS systems with Electron.js, enterprise SaaS with React & NestJS, eSports tournament platforms, enterprise microservices, and low-latency Voice AI integrations.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Our Academy bridges academic theory and industry reality — training students through production code reviews, Git workflows, and verifiable career placements on Upwork, local firms, and global platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ INDUSTRIES ═══════════════════════════════ */}
      <section id="industries" className="py-20 px-4 sm:px-6 lg:px-10 bg-[#f5fafd] border-b border-sky-100">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Our Industry Focus</h2>
          <p className="text-sm text-slate-400 mb-12">Specialized solutions across key verticals</p>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <ShoppingCart className="w-5 h-5" />, label: 'Retail & Bakeries' },
              { icon: <HeartPulse className="w-5 h-5" />, label: 'Healthcare' },
              { icon: <GraduationCap className="w-5 h-5" />, label: 'Education & LMS' },
              { icon: <Building2 className="w-5 h-5" />, label: 'Banking & FinTech' },
              { icon: <Truck className="w-5 h-5" />, label: 'Logistics' },
              { icon: <Gamepad2 className="w-5 h-5" />, label: 'eSports & Gaming' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PRODUCTS ═══════════════════════════════ */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-sky-100">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Our Products</h2>
          <p className="text-sm text-slate-400 mb-12">Scalable, dynamic, and industry-focused</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              { icon: <Monitor className="w-6 h-6" />, title: 'Bakery POS Desktop ERP', desc: 'Electron.js · React 19 · NestJS · SQLite WAL', badge: 'Live', badgeColor: 'sky', link: null },
              { icon: <HeartPulse className="w-6 h-6" />, title: 'NutriCare Clinical SaaS', desc: 'Next.js · PostgreSQL · AI Diet Engine', badge: 'Live', badgeColor: 'emerald', link: null },
              { icon: <Gamepad2 className="w-6 h-6" />, title: 'Arenyxa eSports Platform', desc: 'PUBG · Free Fire · CoD — Tournament Management', badge: 'Live', badgeColor: 'purple', link: 'https://arenyxa-web.fly.dev' },
              { icon: <Brain className="w-6 h-6" />, title: 'Haider Voice AI Agent', desc: 'Twilio Streams · Deepgram · Gemini Flash', badge: 'Beta', badgeColor: 'indigo', link: null },
              { icon: <Layers className="w-6 h-6" />, title: 'Enterprise Microservices', desc: 'NestJS · Docker · RabbitMQ · Redis · Client-Ready', badge: 'Available', badgeColor: 'cyan', link: null },
              { icon: <GraduationCap className="w-6 h-6" />, title: 'GG IT Academy ERP', desc: 'Student Attendance · LMS · Quiz AI Engine', badge: 'Beta', badgeColor: 'orange', link: null },
            ].map(p => (
              <div key={p.title} className="p-5 sm:p-6 rounded-2xl bg-[#f7fbfe] border border-sky-100 flex flex-col items-start text-left hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h4 className="text-sm font-bold text-[#0b2f58] mb-1">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between w-full">
                  <span className={`px-2 py-0.5 rounded-full bg-${p.badgeColor}-100 text-${p.badgeColor}-700 text-[10px] font-bold uppercase tracking-wide`}>{p.badge}</span>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold">
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <a href="#contact" className="inline-flex items-center justify-center rounded-xl border border-sky-400 text-sky-700 hover:bg-sky-50 font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition">
            Request Product Demo
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════ SERVICES ═══════════════════════════════ */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-10 bg-[#f5fafd] border-b border-sky-100">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Our Services</h2>
          <p className="text-sm text-slate-400 mb-12">End-to-end engineering for modern businesses</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Monitor className="w-5 h-5" />, title: 'Desktop App Engineering', desc: 'Windows, Mac & Linux desktop platforms in Electron.js, React 19, and NestJS with offline SQLite/MySQL support.' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Full-Stack Web & SaaS', desc: 'Multi-tenant SaaS architectures, Next.js App Router, NestJS microservices, and secure payment integrations.' },
              { icon: <Smartphone className="w-5 h-5" />, title: 'Cross-Platform Mobile Apps', desc: 'Native iOS and Android apps with React Native and Flutter — push notifications and offline syncing.' },
              { icon: <Gamepad2 className="w-5 h-5" />, title: 'eSports Tournament Platforms', desc: 'Full-featured tournament management for PUBG, Free Fire, Call of Duty — brackets, leaderboards & live scoring.' },
              { icon: <Layers className="w-5 h-5" />, title: 'Microservices Architecture', desc: 'Scalable NestJS microservices with RabbitMQ/Kafka, Docker orchestration, and Redis caching for enterprise clients.' },
              { icon: <Brain className="w-5 h-5" />, title: 'Voice AI & Agentic Systems', desc: 'Sub-second conversational voice bots using Twilio Media Streams, Deepgram streaming STT/TTS, and Gemini API.' },
              { icon: <Database className="w-5 h-5" />, title: 'Database Architecture', desc: 'PostgreSQL, MySQL, and MongoDB optimization, high-availability setups, connection pooling, and automated backups.' },
              { icon: <Server className="w-5 h-5" />, title: 'Cloud DevOps & CI/CD', desc: 'AWS, Docker containers, automated GitHub Actions CI/CD pipelines, and zero-downtime microservice deployments.' },
              { icon: <Zap className="w-5 h-5" />, title: 'IT Training & Academy', desc: 'Job-ready IT education from HTML/CSS to AI with interactive roadmaps, code reviews, and freelance mentoring.' },
            ].map(s => (
              <div key={s.title} className="p-5 sm:p-6 rounded-2xl bg-white border border-sky-100 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h4 className="text-sm font-bold text-[#0b2f58] mb-2">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ COURSES ═══════════════════════════════ */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-sky-100">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Courses & Roadmaps</h2>
            <p className="text-sm text-slate-400">Click any course card to explore its step-by-step milestone roadmap.</p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-1 p-1 rounded-xl bg-[#f0f7fd] border border-sky-100">
              {[{ val: 'all', label: `All (${courses.length})` }, { val: '6-month', label: '6-Month Diplomas' }, { val: '3-month', label: '3-Month Fast-Tracks' }].map(tab => (
                <button key={tab.val} type="button" onClick={() => setCourseFilter(tab.val as 'all' | '3-month' | '6-month')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${courseFilter === tab.val ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map(c => (
              <div key={c.id} onClick={() => setSelectedCourse(c)}
                className={`p-5 rounded-2xl border bg-[#f7fbfe] hover:bg-white hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between ${c.highlight ? 'border-sky-300 ring-2 ring-sky-200/50' : 'border-sky-100'}`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${c.duration === 'Bonus Free' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                      {c.duration}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{c.num}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0b2f58] mb-1">{c.title}</h4>
                  <p className="text-xs text-sky-600 font-medium mb-3">{c.tagline}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{c.desc}</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-400 border-t border-sky-100 pt-3 mb-2">{c.tech}</p>
                  <p className="text-xs font-bold text-sky-600 flex items-center justify-between">
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-sky-100">
            <div className="flex items-start justify-between gap-4 border-b border-sky-100 pb-4 mb-5">
              <div>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${selectedCourse.duration === 'Bonus Free' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>{selectedCourse.duration}</span>
                <h3 className="text-xl font-bold text-[#0b2f58] mt-2">{selectedCourse.title}</h3>
                <p className="text-xs text-sky-600 font-semibold">{selectedCourse.tagline}</p>
              </div>
              <button type="button" onClick={() => setSelectedCourse(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Step-by-Step Curriculum Roadmap</p>
            <div className="space-y-3">
              {selectedCourse.roadmap.map((stage, idx) => (
                <div key={stage.stage} className="flex gap-4 p-4 rounded-2xl bg-[#f7fbfe] border border-sky-100">
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">{idx + 1}</div>
                  <div>
                    <h5 className="text-sm font-bold text-[#0b2f58]">{stage.title}</h5>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                      {stage.topics.map((t, ti) => (
                        <li key={ti} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-sky-500 shrink-0" /><span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-sky-100 pt-4 mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedCourse(null)} className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">Close</button>
              <a href="#contact" onClick={() => setSelectedCourse(null)} className="px-6 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition shadow-sm">Enroll Now</a>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ ALUMNI ═══════════════════════════════ */}
      <section id="success" className="py-20 px-4 sm:px-6 lg:px-10 bg-[#f5fafd] border-b border-sky-100">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Student Success & Alumni Hall of Fame</h2>
          <p className="text-sm text-slate-400 mb-12">Our graduates build real software, earn remote contracts, and launch production systems.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { initials: 'HT', name: 'Hamza Tariq', role: 'Upwork Top-Rated ($18/hr)', quote: 'Within 2 months of completing the 6-month Web track, I secured remote US client contracts.', track: '6-Month Web Development', color: 'bg-sky-600' },
              { initials: 'ZF', name: 'Zainab Fatima', role: 'Mobile Dev at Tech Firm', quote: 'The React Native and native APIs helped me clear competitive coding interviews effortlessly.', track: '6-Month Mobile Track', color: 'bg-purple-600' },
              { initials: 'MB', name: 'Muhammad Bilal', role: 'Desktop POS Engineer', quote: 'Built an entire Electron.js retail billing and barcode scanner system running in 4 local pharmacies.', track: '6-Month Desktop Track', color: 'bg-blue-600' },
              { initials: 'UA', name: 'Usman Ali', role: '12+ Completed AI Orders', quote: 'Mastered Gemini tool calling and Deepgram voice bots. I now build automated support agents.', track: '3-Month AI Track', color: 'bg-cyan-600' },
            ].map(s => (
              <div key={s.name} className="p-5 rounded-2xl bg-white border border-sky-100 text-left shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-full ${s.color} text-white font-black text-xs flex items-center justify-center mb-3`}>{s.initials}</div>
                  <h4 className="text-sm font-bold text-[#0b2f58]">{s.name}</h4>
                  <p className="text-[11px] text-sky-600 font-bold mb-2">{s.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">&ldquo;{s.quote}&rdquo;</p>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-100 pt-2">{s.track}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-sky-100">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-2">Client Testimonials</h2>
          <p className="text-sm text-slate-400 mb-12">Trusted by businesses across the US, UK & Canada</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: 'Marcus V.', country: '🇺🇸 United States', project: 'Desktop POS System', quote: 'Delivered a robust Electron.js POS app ahead of schedule. Barcode scanner integration and offline SQLite support exceeded expectations.' },
              { name: 'David K.', country: '🇬🇧 United Kingdom', project: 'Voice AI Customer Care', quote: 'The real-time voice AI agent reduced our support costs by 40%. Latency is under 800ms — truly impressive engineering.' },
              { name: 'Sarah L.', country: '🇨🇦 Canada', project: 'SaaS Healthcare Platform', quote: 'NutriCare integrations were seamless. The NestJS backend handles 10k+ concurrent users with zero downtime.' },
            ].map(t => (
              <div key={t.name} className="p-6 rounded-2xl bg-[#f7fbfe] border border-sky-100 text-left hover:shadow-md transition">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-sky-100 pt-3">
                  <p className="text-xs font-bold text-[#0b2f58]">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.country} · {t.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ LEADERSHIP ═══════════════════════════════ */}
      <section
        id="leadership"
        className="py-20 px-4 sm:px-6 lg:px-10 bg-[#f5fafd] border-b border-sky-100"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 items-start">

            {/* Founder Image & Quick Card */}
            <div className="space-y-4">
              <div className="relative min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden shadow-lg border border-sky-100 group">
                <Image
                  src="/founder.png"
                  alt="Ghulam Ghaus - Founder & Principal Software Engineer"
                  fill
                  priority
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07213d] via-[#07213d]/40 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="px-3 py-1 bg-sky-500/90 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-wider w-fit mb-2 shadow-sm border border-sky-300/30">
                    Founder &amp; Principal Engineer
                  </span>

                  <h3 className="text-2xl font-bold tracking-tight">
                    Ghulam Ghaus
                  </h3>

                  <p className="text-xs text-sky-200 mt-1">
                    BS IT · Certified Agentic &amp; Robotic AI Engineer
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-2 text-[11px] text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>5 Marlah Scheme, Khurrianwala, Faisalabad · Open to Remote</span>
                  </div>
                </div>
              </div>

              {/* Education & Certs Card */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0b2f58]">BS Information Technology (BS IT)</p>
                    <p className="text-[11px] text-slate-500">Government College University (GCU) Faisalabad</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                  <Award className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0b2f58]">Certified Agentic &amp; Robotic AI Engineer</p>
                    <p className="text-[11px] text-slate-500">Air University Islamabad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-sky-600 uppercase mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Leadership &amp; Technical Direction
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0b2f58] tracking-tight">
                  Ghulam Ghaus
                </h2>

                <p className="text-xs sm:text-sm font-bold text-sky-700 mt-1">
                  Software Engineer | Backend-Focused Full-Stack &amp; AI Integrations | Node.js, TypeScript, Python, React/Next.js
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Software Engineer with <strong className="text-[#0b2f58]">4+ years of professional experience</strong> building
                  production backend, full-stack, SaaS, real-time, and AI-integrated applications using Node.js, TypeScript,
                  Python, React/Next.js, PostgreSQL, and cloud technologies. Strong background in REST APIs, microservices,
                  authentication &amp; authorization, database architecture, and WebSockets.
                </p>

                <p>
                  Specialized in <strong className="text-[#0b2f58]">Voice AI and real-time audio streaming</strong> — integrating
                  Twilio Media Streams with Deepgram STT, OpenAI/Groq/Gemini LLMs, and Deepgram/Cartesia TTS for ultra-low latency
                  conversational agents. Hands-on experience delivering multi-tenant platforms, scalable systems, automated pipelines,
                  and offline-first <strong className="text-[#0b2f58]">Desktop Applications using Electron.js</strong>, React, and local databases.
                </p>

                <p>
                  As Founder and Technical Lead at <strong className="text-[#0b2f58]">GG IT Solutions</strong>, leads full-lifecycle
                  software engineering for global clients across the US, Europe, and the Middle East, while training the next generation
                  of software engineers through real-world production codebases.
                </p>
              </div>

              {/* Career Highlights */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-[#0b2f58] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-500" />
                  Professional Experience
                </p>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-extrabold text-[#0b2f58]">INTAKELY AI</span>
                      <span className="text-[10px] text-sky-600 font-bold">2025 – 2026</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">Voice AI Engineer</p>
                    <p className="text-[10px] text-slate-500 mt-1">Remote, US · Twilio Streams, Deepgram STT/TTS, Real-time Conversational AI</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-extrabold text-[#0b2f58]">SOFTOO</span>
                      <span className="text-[10px] text-sky-600 font-bold">2024 – 2025</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">Software Engineer</p>
                    <p className="text-[10px] text-slate-500 mt-1">Islamabad · Microservices, High-throughput REST APIs &amp; Cloud Systems</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-extrabold text-[#0b2f58]">HIVEWORX</span>
                      <span className="text-[10px] text-sky-600 font-bold">2022 – 2024</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">Node.js Developer</p>
                    <p className="text-[10px] text-slate-500 mt-1">Islamabad · Backend Services, WebSockets, BullMQ, Redis &amp; Event Queues</p>
                  </div>
                </div>
              </div>

              {/* Skills Chips */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-[#0b2f58] uppercase tracking-wider">
                  Core Technologies &amp; Capabilities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Node.js / Express / NestJS',
                    'TypeScript / Python',
                    'React / Next.js',
                    'Electron.js (Desktop Apps)',
                    'Voice AI (Twilio Media Streams)',
                    'Deepgram STT/TTS & Cartesia',
                    'OpenAI / Groq / Gemini LLMs',
                    'Microservices & WebSockets',
                    'PostgreSQL / MySQL / Supabase',
                    'Redis / BullMQ',
                    'AWS (EC2, S3) / Docker / Fly.io',
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-900 font-semibold text-[11px] shadow-2xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links & Direct Contact */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-sky-100">
                <a
                  href="https://linkedin.com/in/ghulam-ghaus-5b4ba9194"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-700 shadow-2xs transition"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://github.com/Ghulam-Ghaus"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 shadow-2xs transition"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://www.upwork.com/freelancers/~018e9f6013ee023bf0"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 shadow-2xs transition"
                  title="Upwork Profile"
                >
                  <UpworkIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://gghaus-portfolio.web.app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-700 shadow-2xs transition"
                  title="Personal Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>

                <a
                  href="https://youtube.com/@ggsoftech"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 shadow-2xs transition"
                  title="GG Softech YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>

                <a
                  href="mailto:ghulamghaus266@gmail.com"
                  className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Ghulam
                </a>

                <a
                  href="https://wa.me/923067956164"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ CONTACT ═══════════════════════════════ */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-10 bg-white border-b border-sky-100">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2f58] mb-3">Contact & Campus</h2>
            <p className="text-sm text-slate-400 mb-6">Enterprise consultations or campus visits — we&apos;re here.</p>
            <div className="p-5 rounded-2xl bg-[#f7fbfe] border border-sky-100 mb-5 space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0b2f58]">Main Campus / Office:</p>
                  <p className="text-slate-700 font-medium">5, Marlah scheme, Khurrianwala, 37630, Faisalabad, Punjab, Pakistan</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Plus Code: G746+28 Khurrianwala, Pakistan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                <span><strong>WhatsApp / Phone:</strong> +92 306 7956164</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span><strong>Email:</strong> ghulamghaus266@gmail.com</span>
              </div>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-[#f7fbfe] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#0b2f58]">Ghulam Ghaus IT Solutions</p>
                <p className="text-[11px] text-slate-500">5, Marlah scheme, Khurrianwala · 5.0 ★ (Opens 10 AM)</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Ghulam+Ghaus+IT+Solutions/@31.4915457,73.2321745,13z/data=!4m15!1m8!3m7!1s0x39226e035f67f90d:0xa4d3c7d11054e1be!2sKhurrianwala,+Pakistan!3b1!8m2!3d31.4976697!4d73.2731732!16zL20vMGZyNXg1!3m5!1s0x39226f4625313b13:0x66ed061fc9e1cdbb!8m2!3d31.5050687!4d73.260853!16s%2Fg%2F11zyppjrml"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-sky-200 shadow-2xs hover:bg-sky-50 transition"
              >
                Open in Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8 shadow-md">
            <div className="flex rounded-xl bg-[#f0f7fd] p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setInquiryType('client');
                  setInquiryTopic('Desktop POS & ERP Application (Electron.js)');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${inquiryType === 'client' ? 'bg-white text-[#0b2f58] shadow-sm' : 'text-slate-500 hover:text-sky-700'}`}
              >
                Software Quote
              </button>
              <button
                type="button"
                onClick={() => {
                  setInquiryType('student');
                  setInquiryTopic('6-Month Diploma: Desktop App Engineering (Electron.js)');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${inquiryType === 'student' ? 'bg-white text-[#0b2f58] shadow-sm' : 'text-slate-500 hover:text-sky-700'}`}
              >
                Course Admission
              </button>
            </div>
            {inquirySubmitted ? (
              <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                <Sparkles className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-sky-900">Thank You, {inquiryName}!</h4>
                <p className="text-xs text-sky-700 mt-1">
                  {inquiryType === 'client'
                    ? 'Our engineering team will review your project requirements and reach out within 24 hours.'
                    : 'Our admissions desk led by Ghulam Ghaus will review your application and contact you shortly.'}
                </p>
                <button type="button" onClick={() => setInquirySubmitted(false)} className="mt-3 text-xs text-sky-700 font-bold underline">
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setInquirySubmitted(true); }} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-sky-100 bg-[#f7fbfe] px-3.5 py-2.5 text-xs sm:text-sm focus:border-sky-400 focus:outline-none transition"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={e => setInquiryEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-sky-100 bg-[#f7fbfe] px-3.5 py-2.5 text-xs sm:text-sm focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-xl border border-sky-100 bg-[#f7fbfe] px-3.5 py-2.5 text-xs sm:text-sm focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {inquiryType === 'client' ? 'Project Type / Software Service' : 'Select Course / Academic Program'}
                  </label>
                  <select
                    value={inquiryTopic}
                    onChange={e => setInquiryTopic(e.target.value)}
                    className="w-full rounded-xl border border-sky-100 bg-[#f7fbfe] px-3.5 py-2.5 text-xs sm:text-sm focus:border-sky-400 focus:outline-none transition"
                  >
                    {inquiryType === 'client' ? (
                      <>
                        <option value="Desktop POS & ERP Application (Electron.js)">Desktop POS &amp; ERP Application (Electron.js + React + SQLite)</option>
                        <option value="Full-Stack Web / SaaS Platform">Full-Stack Web / SaaS Platform (Next.js + NestJS)</option>
                        <option value="Mobile App Development">Mobile App Development (React Native / Flutter)</option>
                        <option value="eSports Tournament Platform">eSports Tournament Platform (Like Arenyxa)</option>
                        <option value="Enterprise Microservices & High-Load APIs">Enterprise Microservices &amp; High-Load APIs</option>
                        <option value="Real-Time Voice AI Conversational Agent">Real-Time Voice AI Conversational Agent (Twilio + Deepgram)</option>
                        <option value="Cloud Architecture & DevOps Consulting">Cloud Architecture &amp; DevOps Consulting (AWS / Docker)</option>
                        <option value="Custom Software Development">Custom Enterprise Software Development</option>
                      </>
                    ) : (
                      <>
                        <option value="6-Month Diploma: Desktop App Engineering (Electron.js)">6-Month Diploma: Desktop App Engineering (Electron.js + NestJS)</option>
                        <option value="6-Month Diploma: Full-Stack Web Development">6-Month Diploma: Full-Stack Web Development (Next.js + NestJS)</option>
                        <option value="6-Month Diploma: Mobile App Development">6-Month Diploma: Mobile App Development (React Native &amp; Flutter)</option>
                        <option value="3-Month Track: Generative & Agentic AI">3-Month Track: Generative &amp; Agentic AI (Voice AI + LLMs)</option>
                        <option value="3-Month Track: Backend Engineering & Microservices">3-Month Track: Backend Engineering &amp; Microservices (NestJS + Python)</option>
                        <option value="3-Month Track: Database Engineering & SQL Mastery">3-Month Track: Database Engineering &amp; SQL Mastery (PostgreSQL / MySQL / MongoDB)</option>
                        <option value="3-Month Track: JavaScript & TypeScript Deep Dive">3-Month Track: JavaScript &amp; TypeScript Deep Dive (ES6+)</option>
                        <option value="Bonus Track: Freelancing, Upwork & Remote Jobs Mastery">Bonus Track: Freelancing, Upwork &amp; Remote Jobs Mastery</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {inquiryType === 'client' ? 'Project Scope & Requirements' : 'Educational Background & Career Goals'}
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    placeholder={
                      inquiryType === 'client'
                        ? 'Describe your project requirements, target users, preferred timeline or budget...'
                        : 'Tell us about your education, any previous programming experience, or career goals...'
                    }
                    className="w-full rounded-xl border border-sky-100 bg-[#f7fbfe] px-3.5 py-2.5 text-xs sm:text-sm focus:border-sky-400 focus:outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {inquiryType === 'client' ? 'Request Software Quote' : 'Submit Admission Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
      <footer className="bg-[#071e33] text-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded-lg bg-white p-0.5" />
              <span className="font-extrabold text-sm tracking-wider">GG IT SOLUTIONS</span>
            </div>
            <p className="text-xs text-sky-200/70 leading-relaxed">Desktop apps, cloud SaaS, eSports platforms, microservices, and real-time Voice AI — while training next-gen engineers.</p>
          </div>
          <div className="text-xs text-sky-200/70 space-y-2">
            <p className="font-bold text-white uppercase mb-2 tracking-wider text-[11px]">Services</p>
            <p><a href="#services" className="hover:text-white transition">Desktop POS (Electron.js)</a></p>
            <p><a href="#services" className="hover:text-white transition">Full-Stack SaaS</a></p>
            <p><a href="#services" className="hover:text-white transition">eSports Platforms</a></p>
            <p><a href="#services" className="hover:text-white transition">Microservices</a></p>
            <p><a href="#services" className="hover:text-white transition">Voice AI Pipelines</a></p>
          </div>
          <div className="text-xs text-sky-200/70 space-y-2">
            <p className="font-bold text-white uppercase mb-2 tracking-wider text-[11px]">Academy</p>
            <p><a href="#courses" className="hover:text-white transition">6-Month Desktop Diploma</a></p>
            <p><a href="#courses" className="hover:text-white transition">6-Month Web Diploma</a></p>
            <p><a href="#courses" className="hover:text-white transition">3-Month AI Fast-Track</a></p>
            <p><a href="#success" className="hover:text-white transition">Alumni Hall of Fame</a></p>
          </div>
          <div className="text-xs text-sky-200/70 space-y-2">
            <p className="font-bold text-white uppercase mb-2 tracking-wider text-[11px]">Connect &amp; Visit</p>
            <p>+92 306 7956164</p>
            <p>ghulamghaus266@gmail.com</p>
            <p>5, Marlah scheme, Khurrianwala, 37630, Faisalabad</p>
            <div className="pt-3 flex gap-3 text-white/70">
              <a href="https://linkedin.com/in/ghulam-ghaus-5b4ba9194" target="_blank" rel="noreferrer" className="hover:text-white transition"><LinkedinIcon className="w-4 h-4" /></a>
              <a href="https://github.com/Ghulam-Ghaus" target="_blank" rel="noreferrer" className="hover:text-white transition"><GithubIcon className="w-4 h-4" /></a>
              <a href="https://www.upwork.com/freelancers/~018e9f6013ee023bf0" target="_blank" rel="noreferrer" className="hover:text-white transition"><UpworkIcon className="w-4 h-4" /></a>
              <a href="https://gghaus-portfolio.web.app" target="_blank" rel="noreferrer" className="hover:text-white transition"><Globe className="w-4 h-4" /></a>
              <a href="https://youtube.com/@ggsoftech" target="_blank" rel="noreferrer" className="hover:text-white transition"><YoutubeIcon className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl pt-6 border-t border-sky-900/40 text-center text-[11px] text-sky-300/50">
          &copy; {new Date().getFullYear()} Ghulam Ghaus IT Solutions (GG IT Solutions). All rights reserved. · Khurrianwala, Faisalabad, Pakistan
        </div>
      </footer>

      {/* Voice Assistant Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-sky-100 flex flex-col items-center">
            <button type="button" onClick={() => setShowVoiceModal(false)} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition">
              <X className="w-5 h-5" />
            </button>
            <VoiceAssistant />
          </div>
        </div>
      )}
    </div>
  );
}
