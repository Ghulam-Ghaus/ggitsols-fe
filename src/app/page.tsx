'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Award,
  Code,
  BookOpen,
  Sparkles,
  Users,
  Server,
  Brain,
  ArrowRight,
  Monitor,
  Smartphone
} from 'lucide-react';

export default function LandingPage() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.jpg"
            alt="GG IT Solutions Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain bg-white p-0.5 shadow-md shadow-blue-500/10"
          />
          <span className="font-bold tracking-wide text-sm md:text-base">GG IT SOLUTIONS</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-white transition-colors">CEO Profile</a>
          <a href="#co-founder" className="hover:text-white transition-colors">Co-Founder</a>
          <a href="#team" className="hover:text-white transition-colors">Team</a>
          <a href="#courses" className="hover:text-white transition-colors">Courses</a>
        </nav>
        <div>
          {token ? (
            <Link
              href="/profile"
              className="flex items-center text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl px-5 py-2.5 transition-all"
            >
              Go to Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl px-5 py-2.5 transition-all shadow-md shadow-blue-500/10"
            >
              Portal Login
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section with Flyer Full Background */}
      <section id="hero" className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Full Background Flyer Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/flyer.jpg"
            alt="GG IT Solutions Flyer background"
            fill
            priority
            className="object-cover opacity-15 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/95 to-slate-950"></div>
        </div>

        {/* Floating Glowing Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Build Skills • Build Future</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Learn Today</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Lead Tomorrow
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
            Empowering students with practical knowledge, hands-on experience, and personalized mentorship in modern technologies to build successful careers in IT.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 transition-all text-sm md:text-base group"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 rounded-xl px-8 py-3.5 text-sm md:text-base transition-all font-medium"
            >
              Meet the Founder
            </a>
          </div>
        </div>
      </section>

      {/* Main Founder Feature Card (Full Screen Grid: Image Left, Details Right) */}
      <section id="about" className="py-20 px-6 bg-slate-950 relative">
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400">Leadership Spotlight</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">About the CEO</p>
          </div>

          {/* Full Screen Card: Left Image, Right details */}
          <div className="w-full [perspective:1200px]">
            <div
              className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl 
                         [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(10px)] 
                         hover:border-blue-500/30 hover:shadow-blue-500/5 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]"
            >
              {/* Left Side: Founder Image */}
              <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full bg-slate-950">
                <Image
                  src="/founder.png"
                  alt="Ghulam Ghaus - Founder of GG IT Solutions"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/10 lg:to-slate-950/40"></div>
              </div>

              {/* Right Side: Professional Details */}
              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400 uppercase tracking-wide">
                    Co-Founder & CEO
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    Agentic AI Engineer
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Ghulam Ghaus</h3>
                <p className="text-slate-400 text-base md:text-lg font-medium mb-6 border-b border-white/5 pb-4">
                  Backend Engineer (Python & Node.js) | AI Agentic Systems | Cloud & Microservices
                </p>

                {/* Professional Bio */}
                <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-6">
                  Ghulam Ghaus is an accomplished technologist and educator with over 5 years of professional experience building enterprise-grade, high-performance backends and real-time AI agents. Having designed scalable serverless systems, STT/TTS voice pipelines, and multi-tenant platforms, he founded **GG IT Solutions** to bridge the gap between academic education and modern industry standards.
                </p>

                {/* Grid of details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="truncate">ghulamghaus266@gmail.com </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Phone className="w-5 h-5 text-purple-400 shrink-0" />
                    <span>+92 306 7956164 / +92 302 0655044</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <MapPin className="w-5 h-5 text-pink-400 shrink-0" />
                    <span>Khurrianwala, Faisalabad</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>BS IT & Certified AI Engineer</span>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Core Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Node.js', 'NestJS', 'FastAPI', 'AI Agentic Pipelines', 'STT/TTS', 'PostgreSQL', 'AWS Cloud'].map((tech) => (
                      <span key={tech} className="bg-white/5 border border-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  <a
                    href="https://www.linkedin.com/in/ghulam-ghaus-5b4ba9194"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-3 transition-all hover:scale-105"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="https://ghaus-portfolio.firebaseapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl transition-all hover:scale-105 text-sm font-medium border border-white/5"
                  >
                    View Portfolio
                    <ExternalLink className="w-4 h-4 ml-2 inline" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Co-Founder Feature Card (Full Screen Grid: Image Left, Details Right) */}
      <section id="co-founder" className="py-20 px-6 bg-slate-900/10 border-t border-white/5 relative">
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Leadership Spotlight</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">About the Co-Founder</p>
          </div>

          {/* Full Screen Card: Left Image, Right details */}
          <div className="w-full [perspective:1200px]">
            <div
              className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl 
                         [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(10px)] 
                         hover:border-purple-500/30 hover:shadow-purple-500/5 grid grid-cols-1 lg:grid-cols-12 min-h-[550px]"
            >
              {/* Left Side: Co-Founder Image */}
              <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full bg-slate-950">
                <Image
                  src="/saqib.jpg"
                  alt="Saqib Javed - Co-Founder & COO of GG IT Solutions"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/10 lg:to-slate-950/40"></div>
              </div>

              {/* Right Side: Professional Details */}
              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    Co-Founder & COO
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400 uppercase tracking-wide">
                    Academic Planning
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Saqib Javed</h3>
                <p className="text-slate-400 text-base md:text-lg font-medium mb-6 border-b border-white/5 pb-4">
                  Operations & Infrastructure Management | Curriculum Alignment | Student Placement
                </p>

                {/* Professional Bio */}
                <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-6">
                  Saqib Javed is the driving operational force behind **GG IT Solutions**. As Co-Founder & COO, he oversees all administrative workflows, curriculum structuring, and student success initiatives. Dedicated to fostering industry alliances, he ensures that the institute's educational delivery is seamless, state-of-the-art, and aligned with practical career opportunities.
                </p>

                {/* Grid of details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Users className="w-5 h-5 text-purple-400 shrink-0" />
                    <span>Academic & Student Coordination</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Phone className="w-5 h-5 text-purple-400 shrink-0" />
                    <span>+92 302 0655044</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                    <Award className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>Strategic Operations Lead</span>
                  </div>
                </div>

                {/* Core Domains */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Core Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {['Operations Management', 'Academic Integrity', 'Partnerships', 'Student Support', 'Career Counselling'].map((focus) => (
                      <span key={focus} className="bg-white/5 border border-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Team Section */}
      <section id="team" className="py-20 px-6 bg-slate-950 border-t border-white/5 relative">
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400">Team Structure</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">Engineering & Instruction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
            {/* CEO Card: Ghulam Ghaus */}
            <div
              className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl 
                         [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(10px)] 
                         hover:border-blue-500/30 hover:shadow-blue-500/5 flex flex-col gap-6"
            >
              {/* Profile Image & Role Header */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/30 shrink-0 shadow-lg bg-slate-950">
                  <Image
                    src="/founder.png"
                    alt="Ghulam Ghaus - Co-Founder & CEO"
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">Ghulam Ghaus</h3>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-1">Founder & CEO</p>
                </div>
              </div>

              {/* Bio details */}
              <p className="text-slate-300 text-sm leading-relaxed min-h-[80px]">
                Specializes in enterprise-grade backends, real-time AI agents, STT/TTS voice pipelines, and scalable cloud architectures. Leads overall academic and development vision.
              </p>

              {/* Badges */}
              <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2 mt-auto">
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Python/Node.js</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">AI Agentic Tech</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Cloud/NestJS</span>
              </div>
            </div>

            {/* COO Card: Saqib Javed */}
            <div
              className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl 
                         [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(10px)] 
                         hover:border-purple-500/30 hover:shadow-purple-500/5 flex flex-col gap-6"
            >
              {/* Profile Image & Role Header */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/30 shrink-0 shadow-lg bg-slate-950">
                  <Image
                    src="/saqib.jpg"
                    alt="Saqib Javed - Co-Founder & COO"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">Saqib Javed</h3>
                  <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mt-1">Co-Founder & COO</p>
                </div>
              </div>

              {/* Bio details */}
              <p className="text-slate-300 text-sm leading-relaxed min-h-[80px]">
                Directs administrative workflows, coordinates academic alignment, manages industry partnerships, and steers operational infrastructure and student success career programs.
              </p>

              {/* Badges */}
              <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2 mt-auto">
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Operations Lead</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Academic Quality</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Partnerships</span>
              </div>
            </div>

            {/* Software Engineer Card: Ali Raza */}
            <div
              className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl 
                         [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(10px)] 
                         hover:border-blue-500/30 hover:shadow-blue-500/5 flex flex-col gap-6"
            >
              {/* Profile Image & Role Header */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/30 shrink-0 shadow-lg bg-slate-950">
                  <img
                    src="/ali.jpg"
                    alt="Ali Raza - Software Engineer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">Ali Raza</h3>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-1">Software Engineer</p>
                </div>
              </div>

              {/* Bio details */}
              <p className="text-slate-300 text-sm leading-relaxed min-h-[80px]">
                Specializes in modern client-side architectures, including Web, Mobile Apps, and AI. Built the portal interface and guides students in hands-on workshops, helping them build production-grade applications.
              </p>

              {/* Badges */}
              <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2 mt-auto">
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">React/Next.js</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Web/Mobile Apps</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">AI</span>
                <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded">Mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Offered Section (Directly from Flyer) */}
      <section id="courses" className="py-20 px-6 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl w-full mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400">Academics</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">Courses & Expertise Offered</p>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-lg">
              Explore professional tech courses designed with hand-on experience to help students become job-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Web Development</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Full stack training covering structural layout and presentation layers using HTML, CSS, JavaScript, React, and Node.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-400">HTML, CSS, JS, Node, React</span>
            </div>

            {/* Course 6 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Mobile Development</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Build cross-platform mobile apps for iOS and Android using React Native and Flutter, with device feature integrations and store publishing.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400">React Native, Flutter, iOS, Android</span>
            </div>

            {/* Course 2 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-purple-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Python Programming</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Go from absolute beginner to advanced concepts in Python, focusing on algorithms, object-oriented concepts, and data parsing.
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-400">Beginner to Advanced</span>
            </div>

            {/* Course 3 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-pink-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Generative & Agentic AI</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Advanced models, custom voice pipelines, autonomous agents, contents creation workflow, and automation setups.
                </p>
              </div>
              <span className="text-xs font-semibold text-pink-400">Cutting-edge Tech</span>
            </div>

            {/* Course 4 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 font-bold">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">JavaScript for Interactive Web</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Detailed frontend client interfaces and server-side logic utilizing Node.js, Express, and databases.
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-400">Frontend & Backend</span>
            </div>

            {/* Course 5 */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 hover:border-teal-500/20 hover:bg-slate-900/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Freelancing & Career Guidance</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Learn to bid on platforms like Upwork/Fiverr, build portfolio assets, construct professional CVs, and crack technical interviews.
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-400">Freelancing & Jobs</span>
            </div>


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Image
                src="/logo.jpg"
                alt="GG IT Solutions Logo"
                width={28}
                height={28}
                className="rounded bg-white p-0.5 object-contain"
              />
              <span className="font-bold tracking-wide text-xs">GG IT SOLUTIONS</span>
            </div>
            <p className="text-xs text-slate-500">
              Build Skills. Build Future. Empowering IT professionals of tomorrow.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-xs text-slate-400 space-y-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider mb-2">Contact Us</span>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+92 306 7956164 / 03020655044</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>ghulamghaus266@gmail.com</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 md:text-right">
            &copy; {new Date().getFullYear()} GG IT Solutions. All rights reserved.
            <div className="mt-2 space-x-4">
              <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
