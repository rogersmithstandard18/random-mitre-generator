/**
 * Sales Page Copy Constants
 *
 * All marketing copy for the sales landing page.
 * Edit this file to update any text on the sales page.
 */

import { SUPPORT_EMAIL } from '../../shared-constants';

export const salesPageCopy = {
  hero: {
    headline: "Master Cybersecurity Through Translation",
    subheadline:
      "Stop memorizing techniques. Start understanding them. Our flashcard system translates complex cybersecurity concepts into plain language, risk categories, and business impact.",
    benefits: [
      "Plain-language explanations of every technique",
      "Translated for board-level communication",
      "Industry-specific impact examples",
      "Spaced repetition learning system",
    ],
    primaryCTA: "Start Learning Now",
    secondaryCTA: "View Pricing",
  },

  features: {
    headline: "Everything You Need to Master Cybersecurity",
    items: [
      {
        title: "Plain English Translation",
        description:
          "Every technique explained in clear language anyone can understand.",
        icon: "BookOpen",
      },
      {
        title: "Boardroom Pitch",
        description:
          "Translate technical risks into business impact for executives.",
        icon: "TrendingUp",
      },
      {
        title: "Industry Impact",
        description:
          "See how techniques affect finance, healthcare, retail, and more.",
        icon: "Building",
      },
      {
        title: "Smart Filtering",
        description:
          "Filter by difficulty, learning path (Blue/Red/Purple/GRC), and MITRE tactic.",
        icon: "Filter",
      },
      {
        title: "Detection & Mitigation",
        description:
          "Practical detection hints and mitigation strategies for defenders.",
        icon: "Shield",
      },
      {
        title: "Learning Paths",
        description:
          "Structured paths for Blue Team, Red Team, Purple Team, and GRC professionals.",
        icon: "Route",
      },
    
    ],
  },

  demo: {
    headline: "Try It Yourself",
    description:
      "Experience how our smart filtering helps you focus on what matters. Select a learning path and difficulty level, then generate a sample card.",
    cta: "Explore Full Experience",
  },

  testimonials: {
    headline: "Created for Security Professionals",
    items: [
      {
        quote:
          "This tool can help study for security certifications. The plain-language explanations make MITRE ATT&CK actually approachable.",
        author: "This app is for:",
        role: "Security Analyst",
        company: "Tech Startup",
      },
      {
        quote:
          "An technical explanation of risks and boardroom pitches.",
        author: "This app is for:",
        role: "CISO",
        company: "Healthcare Provider",
      },
      {
        quote:
          "The learning paths can help teams focus on what matters. Blue team learns defense, red team learns offense.",
        author: "This app is for:",
        role: "Security Manager",
        company: "Enterprise SaaS Sales",
      },
    ],
  },

  pricing: {
    headline: "Choose Your Learning Path",
    subheadline: "Start free and upgrade when you're ready.",
    tiers: [
      {
        name: "Free",
        price: 0,
        period: "month" as const,
        description: "Get started with real investigations",
        features: [
          "1 weekly Case File investigation",
          "Random technique cards",
          "Plain language explanations",
          "Boardroom translations",
          "Industry impact examples",
        ],
        cta: "Sign Up Free",
        highlighted: false,
      },
      {
        name: "Starter",
        price: 9,
        period: "month" as const,
        description: "Perfect for students and beginners",
        features: [
          "Everything in Free",
          "Basic filtering (difficulty & tactic)",
          "Favorites & history tracking",
          "Detection hints & mitigations",
          "Interactive SOC scenarios",
        ],
        cta: "Start Learning",
        highlighted: false,
      },
      {
        name: "Professional",
        price: 29,
        period: "month" as const,
        description: "For security professionals",
        features: [
          "Everything in Starter",
          "Advanced filtering by learning path",
          "Blue Team / Red Team / Purple Team paths",
          "Scenario filters (Security+, OWASP)",
          "Scenario progress tracking",
          "Case File Games", //todo collaboration feature update
          "Priority support",
        ],
        cta: "Go Professional",
        highlighted: true,
        badge: "Most Popular",
      },
      {
        name: "Team",
        price: null,
        period: "month" as const,
        description: "For teams and organizations",
        features: [
          "Everything in Professional",
          "Team collaboration features",
          "Custom learning paths",
          "API access",
          "Case File Games", //todo collaboration feature update
          "Dedicated support",
        ],
        cta: "Request Quote",
        highlighted: false,
        contactEmail: SUPPORT_EMAIL,
      },
    ],
  },

  faq: {
    headline: "Frequently Asked Questions",
    items: [
     
      {
        question: "Can I use this for certification prep?",
        answer:
          "Yes! Many users study for CISSP, Security+, CEH, and other certifications using our flashcard approach.",
      },
      {
        question: "Do you offer team/enterprise plans?",
        answer:
          "Yes, our Premium tier includes team features. Contact us for custom enterprise pricing.",
      },
      {
        question: "How often is content updated?",
        answer:
          "We update techniques quarterly to reflect MITRE ATT&CK updates and evolving threat landscape.",
      },
      {
        question: "Is there a free tier?",
        answer:
          "Yes! Our Free tier gives you access to random technique cards with full explanations. Upgrade anytime to unlock filtering and more features.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards and PayPal. Enterprise customers can pay via invoice with escrow or contract.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
      },
  
    ],
  },

  footer: {
    ctaHeadline: "Ready to Master Cybersecurity?",
    ctaSubheadline:
      "Join thousands of security professionals learning the smart way.",
    ctaButton: "Get Started Free",
    links: {
      product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Demo", href: "/demo" },
      ],
      resources: [
        { label: "MITRE ATT&CK", href: "https://attack.mitre.org/", external: true },
        { label: "Blog", href: "#" },
        { label: "Documentation", href: "#" },
      ],
      company: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "#" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    copyright: "© 2026 Cybersecurity Translator. All rights reserved.",
    disclaimer: "Not affiliated with MITRE Corporation.",
  },
};

// Type exports for use in components
export type SalesPageCopy = typeof salesPageCopy;
export type PricingTier = (typeof salesPageCopy.pricing.tiers)[number];
export type Testimonial = (typeof salesPageCopy.testimonials.items)[number];
export type Feature = (typeof salesPageCopy.features.items)[number];
export type FAQItem = (typeof salesPageCopy.faq.items)[number];
