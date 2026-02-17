import React, { useState, useEffect, useRef } from 'react';

// --- 1. Tailwind & Style Injection (The "Alter Method") ---
// Since we removed tailwind.config.js, we inject the config and styles at runtime.

const TailwindInjector = () => {
  useEffect(() => {
    // 1. Inject Tailwind CDN
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    script.async = true;
    
    script.onload = () => {
      // 2. Configure Tailwind after script loads
      window.tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#a3ff00",
              "background-light": "#f5f5f5",
              "background-dark": "#050505",
              "silver-light": "#e0e0e0",
              "silver-dark": "#757575",
            },
            fontFamily: {
              sans: ['Montserrat', 'sans-serif'],
              display: ['Montserrat', 'sans-serif'],
              handwriting: ['Sacramento', 'cursive'],
              body: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
              'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
              'metallic-gradient': "linear-gradient(135deg, #ffffff 0%, #a0a0a0 30%, #e0e0e0 50%, #808080 70%, #ffffff 100%)",
            },
            boxShadow: {
              'glow': '0 0 80px 20px rgba(255, 255, 255, 0.15)',
              'orb-glow': '0 0 120px 40px rgba(255, 255, 255, 0.6)',
              'neon-glow': '0 0 10px rgba(163, 255, 0, 0.3), 0 0 20px rgba(163, 255, 0, 0.1)',
            }
          },
        },
      };
    };
    document.head.appendChild(script);

    // 3. Inject Custom CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;900&family=Sacramento&family=Inter:wght@300;400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

      body { margin: 0; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
      
      .text-metallic {
        background: linear-gradient(to bottom, #ffffff 10%, #9ca3af 50%, #d1d5db 60%, #4b5563 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      .text-silver-gradient {
        background: linear-gradient(135deg, #e2e2e2 0%, #9e9e9e 50%, #f0f0f0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      .bg-noise-texture {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.07'/%3E%3C/svg%3E");
      }
      .skill-item:hover .skill-icon {
        color: #a3ff00;
        text-shadow: 0 0 15px rgba(163, 255, 0, 0.6);
        transform: scale(1.1);
      }
      .card-hover-glow { transition: all 0.4s ease; }
      .card-hover-glow:hover {
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.3);
      }

      /* --- Animation Classes --- */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        will-change: opacity, transform;
      }
      .animate-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      /* Stagger delays */
      .delay-100 { transition-delay: 100ms; }
      .delay-200 { transition-delay: 200ms; }
      .delay-300 { transition-delay: 300ms; }

      /* --- Hero Loader Animation --- */
      @keyframes expand-ring {
        0% { transform: scale(0); opacity: 1; }
        50% { opacity: 0.8; }
        100% { transform: scale(4); opacity: 0; }
      }
      @keyframes pulse-core {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

// --- 2. Custom Hook for Scroll Animations ---
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// --- 3. Components ---

const HeroLoader = ({ onComplete }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 1);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500">
        {/* The blurry gradient center */}
        <div className="relative flex items-center justify-center">
            <div className="absolute w-[50px] h-[50px] bg-primary rounded-full blur-[40px] animate-[expand-ring_2.5s_ease-in-out_forwards]"></div>
            <div className="absolute w-[100px] h-[100px] bg-white rounded-full blur-[60px] animate-[expand-ring_2.5s_ease-in-out_0.2s_forwards]"></div>
            <span className="font-handwriting text-4xl text-white relative z-10 animate-[pulse-core_2s_ease-out_forwards]">Loading...</span>
        </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white opacity-80 animate-on-scroll delay-300">
    <div className="text-sm tracking-widest uppercase font-light">Available for work</div>
    <div className="flex gap-6 text-sm font-light">
      <a className="hover:text-primary transition-colors cursor-pointer" href="#works">Works</a>
      <a className="hover:text-primary transition-colors cursor-pointer" href="#about">About</a>
      <a className="hover:text-primary transition-colors cursor-pointer" href="#contact">Contact</a>
    </div>
  </nav>
);

const Hero = ({ loading }) => {
  // We hide the hero content slightly until loading is done for dramatic effect
  const contentOpacity = loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000';

  return (
    <main className={`relative flex-none flex items-center justify-center overflow-hidden w-full h-screen bg-black`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-60"></div>
      <div className="absolute inset-0 bg-noise-texture pointer-events-none opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center translate-y-[-5%] ${contentOpacity}`}>
        <h2 className="text-white/60 dark:text-white/70 font-light tracking-[0.2em] text-sm md:text-lg mb-2 md:mb-[-1rem] md:self-start md:ml-[10%] uppercase z-20">
          WEB DEVELOPER
        </h2>
        <div className="relative w-full text-center">
          <h1 className="font-display font-black text-[15vw] leading-[0.8] tracking-tighter select-none flex justify-center items-center gap-[0.5vw]">
            <span className="text-metallic drop-shadow-2xl filter contrast-125">Portf</span>
            <div className="relative w-[12vw] h-[12vw] flex justify-center items-center mx-[-1vw]">
              <div className="absolute w-[18vw] h-[18vw] bg-white/20 blur-[60px] rounded-full z-0"></div>
              <div className="w-[10vw] h-[10vw] bg-white rounded-full shadow-orb-glow z-20 relative"></div>
              <div className="absolute bottom-[-4vw] w-[18vw] h-[14vw] z-30 pointer-events-none">
                 <img 
                  alt="Hands holding light" 
                  className="w-full h-full object-cover object-top opacity-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQSFOxYO4s4FZIVw0Nn5xXAIkrxPLAD2oCqIdWfRa7YF_nmsgXLyaVYyqUTyuBWfKoC-PkBOK_pNSV9Tf_ZRH1JIZGK50mzq1jB5KOrNIPY-Z2V7fuliEO9d0UnmDNb7lyCup7HqmyhgmeOIw4Lfqc4vJZPRomleobQ78HGZsC3iMCqTS5-7n09n9QFjowQ5rrXyrP5WIEpRv9rqUrZgeokLmCcbdVjPfNY4A6QwSSZA-3RQPoVBuvJ-wZ_jFfL3lbiz7QeUTwr9c" 
                  style={{
                    WebkitMaskImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/89/Hands_cupped.svg')",
                    maskImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/89/Hands_cupped.svg')",
                    maskMode: "alpha"
                  }}
                />
                <img 
                  alt="Hands holding the glowing orb" 
                  className="w-full h-full object-contain object-bottom mix-blend-lighten opacity-90 brightness-75 contrast-125 sepia-[.5] hue-rotate-180 saturate-50" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDibJZLQKl8GbyALAXBkDDYegXB_6a-1DThyvG-yLlXW8QMU-x-fk6Os5Q7fqk7DkVsz-Pq5vKrXfL7670eEFGkMa9_DNP6JvKEd3w6jbFuG1Gbsre5_anRQpG2WYljjWHJEPt-qXJi2T1q9MGkJiiLDFWKiwFHX0wEOw98zxxBMk0Ifm1kw_abag87_sST2Xc20wWNpAiix9z9DJ9wkpAK-vEkIlkDa8EbNIx1H9ozpGbtjC9XI3pa9BTNBtSldFJpv2mcIczInAc" 
                  style={{
                    transform: "scale(1.5) translateY(-20%)",
                    filter: "drop-shadow(0 -10px 20px rgba(255,255,255,0.3))"
                  }}
                />
              </div>
            </div>
            <span className="text-metallic drop-shadow-2xl filter contrast-125 z-10">lio</span>
          </h1>
          <div className="absolute bottom-[-10%] right-[10%] md:right-[15%] z-40 transform rotate-[-5deg]">
            <span className="font-handwriting text-5xl md:text-7xl lg:text-8xl text-primary drop-shadow-[0_0_10px_rgba(163,255,0,0.5)]">
              Aryan Kumar Singh
            </span>
          </div>
        </div>
      </div>
      
      <div className={`absolute bottom-8 left-0 w-full px-8 flex justify-between items-end text-white/40 text-xs font-mono uppercase ${contentOpacity} delay-500`}>
        <div>
          <p>Scroll to explore</p>
          <div className="h-12 w-[1px] bg-white/20 mt-2 mx-auto animate-pulse"></div>
        </div>
        <div className="hidden md:block">
          <p>© 2026 AKSR</p>
        </div>
      </div>
    </main>
  );
};

const AboutSection = () => (
  <section id="about" className="relative w-full py-24 md:py-32 bg-background-dark z-20 overflow-hidden text-left">
    <div className="absolute inset-0 bg-noise-texture pointer-events-none opacity-20"></div>
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8 animate-on-scroll">
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase text-silver-gradient">
            About
          </h2>
          <div className="space-y-6 font-body text-lg md:text-xl font-light leading-relaxed text-gray-300">
            <p className="animate-on-scroll delay-100">
              I craft digital experiences that blur the line between utility and art. My philosophy is rooted in the belief that design is not just how it looks, but how it feels—the silent narrative that guides a user through a digital space.
            </p>
            <p className="animate-on-scroll delay-200">
              With a background in fine arts and a passion for cinematic storytelling, I approach every project as a director approaches a scene: setting the mood, directing the eye, and creating a lasting emotional impact.
            </p>
            <p className="text-white/60 text-base border-l-2 border-primary pl-4 mt-4 italic animate-on-scroll delay-300">
              "Simplicity is the ultimate sophistication, but emotion is the ultimate connection."
            </p>
          </div>
          <div className="pt-8 animate-on-scroll delay-300">
            <button className="group flex items-center gap-3 text-white uppercase tracking-widest text-sm hover:text-primary transition-colors duration-300">
              <span>Read Full Bio</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform duration-300">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center lg:mt-8">
          <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-white/50 mb-10 border-b border-white/10 pb-4 animate-on-scroll">
            Toolkit
          </h3>
          <div className="grid grid-cols-2 gap-y-12 gap-x-8">
            {[
              { icon: 'photo_camera', name: 'Photoshop', label: 'Photo Manipulation' },
              { icon: 'draw', name: 'Illustrator', label: 'Vector Graphics' },
              { icon: 'design_services', name: 'Figma', label: 'UI/UX Design' },
              { icon: 'movie_filter', name: 'After Effects', label: 'Motion Design' },
              { icon: 'view_in_ar', name: 'Blender', label: '3D Modeling' },
              { icon: 'code', name: 'Webflow', label: 'Development' },
            ].map((skill, index) => (
              <div key={index} className={`skill-item group flex flex-col gap-3 animate-on-scroll delay-${(index % 3) * 100}`}>
                <span className="material-symbols-outlined text-4xl text-white/80 skill-icon transition-all duration-300">{skill.icon}</span>
                <div>
                  <h4 className="text-white font-medium text-lg group-hover:text-primary transition-colors">{skill.name}</h4>
                  <p className="text-white/40 text-xs uppercase tracking-wide">{skill.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg relative overflow-hidden group hover:border-primary/30 transition-colors animate-on-scroll delay-300">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <h4 className="text-white text-sm font-semibold mb-2">Currently Exploring</h4>
            <p className="text-white/60 text-sm font-light">
              Deep diving into Generative AI for concept art and exploring Three.js for immersive 3D web experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section id="works" className="relative w-full bg-black py-32 px-4 sm:px-6 z-20 border-t border-white/5">
    <div className="absolute inset-0 bg-noise-texture pointer-events-none opacity-20"></div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 animate-on-scroll">
        <div>
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">01 / Projects</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-metallic">
            Selected<br />Works
          </h2>
        </div>
        <div className="mt-8 md:mt-0 text-white/60 text-right font-light text-sm max-w-xs">
          <p>A curated selection of visual identities, art direction, and digital experiences crafted with precision.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">
        {/* Project 1 - Nebula Identity */}
        <div className="group relative col-span-1 md:col-span-2 lg:col-span-8 aspect-[16/9] overflow-hidden rounded-sm border border-white/10 bg-zinc-900 card-hover-glow cursor-pointer animate-on-scroll delay-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10"></div>
          <img alt="Abstract 3D Shape" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-60 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyIbIWQrErzT8y2OW6pCghfkabcxxIPLjs0JC-C4j84dEvNOYSE44JDzdynWM8mm3N1MSYMhWsF8gRxQ3PMYgH3Do9VBeIt6U_e2YABPXn4X29jzRNYQYnZagHQso7LmDNjBXz8ViQuUUGWRFPGQzbgfFztOxpIxbE3xopCW3CGM3QEAVISJ8D6rU06qeJrpQGacjhGnJpEGle2PeQhXnw1Kb1cMs_k8ho69lhOTBjI1nLG-ev8Ov-EjGqG-xzGydNPHqYpgKDRX4" />
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-thin text-white mb-2 tracking-wide group-hover:translate-x-2 transition-transform duration-300">NEBULA <span className="font-bold">IDENTITY</span></h3>
                <p className="text-white/50 text-xs tracking-widest uppercase">Branding / 3D Art</p>
              </div>
              <span className="material-symbols-outlined text-white/70 group-hover:text-primary transition-colors duration-300 transform group-hover:rotate-45">arrow_outward</span>
            </div>
          </div>
        </div>

        {/* Project 2 - Void Series */}
        <div className="group relative col-span-1 md:col-span-1 lg:col-span-4 aspect-[4/5] lg:aspect-auto lg:h-full overflow-hidden rounded-sm border border-white/10 bg-zinc-900 card-hover-glow cursor-pointer animate-on-scroll delay-200">
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 z-10"></div>
           <img alt="Dark Minimalist Poster" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-60 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgpJVMJKcl70x_107apeduQd86TVq4M5gPKXq4aWr6UeEHqKfuPmIwsKsKrMKM_Eoyf8x1ANM5a_wnhRHHy-Rnh9UiRYoQ8-7N6seGJkI59xZ69mqlLUgyzdkFtRwvGnplMeFOmGypitGivsbWZJScZKnWG29XA94tyyIYm7pLXUwq8Il_dKyh4w4sAsoh28GFPSo8HTV47C6Dr4pxrrSqmNQikNUQhIkFv00z0fUqQSGrQPf3sYS7vJpiNOG-siem1J-l2AV_FSk" />
           <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
             <div className="flex justify-between items-end">
               <div>
                 <h3 className="text-2xl font-thin text-white mb-2 tracking-wide group-hover:translate-x-2 transition-transform duration-300">VOID <span className="font-bold">SERIES</span></h3>
                 <p className="text-white/50 text-xs tracking-widest uppercase">Poster Design</p>
               </div>
               <span className="material-symbols-outlined text-white/70 group-hover:text-primary transition-colors duration-300 transform group-hover:rotate-45">arrow_outward</span>
             </div>
           </div>
        </div>

        {/* Project 3 - Type Zero */}
        <div className="group relative col-span-1 md:col-span-1 lg:col-span-4 aspect-square overflow-hidden rounded-sm border border-white/10 bg-zinc-900 card-hover-glow cursor-pointer animate-on-scroll delay-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 z-10"></div>
            <img alt="Typographic Layout" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-60 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKRfc_5GVGVZD6bxzQwCBfvqiH5pFTj4rBrUCLYKvtv0JKAn63jYZfNd8Ywr9VU3xt_7tesCR0AxJUQlwxGxoANyWy5oNCGPdMcDLfSH0JUzsa4shtdY24A8xy_qEcND1X0KNOf4CO-a7Mpj4j9Tp_Xx3Wb_HU0MJJFuBINVXiIZXQi3eitUjLqFA8d19KfRd1u3ejK6AQlPUrZAqu0hhpLf-qU1d3y-P1i63bzOdcsYB4cZ3XmQZvgB2ccq4P8JC5v2N8mpKaa8o" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-thin text-white mb-1 tracking-wide group-hover:translate-x-2 transition-transform duration-300">TYPE <span className="font-bold">ZERO</span></h3>
                  <p className="text-white/50 text-xs tracking-widest uppercase">Typography</p>
                </div>
                <span className="material-symbols-outlined text-white/70 group-hover:text-primary transition-colors duration-300 transform group-hover:rotate-45">arrow_outward</span>
              </div>
            </div>
        </div>

        {/* Project 4 - Lumina Pack */}
        <div className="group relative col-span-1 md:col-span-1 lg:col-span-4 aspect-square overflow-hidden rounded-sm border border-white/10 bg-zinc-900 card-hover-glow cursor-pointer animate-on-scroll delay-200">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 z-10"></div>
            <img alt="Neon Packaging" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-60 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeupuJYdK81onR0Xta8vup73LN_ie7iQFGafSqI3ivt2AspZz1xOGJHlyCF6Xv3lcAZ3jw3MQ4lucB_hTKrN8XjdnoOk_2djWykoVauPC8KeE0lySVq5CJwkPF2ewkzx1eGcwbTwTeYIU4k_IS1_wEMO3nuIkkGQLQU7IwQNsDiFZeJdwZhiOYp2YY3xkcRpK9QucOZju52crsVS2CL8BZiCUuqiJH4xURcvAjIIblrsQB6UpHoUKhMJBv25ejpqtoMDC-r4-xwB8" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-thin text-white mb-1 tracking-wide group-hover:translate-x-2 transition-transform duration-300">LUMINA <span className="font-bold">PACK</span></h3>
                  <p className="text-white/50 text-xs tracking-widest uppercase">Packaging</p>
                </div>
                <span className="material-symbols-outlined text-white/70 group-hover:text-primary transition-colors duration-300 transform group-hover:rotate-45">arrow_outward</span>
              </div>
            </div>
        </div>

        {/* Project 5 - Synth UI */}
        <div className="group relative col-span-1 md:col-span-2 lg:col-span-4 aspect-square lg:aspect-auto overflow-hidden rounded-sm border border-white/10 bg-zinc-900 card-hover-glow cursor-pointer animate-on-scroll delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 z-10"></div>
            <img alt="Web Interface" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 opacity-60 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVXvxj2qNnRCNyJLe_6kdO-2is9fLJlXAADF2BZ6o4V0r7YuuGIeiJfN3VX7pIibAwk8Ewo1fcVUz0aGSI5xkxcBerZT0qX6gE2tSpE03OgWbIRfU2he4er8p-hfpWsrxZBuUKYSsbrI-8iTBrGvyCPuPg_qtM-lnMS9J3EUZwNiHYH_qO-wW1hI_1nbLg8RBFMPW4Mad5_Ls1QEVitVCh0-FiogeQerijB02V7hgFmo-1vxDozgwEkpqO4ASYbneCIFQkjk3K6lI" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-thin text-white mb-1 tracking-wide group-hover:translate-x-2 transition-transform duration-300">SYNTH <span className="font-bold">UI</span></h3>
                  <p className="text-white/50 text-xs tracking-widest uppercase">Web Design</p>
                </div>
                <span className="material-symbols-outlined text-white/70 group-hover:text-primary transition-colors duration-300 transform group-hover:rotate-45">arrow_outward</span>
              </div>
            </div>
        </div>
      </div>

      <div className="mt-20 flex justify-center animate-on-scroll">
        <a className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 hover:border-primary/50 text-white text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary/5 rounded-sm" href="#works">
          View All Projects
          <span className="w-8 h-[1px] bg-white group-hover:bg-primary transition-colors duration-300"></span>
        </a>
      </div>
    </div>
  </section>
);

const ExperienceAndContact = () => (
  <section id="contact" className="relative w-full bg-black text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
    <div className="absolute inset-0 bg-noise-texture pointer-events-none opacity-40"></div>
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent z-10"></div>
    <div className="max-w-7xl mx-auto relative z-20">
      
      {/* Experience Section */}
      <div className="mb-32 animate-on-scroll">
        <h3 className="text-metallic text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16 opacity-90">Experience</h3>
        <div className="relative border-l border-white/20 ml-4 md:ml-10 space-y-16">
          
          <div className="relative pl-12 md:pl-16 group animate-on-scroll delay-100">
            <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-primary shadow-[0_0_10px_#a3ff00] transition-transform duration-300 group-hover:scale-150"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h4 className="text-2xl md:text-3xl font-bold text-white group-hover:text-metallic transition-all duration-300">Senior Art Director</h4>
              <span className="text-metallic font-mono text-sm md:text-base tracking-wider mt-1 md:mt-0">2022 — Present</span>
            </div>
            <p className="text-lg md:text-xl text-white/60 mb-2 font-light">Studio Monolith</p>
            <p className="text-white/40 max-w-2xl font-light leading-relaxed">Leading the visual direction for global campaigns, overseeing a team of designers, and creating immersive brand experiences for tech startups.</p>
          </div>

          <div className="relative pl-12 md:pl-16 group animate-on-scroll delay-200">
            <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-white/30 transition-transform duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_#a3ff00] group-hover:scale-150"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h4 className="text-2xl md:text-3xl font-bold text-white group-hover:text-metallic transition-all duration-300">Visual Designer</h4>
              <span className="text-metallic font-mono text-sm md:text-base tracking-wider mt-1 md:mt-0">2019 — 2022</span>
            </div>
            <p className="text-lg md:text-xl text-white/60 mb-2 font-light">Apex Creative</p>
            <p className="text-white/40 max-w-2xl font-light leading-relaxed">Specialized in UI/UX design and motion graphics. Developed visual identity systems for fintech and luxury fashion brands.</p>
          </div>

          <div className="relative pl-12 md:pl-16 group animate-on-scroll delay-300">
            <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-white/30 transition-transform duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_#a3ff00] group-hover:scale-150"></div>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h4 className="text-2xl md:text-3xl font-bold text-white group-hover:text-metallic transition-all duration-300">Junior Graphic Designer</h4>
              <span className="text-metallic font-mono text-sm md:text-base tracking-wider mt-1 md:mt-0">2017 — 2019</span>
            </div>
            <p className="text-lg md:text-xl text-white/60 mb-2 font-light">Neon & Dust</p>
            <p className="text-white/40 max-w-2xl font-light leading-relaxed">Assisted in print and digital media production. Worked on retouching, layout design, and social media assets.</p>
          </div>

        </div>
      </div>

      {/* Connect Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start border-t border-white/10 pt-24 animate-on-scroll">
        <div className="space-y-12">
          <div>
            <h3 className="text-metallic text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 leading-none">Let's<br />Connect</h3>
            <p className="text-white/50 text-lg font-light max-w-md">Currently available for freelance projects and open to full-time opportunities. Drop a line if you'd like to create something unique together.</p>
          </div>
          <div className="flex flex-col space-y-4">
            {['LinkedIn', 'Instagram', 'Behance', 'Dribbble'].map((platform, idx) => (
              <a key={platform} className="text-2xl text-white hover:text-primary transition-colors flex items-center group" href="#contact">
                <span className="mr-4 text-white/30 group-hover:text-primary/50 transition-colors">0{idx + 1}.</span> {platform}
                <span className="material-symbols-outlined ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_outward</span>
              </a>
            ))}
          </div>
        </div>
        
        <form className="space-y-8 w-full animate-on-scroll delay-200">
          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-primary transition-colors">Your Name</label>
            <input className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder-white/10" type="text" placeholder="Enter your name" />
          </div>
          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
            <input className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder-white/10" type="email" placeholder="hello@example.com" />
          </div>
          <div className="group">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-primary transition-colors">Message</label>
            <textarea className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder-white/10 resize-none" rows="4" placeholder="Tell me about your project..."></textarea>
          </div>
          <button type="submit" className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider overflow-hidden hover:text-black transition-colors mt-8">
            <span className="relative z-10 flex items-center gap-2">
              Send Message
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </span>
            <div className="absolute inset-0 bg-primary transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black text-white/30 py-12 px-6 border-t border-white/5 relative z-20">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-handwriting text-4xl text-primary drop-shadow-[0_0_5px_rgba(163,255,0,0.3)] mb-2">Aryan Kumar Singh</span>
        <p className="text-xs uppercase tracking-widest font-mono">Graphic & Digital Designer</p>
      </div>
      <div className="text-xs font-mono uppercase text-center md:text-right">
        <p>© 2024 Aryan Kumar Singh. All rights reserved.</p>
        <p className="mt-2">Designed with Passion & Code.</p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Initialize Custom Hook for Scroll Animations
  useScrollAnimation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <TailwindInjector />
      <HeroLoader onComplete={() => setLoading(false)} />
      
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
        <Navbar />
        <Hero loading={loading} />
        <AboutSection />
        <ProjectsSection />
        <ExperienceAndContact />
        <Footer />

        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}