// Edit this file to update your profile info and project list.
// No component code needs to change when you add or edit a project.

export const profile = {
  name: "Kennedy",
  kicker: "Data Analytics",
  headline: "I turn data into decisions.",
  bio: "",
  photo: "/images/headshot.webp",
  heroPhoto: "/images/headshot.webp",
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: "Completed" | "In Progress";
  tools: string[];
  problem: string;
  approach: string;
  outcome: string;
  github?: string;
  liveDemo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "ofm-operations-dashboard",
    title: "OFM Operations Dashboard",
    summary:
      "Operational reporting workflow for KPI tracking and decision support.",
    description:
      "A live operations dashboard reading from a Google Sheet, processed with pandas, and visualized in Streamlit.",
    category: "Operations Analytics",
    status: "Completed",
    tools: ["Python", "pandas", "Streamlit", "Data Cleaning"],
    problem:
      "The operational team needed a simpler way to monitor performance and spot issues without manually reviewing weekly reporting data.",
    approach:
      "I cleaned the source data, structured the KPIs, and built a live dashboard flow that translated messy operational data into clear decision-ready visuals.",
    outcome:
      "The final workflow made reporting easier to interpret and gave stakeholders a faster way to identify trends and take action.",
    github: "https://github.com/Kennedy-og/ofm-operations-dashboard",
  },
  {
    slug: "supermarket-operations-dashboard",
    title: "Supermarket Operations Dashboard",
    summary:
      "Store performance dashboard with operational trend tracking.",
    description:
      "A retail analytics case study focused on store performance, customer traffic, and operational trend analysis.",
    category: "Retail Performance",
    status: "Completed",
    tools: ["Excel", "SQL", "Dashboarding", "Reporting"],
    problem:
      "Store-level performance data was difficult to compare across time periods, and patterns were not obvious without a consistent view of the business.",
    approach:
      "I consolidated the data, reviewed performance indicators across stores, and organized the analysis around operational decision-making rather than raw numbers alone.",
    outcome:
      "The dashboard created a clearer view of performance drivers and supported more confident operational review and reporting.",
  },
  {
    slug: "uae-ecommerce-analysis",
    title: "UAE Ecommerce Analysis",
    summary:
      "Customer and product analysis covering behavior, engagement, and performance.",
    description:
      "A consumer behavior analysis exploring engagement, product performance, and customer trends within a digital commerce context.",
    category: "Consumer Behavior",
    status: "Completed",
    tools: ["Python", "Visualization", "Exploration", "Insights"],
    problem:
      "The business needed to understand which customer and product behaviors were most meaningful before making recommendations or planning next steps.",
    approach:
      "I explored the data by segment, product, and pattern to find where demand and engagement were strongest and where the story was less clear.",
    outcome:
      "The analysis surfaced the most actionable customer and product trends and gave the business a clearer frame for future decisions.",
  },
];