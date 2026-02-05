"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { 
  Activity, 
  BookOpen, 
  Zap, 
  Github, 
  FileText, 
  Terminal, 
  Code2,
  ShieldCheck,
  Globe,
  MessageSquare,
  Search,
  Database
} from "lucide-react";

export default function ModeExplanation() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-50 backdrop-blur-md"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] pointer-events-none">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg z-50 pointer-events-auto"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] h-full md:h-fit md:max-h-[85%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                 <div className={`w-full h-72 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top flex flex-col items-center justify-center relative overflow-hidden ${active.bgColor}`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" 
                         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                    />
                    
                    {/* Main Icon with Glow */}
                    <div className="relative z-10 p-6 rounded-full bg-white shadow-xl mb-4">
                        {active.icon}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-60">
                         {/* We can add small tech icons here randomly if we wanted, but keeping it clean for now */}
                    </div>
                 </div>
              </motion.div>

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start p-6 pb-2">
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-1"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>
                
                <div className="relative px-6 pb-8 pt-4 flex-1 overflow-y-auto">
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-4"
                    >
                        {typeof active.content === "function"
                        ? active.content()
                        : active.content}
                    </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-stretch gap-8 px-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="group relative flex flex-col rounded-2xl bg-white transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-slate-200 overflow-hidden h-full"
          >
            <motion.div layoutId={`image-${card.title}-${id}`} className="w-full">
                 <div className={`h-48 w-full object-cover object-top flex items-center justify-center relative overflow-hidden transition-colors ${card.bgColor} group-hover:bg-slate-900 group-hover:!text-white`}>
                    <div className="absolute inset-0 opacity-[0.05]" 
                         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} 
                    />
                    <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110 p-4 rounded-full bg-white shadow-sm ring-1 ring-slate-100 group-hover:bg-transparent group-hover:ring-white group-hover:text-white">
                        {card.listIcon || card.icon}
                    </div>
                 </div>
            </motion.div>
            
            <div className="flex flex-col flex-grow p-6 text-center relative">
              {card.badge && (
                <div className="absolute top-1 right-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                    {card.badge}
                  </span>
                </div>
              )}
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="font-bold text-lg text-slate-900 mb-2"
              >
                {card.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="text-slate-500 text-sm leading-relaxed"
              >
                {card.description}
              </motion.p>
              
              <div className="mt-auto pt-4 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className={`text-xs font-bold uppercase tracking-wider ${card.textColor}`}>
                      View Details →
                  </span>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    title: "Normal Mode",
    description: "Instant responses for general coding & boilerplate.",
    src: "",
    bgColor: "bg-blue text-blue-600",
    textColor: "text-blue-600",
    icon: <Terminal size={56} strokeWidth={1.5} className="text-blue-600" />,
    listIcon: <Terminal size={48} strokeWidth={1.5} className="text-blue-600" />,
    content: () => {
      return (
        <div className="space-y-4">
            <p className="font-medium text-slate-800">Designed for velocity.</p>
            <p>
                Use this mode for standard coding tasks, debugging simple errors, and generating boilerplate code quickly. It leverages the underlying model&apos;s knowledge without extensive external research.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Code2 size={14} /> Best for:
                </h4>
                <ul className="text-sm space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Generating React components
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Explaining standard syntax
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Quick debugging
                    </li>
                </ul>
            </div>
        </div>
      );
    },
  },
  {
    title: "Research Mode",
    description: "Deep-dive analysis with verified sources.",
    src: "",
    badge: "Recommended",
    bgColor: "bg-emerald text-emerald-600",
    textColor: "text-emerald-600",
    icon: <BookOpen size={56} strokeWidth={1.5} className="text-emerald-600" />,
    listIcon: <BookOpen size={48} strokeWidth={1.5} className="text-emerald-600" />,
    content: () => {
      return (
        <div className="space-y-4">
            <p className="font-medium text-slate-800">Eliminate hallucinations.</p>
            <p>
                When you need deep, verified answers, this mode actively searches active documentation, GitHub repositories, and technical references. It synthesizes information to provide an accurate, cited answer.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                 <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <ShieldCheck size={14} /> Powered by:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                        <Github size={14} /> GitHub Repos
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                        <FileText size={14} /> Official Docs
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                        <Globe size={14} /> Developer Forums
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                        <Code2 size={14} /> Example Code
                    </div>
                </div>
            </div>
        </div>
      );
    },
  },

  {
    title: "On-chain Mode",
    description: "Live blockchain interactions via Helius.",
    src: "",
    bgColor: "bg-rose-0 text-rose-600",
    textColor: "text-rose-600",
    icon: <Database size={56} strokeWidth={1.5} className="text-rose-600" />,
    listIcon: <Database size={48} strokeWidth={1.5} className="text-rose-600" />,
    content: () => {
      return (
         <div className="space-y-4">
            <p className="font-medium text-slate-800">Real-time network intelligence.</p>
            <p>
                Interact directly with the Solana blockchain. Powered by Helius, this
                mode allows you to fetch real-time data, analyze transactions, check
                account states, and debug on-chain programs instantly.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Activity size={14} /> Capabilities:
                </h4>
                <ul className="text-sm space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Decode transactions & logs
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Check account balances & state
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Audit program upgrades
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Analyze network TPS
                    </li>
                </ul>
            </div>
        </div>
      );
    },
  },
];
