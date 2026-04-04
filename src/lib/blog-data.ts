export interface BlogPostSection {
  heading: string;
  content: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Business" | "Growth" | "Branding" | "Technology";
  readTime: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  tags: string[];
  coverLabel: string;
  sections: BlogPostSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "build-trust-first-digital-presence",
    title: "Build Trust First: The New Rule for Digital Presence in 2026",
    excerpt:
      "Most users decide in under 10 seconds whether your brand is credible. Here is how to structure your profile, proof, and messaging to convert that first glance into meaningful action.",
    category: "Business",
    readTime: "8 min read",
    publishedAt: "2026-03-28",
    author: "DigiSence Editorial Team",
    authorRole: "Growth Strategy",
    tags: ["Digital Presence", "Conversion", "Trust"],
    coverLabel: "Trust & Conversion",
    sections: [
      {
        heading: "Why trust beats traffic",
        content: [
          "Traffic is only valuable when visitors feel safe enough to take action. A simple profile with clear identity, visible social proof, and direct contact options performs better than flashy but vague pages.",
          "Businesses with consistent identity elements across website, profile, and social channels report stronger lead quality because users already understand what they offer before initiating contact."
        ]
      },
      {
        heading: "The 10-second trust checklist",
        content: [
          "Use a clear headline, short value statement, and one primary call-to-action above the fold.",
          "Show real photos, authentic testimonials, and transparent service details to reduce uncertainty.",
          "Display response expectations, business hours, and verified contact channels so users know what happens next."
        ]
      },
      {
        heading: "Operational trust after the click",
        content: [
          "Trust does not stop at visual design. Fast follow-up, clear onboarding steps, and predictable communication are operational trust signals that drive retention.",
          "Teams that align profile promises with real service delivery create a compounding reputation effect over time."
        ]
      }
    ]
  },
  {
    slug: "local-branding-without-big-budget",
    title: "Local Branding Without a Big Budget: A Practical Playbook",
    excerpt:
      "You do not need a massive ad budget to become memorable in your city. Use consistency, local context, and smart partnerships to build a recognizable identity.",
    category: "Branding",
    readTime: "7 min read",
    publishedAt: "2026-03-20",
    author: "Sana Malik",
    authorRole: "Brand Consultant",
    tags: ["Local SEO", "Branding", "Small Business"],
    coverLabel: "Local Brand Playbook",
    sections: [
      {
        heading: "Own one clear promise",
        content: [
          "Strong local brands are clear before they are clever. Define one promise your team can repeat everywhere: profile, catalog, call scripts, and follow-up messages.",
          "When users hear and see the same value proposition repeatedly, brand memory improves and referral accuracy increases."
        ]
      },
      {
        heading: "Design consistency that feels premium",
        content: [
          "Select one color direction, one headline style, and one visual language for product or service imagery.",
          "Consistency gives the impression of scale, even for small teams, and reduces cognitive effort for customers."
        ]
      },
      {
        heading: "Partner for trust transfer",
        content: [
          "Collaborate with already trusted local entities such as community groups, schools, niche creators, or neighboring businesses.",
          "Mutual visibility and co-created campaigns can outperform expensive paid media when targeted to the right audience segments."
        ]
      }
    ]
  },
  {
    slug: "professional-profile-that-wins-clients",
    title: "The Professional Profile Formula That Wins Better Clients",
    excerpt:
      "Professionals often lose premium clients because their profile lacks clarity. This framework helps you position expertise, outcomes, and credibility in one clean flow.",
    category: "Growth",
    readTime: "9 min read",
    publishedAt: "2026-03-15",
    author: "Haris Khan",
    authorRole: "Professional Growth Lead",
    tags: ["Professional Profile", "Client Acquisition", "Positioning"],
    coverLabel: "Profile Framework",
    sections: [
      {
        heading: "Lead with outcomes, not biography",
        content: [
          "Clients buy outcomes. Replace long self-introductions with concise statements of who you help, what problem you solve, and what result they can expect.",
          "This shift alone improves message-to-meeting conversion because prospects quickly self-qualify."
        ]
      },
      {
        heading: "Show process confidence",
        content: [
          "Explain your process in 3 to 5 stages. A visible workflow reduces perceived risk and communicates professionalism.",
          "Include timelines, communication checkpoints, and delivery milestones to make your offer feel tangible."
        ]
      },
      {
        heading: "Proof architecture",
        content: [
          "Use layered proof: testimonials, mini case snapshots, and relevant certifications. One proof type is helpful; three proof types are persuasive.",
          "Keep proof updated quarterly so your profile reflects current capability and market relevance."
        ]
      }
    ]
  },
  {
    slug: "content-system-for-small-teams",
    title: "Create a Content System Small Teams Can Actually Maintain",
    excerpt:
      "Random posting creates random results. Build a sustainable content rhythm with reusable formats, category pillars, and weekly execution windows.",
    category: "Technology",
    readTime: "6 min read",
    publishedAt: "2026-03-09",
    author: "DigiSence Labs",
    authorRole: "Product Education",
    tags: ["Content System", "Workflow", "Marketing Ops"],
    coverLabel: "Content Operations",
    sections: [
      {
        heading: "From inspiration to system",
        content: [
          "A content system starts with pillars: awareness, trust, and conversion. Every post should map to one of these objectives.",
          "When teams assign purpose before creation, performance analysis becomes cleaner and faster."
        ]
      },
      {
        heading: "Reusable post formats",
        content: [
          "Use repeatable formats such as quick wins, myth vs reality, case spotlight, and tool walkthrough.",
          "Reusable structures reduce production fatigue and maintain brand voice consistency."
        ]
      },
      {
        heading: "Weekly execution model",
        content: [
          "Dedicate one slot for planning, one for production, and one for distribution. Even a two-person team can maintain quality with this rhythm.",
          "Review analytics every two weeks to double down on formats that drive inquiries rather than vanity metrics."
        ]
      }
    ]
  },
  {
    slug: "design-signals-that-increase-inquiries",
    title: "Design Signals That Quietly Increase Inquiries",
    excerpt:
      "Subtle layout decisions can drastically change how users behave. Learn the design cues that make your profile easier to trust, scan, and contact.",
    category: "Branding",
    readTime: "5 min read",
    publishedAt: "2026-03-02",
    author: "Areeba Noor",
    authorRole: "UI Specialist",
    tags: ["UI", "Design Psychology", "Lead Capture"],
    coverLabel: "Design Psychology",
    sections: [
      {
        heading: "Scan-friendly structure",
        content: [
          "Users do not read linearly on first visit. They scan headings, badges, proof blocks, and call-to-action labels.",
          "Use short sections, clear contrast, and deliberate whitespace to support this behavior."
        ]
      },
      {
        heading: "Confidence through hierarchy",
        content: [
          "Strong hierarchy means users always know what matters most: value proposition, trust proof, then action.",
          "When hierarchy is weak, users postpone decisions and bounce without contacting."
        ]
      },
      {
        heading: "Action clarity",
        content: [
          "One primary call-to-action per section reduces confusion. Multiple competing buttons often lower total conversions.",
          "Use specific labels such as Start Consultation or Request Pricing instead of generic text like Click Here."
        ]
      }
    ]
  },
  {
    slug: "future-of-digital-directory-experience",
    title: "The Future of Digital Directory Experience: What Users Expect Now",
    excerpt:
      "Directories are evolving from static listings into trust ecosystems. These are the user expectations shaping the next generation of discovery platforms.",
    category: "Business",
    readTime: "10 min read",
    publishedAt: "2026-02-23",
    author: "DigiSence Research",
    authorRole: "Platform Insights",
    tags: ["Directory", "User Experience", "Market Trends"],
    coverLabel: "Future Trends",
    sections: [
      {
        heading: "Expectation 1: verified identity",
        content: [
          "Users increasingly expect verification badges, transparent activity history, and complete profiles before they engage.",
          "Verification acts as a trust filter, especially in competitive categories where options are abundant."
        ]
      },
      {
        heading: "Expectation 2: context-rich discovery",
        content: [
          "Modern users want more than names. They want capabilities, pricing orientation, response time, and social proof in a single view.",
          "The less context switching required, the higher the likelihood of action."
        ]
      },
      {
        heading: "Expectation 3: seamless conversion path",
        content: [
          "Discovery is only half the journey. Platforms must make contacting, comparing, and shortlisting intuitive and frictionless.",
          "The next wave of winners will combine discoverability with operational follow-through tools."
        ]
      }
    ]
  }
];

export const blogCategories = ["All", "Business", "Growth", "Branding", "Technology"] as const;

export const getPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getRelatedPosts = (slug: string, limit = 3) => {
  const currentPost = getPostBySlug(slug);

  if (!currentPost) {
    return blogPosts.slice(0, limit);
  }

  const sameCategory = blogPosts.filter(
    (post) => post.slug !== slug && post.category === currentPost.category
  );

  const fallback = blogPosts.filter(
    (post) => post.slug !== slug && post.category !== currentPost.category
  );

  return [...sameCategory, ...fallback].slice(0, limit);
};
