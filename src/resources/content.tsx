import { About, Gallery, Person, Social, Work } from "@/types";
import { SmartLink, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Eugene",
  lastName: "Lotsu",
  name: "Eugene Lotsu",
  role: "Software Engineer & AI/ML Researcher",
  avatar: "/images/eugene/profile.jpg",
  email: "lotsueugene@gmail.com",
  phone: "+1 (816) 977-5825",
  location: "America/Chicago",
  locationLabel: "Liberty, Missouri",
  languages: ["English"],
  locale: "en",
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/lotsueugene",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/lotsueugene",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "Phone",
    icon: "phone",
    link: "tel:+18169775825",
    essential: true,
  },
];

const about: About = {
  path: "/about",
  label: "About",
  title: "About Eugene Lotsu",
  description:
    "Learn about Eugene Lotsu's research, software engineering experience, education, and technical skills.",
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        <Text as="p" variant="body-default-l">
          I&apos;m a Computer Science student at William Jewell College focused on building rigorous
          AI systems and production software. My current research studies neural approaches to
          partial differential equations, while my engineering work spans agentic AI, marketplace
          infrastructure, payments, geospatial search, and reproducible experimentation.
        </Text>
        <SmartLink
          href="/gallery"
          prefixIcon="gallery"
          suffixIcon="chevronRight"
          style={{
            color: "var(--neutral-on-background-strong)",
            fontWeight: 600,
            textDecoration: "underline",
            textUnderlineOffset: "0.25em",
          }}
        >
          If you&apos;re curious what I look like behind the work, view my gallery
        </SmartLink>
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience & Research",
    experiences: [
      {
        company: "Wallot Research",
        timeframe: "Aug 2026 to Present",
        role: "Undergraduate Research Fellow",
        achievements: [
          <>
            Investigating neural-network approaches for solving partial differential equations,
            including PINNs, Fourier Neural Operators, DeepONet, and variational PINNs.
          </>,
          <>
            Building a Python scientific-computing framework with NumPy and SciPy to benchmark
            learned solutions against numerical methods and evaluate error, convergence, and model
            behavior.
          </>,
          <>
            Conducted and annotated a literature review of 10 research papers while developing a
            reproducible workflow with Jupyter, R/Quarto, and Git toward a formal paper.
          </>,
        ],
        images: [],
      },
      {
        company: "VECINTI",
        timeframe: "Present",
        role: "Software Engineer",
        achievements: [
          <>
            Architected and shipped a production local-services marketplace in Next.js, TypeScript,
            and PostgreSQL with a timezone-aware booking engine spanning six service types,
            concurrent cart holds, resource allocation, and PostGIS search.
          </>,
          <>
            Built an Amazon Bedrock agent with 35 tools, scoped permissions, and human approval for
            state-changing operations, integrated with calendar, email/SMS, 13 cron jobs, and 13
            signed webhooks.
          </>,
          <>
            Implemented Stripe Connect payments, provider payouts, subscriptions, identity
            verification, refunds, disputes, and processing for 21+ webhook events.
          </>,
        ],
        images: [],
      },
      {
        company: "National Student Research Institution",
        timeframe: "Summer 2026",
        role: "AI/ML Researcher, Summer Research Hackathon",
        achievements: [
          <>
            Investigated how real-world image transformations affect CLIP-based AI-generated image
            detectors; the work was recognized among the Top 100 submissions.
          </>,
          <>
            Designed a PyTorch and scikit-learn pipeline that ran 120,000+ image evaluations across
            10 transformations and five severity levels.
          </>,
          <>
            Measured degradation across AUROC, F1, precision, recall, and accuracy under
            compression, resizing, cropping, blur, noise, and screenshot-style transformations.
          </>,
        ],
        images: [],
      },
      {
        company: "Excelerate × Saint Louis University",
        timeframe: "Aug 2025 to Sep 2025",
        role: "Data Analyst Associate Intern & Project Lead",
        achievements: [
          <>
            Cleaned and analyzed six datasets with Python, Pandas, and SQL to identify patterns in
            engagement and opportunity distribution.
          </>,
          <>
            Developed an interactive Looker Studio and Python dashboard surfacing four KPI trends
            and translated the findings into stakeholder recommendations.
          </>,
          <>
            Led a cross-functional team through weekly analytical deliverables, coordinating
            analysis, interpretation, and presentation.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education & Recognition",
    institutions: [
      {
        name: "William Jewell College",
        description: (
          <>
            <strong>B.S. in Computer Science</strong>
            <br />
            Expected graduation: December 2027
            <br />
            <br />
            <strong>Relevant coursework</strong>
            <br />
            Data Structures and Algorithms
            <br />
            Differential Equations, Discrete Mathematics, Calculus I and II
            <br />
            Probability and Statistics
            <br />
            Computer Networks
            <br />
            Database Systems (SQL and NoSQL)
          </>
        ),
      },
      {
        name: "Awards & Involvement",
        description: (
          <>
            Wallot Research Undergraduate Research Fellow, 2026
            <br />
            Top 100, NSRI Summer Research Hackathon, 2026
            <br />
            Semifinalist and Top 1,000, AWS 10,000 AIdeas Competition
            <br />
            Dean&apos;s List for four consecutive semesters
            <br />
            Selected participant, HackMIT 2026
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Programming & Systems",
        description: (
          <>Production software, data pipelines, APIs, relational data, and modern web systems.</>
        ),
        tags: [
          { name: "Python", icon: "python" },
          { name: "TypeScript", icon: "typescript" },
          { name: "JavaScript", icon: "javascript" },
          { name: "SQL", icon: "postgresql" },
          { name: "R" },
        ],
        images: [],
      },
      {
        title: "Machine Learning & Scientific Computing",
        description: (
          <>Model evaluation, numerical experiments, statistical analysis, and neural methods.</>
        ),
        tags: [
          { name: "PyTorch", icon: "pytorch" },
          { name: "scikit-learn" },
          { name: "NumPy" },
          { name: "SciPy" },
          { name: "Pandas" },
          { name: "OpenAI CLIP" },
        ],
        images: [],
      },
      {
        title: "Research",
        description: (
          <>
            Experimental design, reproducible research, literature review, data visualization, and
            quantitative model evaluation.
          </>
        ),
        tags: [
          { name: "Jupyter" },
          { name: "R Markdown / Quarto" },
          { name: "LaTeX" },
          { name: "Git / GitHub", icon: "github" },
        ],
        images: [],
      },
      {
        title: "Platforms & Infrastructure",
        description: (
          <>Cloud services, containers, payments, and production deployment workflows.</>
        ),
        tags: [
          { name: "AWS" },
          { name: "Docker", icon: "docker" },
          { name: "Next.js", icon: "nextjs" },
          { name: "PostgreSQL", icon: "postgresql" },
        ],
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: "Projects - Eugene Lotsu",
  description:
    "Selected AI research, agentic systems, data platforms, and software engineering projects by Eugene Lotsu.",
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery by Eugene Lotsu",
  description: "Selected moments from Eugene Lotsu's work, research, and life.",
  images: [
    {
      src: "/images/eugene/hackmit-2026.jpg",
      alt: "Eugene Lotsu standing beside the HackMIT 2026 banner",
      orientation: "vertical",
    },
    {
      src: "/images/eugene/formal-portrait.jpg",
      alt: "Eugene Lotsu in a black suit",
      orientation: "vertical",
    },
    {
      src: "/images/eugene/mirror-portrait.jpg",
      alt: "Eugene Lotsu taking a mirror portrait",
      orientation: "vertical",
    },
    {
      src: "/images/eugene/structor-demo.jpg",
      alt: "Eugene Lotsu's STRUCTOR project displayed at HackMIT 2026",
      orientation: "vertical",
    },
  ],
};

export { person, social, about, work, gallery };
