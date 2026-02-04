"use client";

import React, { useState, useEffect } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { createClient } from "@supabase/supabase-js";

const navItems = [
  {
    name: "About",
    link: "#about",
  },
  {
    name: "Github",
    link: "#github",
  },
  {
    name: "Documentation",
    link: "#",
  },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePrimaryCTA = () => {
    if (isAuthenticated) {
      window.location.href = "/chat";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <Navbar className="fixed inset-x-0 top-4">
      <NavBody>
        <a
          href="#"
          className="relative z-20 flex items-center space-x-2 px-2 py-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
        </a>
        <div className="relative z-20 ml-auto flex items-center gap-6">
          <NavItems items={navItems} />
          <NavbarButton
            as="button"
            onClick={handlePrimaryCTA}
            className="font-semibold cursor-pointer"
          >
            {isAuthenticated ? "Open App" : "Try Now"}
          </NavbarButton>
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <a
            href="#"
            className="flex items-center"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
          </a>
          <MobileNavToggle
            isOpen={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-2 pt-2">
            <NavbarButton
              as="button"
              onClick={handlePrimaryCTA}
              className="font-semibold"
            >
              {isAuthenticated ? "Open App" : "Try Now"}
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
