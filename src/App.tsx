import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Typewriter Hook ---
const useTypewriter = (text: string, speed = 38, delay = 600) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text]);

  return { displayed, done };
};

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showPills, setShowPills] = useState(false);
  
  // Video Scrubbing Logic
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const isSeeking = useRef(false);
  const prevX = useRef<number | null>(null);

  const handleSeek = useCallback(() => {
    if (!videoRef.current || isSeeking.current) return;
    if (Math.abs(videoRef.current.currentTime - targetTime.current) > 0.01) {
      isSeeking.current = true;
      videoRef.current.currentTime = targetTime.current;
    }
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const v = videoRef.current;
      if (!v || isNaN(v.duration)) return;
      if (prevX.current !== null) {
        const delta = e.clientX - prevX.current;
        const SENSITIVITY = 0.8;
        const offset = (delta / window.innerWidth) * SENSITIVITY * v.duration;
        targetTime.current = Math.max(0, Math.min(v.duration, v.currentTime + offset));
        handleSeek();
      }
      prevX.current = e.clientX;
    };
    window.addEventListener('mousemove', onMove);
    setTimeout(() => setShowPills(true), 400);
    return () => window.removeEventListener('mousemove', onMove);
  }, [handleSeek]);

  const { displayed, done } = useTypewriter("Glad you stopped in. Good taste tends to find us. Now, what are we building?");

  return (
    <div className="relative w-full overflow-x-hidden bg-black text-white">
      
      {/* BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        onSeeked={() => { isSeeking.current = false; handleSeek(); }}
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-50"
        muted playsInline preload="auto"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-6 sm:px-10 py-5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 sm:h-10 w-auto" />
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-2xl tracking-tighter leading-none">ROBOTICS CLUB</span>
            <span className="text-[9px] tracking-[0.3em] text-white/50">IIT GUWAHATI</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[20px]">
          <div className="relative group cursor-pointer">
            <span className="hover:opacity-60 transition-opacity">Resources ▼</span>
            <div className="absolute top-full left-0 hidden group-hover:block pt-4 w-48">
              <div className="bg-black/95 border border-white/10 p-5 flex flex-col gap-4 text-sm uppercase tracking-widest backdrop-blur-xl">
                <a href="#" className="hover:text-blue-400">Course Material</a>
                <a href="#" className="hover:text-blue-400">Past Projects</a>
                <a href="#" className="hover:text-blue-400">Launch Course</a>
              </div>
            </div>
          </div>
          <a href="#projects" className="hover:opacity-60">Projects</a>
          <a href="#team" className="hover:opacity-60">Team</a>
          <a href="#contact" className="underline underline-offset-4 hover:opacity-60">Get in touch</a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden flex flex-col gap-1.5 z-[60]">
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenu ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white ${mobileMenu ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenu ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 h-screen flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-6 sm:px-12">
        <div className="max-w-2xl">
          <div className="mb-6 pointer-events-none select-none text-white blur-[4px] text-lg sm:text-2xl leading-tight">
            Hey there, meet A.R.I.A,<br />
            Robotics Club's Adaptive Response Interface Agent
          </div>

          <p className="text-white text-xl sm:text-3xl leading-relaxed mb-8 min-h-[60px]">
            {displayed}
            {!done && <span className="inline-block w-1 h-[1em] bg-white ml-1 animate-blink" />}
          </p>

          <div className={`flex flex-wrap gap-3 transition-all duration-700 ${showPills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {["View Projects", "Past Achievements", "Meet Team", "Lab Gallery"].map((label) => (
              <button key={label} className="px-5 py-2 bg-white text-black rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* NOTICE BOARD / ANNOUNCEMENTS */}
      <div className="relative z-10 bg-blue-700 py-3 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="flex animate-ticker gap-12 text-xs font-bold uppercase tracking-[0.2em]">
          {[1, 2, 3].map((i) => (
            <span key={i}>
              📢 NOTICE: INTER-IIT TECH MEET REGISTRATIONS ARE NOW OPEN • WORKSHOP ON ROS2 STARTING THIS SUNDAY • NEW COMPONENT ARRIVALS IN THE LAB • 
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS SECTION */}
      <section id="projects" className="relative z-10 py-24 px-6 sm:px-12 bg-black">
        <h2 className="text-6xl sm:text-8xl font-heading opacity-10 mb-16">PROJECTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="group border border-white/10 p-10 hover:border-blue-500 transition-all cursor-pointer bg-zinc-900/40">
              <h3 className="text-2xl font-heading mb-3">ROBOT_UNIT_0{i}</h3>
              <p className="text-white/50 text-sm">Autonomous exploration unit designed for high-stress terrain mapping and data collection.</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="relative z-10 py-24 px-6 sm:px-12 bg-zinc-950">
        <h2 className="text-6xl sm:text-8xl font-heading opacity-10 mb-16 text-right">GALLERY</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-video bg-zinc-900 border border-white/5 grayscale hover:grayscale-0 transition-all flex items-center justify-center text-white/10">
              IMAGE_PLACEHOLDER_{i}
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="relative z-10 py-24 px-6 sm:px-12 bg-black">
        <h2 className="text-6xl sm:text-8xl font-heading opacity-10 mb-16">THE TEAM</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="text-center group">
              <div className="aspect-square bg-zinc-800 mb-4 rounded-sm border border-white/5 group-hover:border-blue-500 transition-colors" />
              <div className="font-heading text-lg">MEMBER NAME</div>
              <div className="text-blue-400 text-[10px] uppercase tracking-widest">Core Member</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-24 px-6 sm:px-12 bg-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl sm:text-6xl font-heading mb-8">CONTACT US.</h2>
            <p className="text-white/60 mb-10 leading-relaxed max-w-md">
              Located at the New Activity Center (NAC), IIT Guwahati. Drop by for a cup of tea and some robotics talk.
            </p>
            <div className="space-y-4 text-sm tracking-tighter">
              <p>robotics@iitg.ac.in</p>
              <p>@robotics_iitg</p>
            </div>
          </div>
          <form className="flex flex-col gap-6">
            <input className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-white transition-all" placeholder="YOUR NAME" />
            <input className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-white transition-all" placeholder="YOUR EMAIL" />
            <button className="bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">Submit</button>
          </form>
        </div>
      </section>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-black z-[55] flex flex-col justify-center items-center gap-8 transition-transform duration-500 ${mobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        {["Home", "Projects", "Gallery", "Team", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="text-4xl font-heading uppercase hover:text-blue-500 transition-colors">{item}</a>
        ))}
      </div>
    </div>
  );
}