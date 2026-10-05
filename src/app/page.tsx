import Link from "next/link";
import Hero from "./components/Hero";
import Reveal from "./components/Reveal";
import CapabilityRows from "./components/CapabilityRows";
import ProjectVisual from "./components/ProjectVisual";
import { readPortfolioData } from "@/lib/portfolio-store";

function SocialIcon({ label }: { label: string }) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (label) {
    case "X":
      return (
        <svg {...sharedProps}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...sharedProps} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 4.5c-15.3 0-27.8 12.2-27.8 27.2 0 5.1 1.4 9.9 4 14.1L5.5 58.9l13.6-3.8c4 2.2 8.6 3.4 13.4 3.4 15.3 0 27.8-12.2 27.8-27.2S47.3 4.5 32 4.5Zm0 45.7c-4.1 0-8.1-1.1-11.6-3.2l-.8-.5-8.1 2.3 2.2-7.9-.5-.8A22.4 22.4 0 0 1 9.5 32c0-12.4 10.1-22.5 22.5-22.5S54.5 19.6 54.5 32 44.4 50.2 32 50.2Zm12.4-16.9c-.7-.4-4.1-2-4.7-2.2-.7-.2-1.1-.3-1.5.3-.4.6-1.5 2.2-1.9 2.7-.4.4-.8.5-1.5.2-.7-.4-3-1.1-5.7-3.5-2.1-1.9-3.5-4.2-3.9-4.9-.4-.7-.1-.9.3-1.4.3-.3.6-.7.9-1.1.3-.4.4-.7.7-1.2.2-.4.1-.8-.1-1.1-.2-.3-1.5-3.6-2.1-5.1-.5-1.3-1.1-1.1-1.5-1.1-.4 0-.8-.1-1.2-.1-.4 0-1.1.1-1.6.8-.5.7-2 2-2 4.9s2 5.7 2.3 6.1c.2.4 4 6.1 9.7 8.5 6.8 2.7 6.8 1.8 8 1.7 1.2-.1 4.1-1.7 4.7-3.3.6-1.6.6-2.9.4-3.2-.2-.4-.6-.6-1.2-.9Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "GitHub":
      return (
        <svg {...sharedProps}>
          <path d="M9 18.5c-4 1.2-4-2-5-2.4M15 20v-3.2A3.4 3.4 0 0 0 14 12.8c2.3-.3 4.5-1.4 4.5-5.1A4.1 4.1 0 0 0 18.3 5a3.8 3.8 0 0 0-.1-2.5S17.1 2 14.7 3.2a12.7 12.7 0 0 0-6.7 0C6.2 2 5.4 2.5 5.4 2.5A3.8 3.8 0 0 0 5.3 5 4.1 4.1 0 0 0 4.5 7.7c0 3.7 2.2 4.8 4.5 5.1a3.4 3.4 0 0 0-1.2 2.7V20" />
        </svg>
      );
    default:
      return null;
  }
}

export default async function Home() {
  const data = await readPortfolioData();
  const projects = data.projects.filter((project) => project.published);
  const experience = data.experience;
  const socialLinks = data.socialLinks.filter((link) =>
    ["X", "WhatsApp"].includes(link.label) && Boolean(link.url)
  );

  return (
    <main className="editorial-page">
      <header className="editorial-nav-wrap">
        <nav className="editorial-nav" aria-label="Main navigation">
          <Link href="/" className="brand-mark">KENNEDY ANALYTICS</Link>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </div>
          <a href="#contact" className="nav-contact">Let&apos;s talk ↗</a>
        </nav>
      </header>

      <div className="editorial-container">
        <Hero profile={data.profile} settings={data.siteSettings} />

        <section id="work" className="editorial-section work-section" aria-labelledby="work-heading">
          <Reveal>
            <div className="section-intro section-intro-split">
              <div>
                <p className="eyebrow">01 / Selected work</p>
                <h2 id="work-heading" className="display-heading">Work that turns<br />data into direction.</h2>
              </div>
              <p className="section-lead">
                {data.siteSettings.tagline}
              </p>
            </div>
          </Reveal>

          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 70}>
                <article className="project-entry">
                  <div className="project-meta-row">
                    <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                    <span>{project.date}</span>
                  </div>
                  <div className="project-heading-row">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                    </div>
                    <Link className="project-link" href={`/projects/${project.id}`} aria-label={`View case study for ${project.title}`}>
                      <span>View case study</span><span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <ProjectVisual project={project} />
                  <div className="project-tools">
                    <span>Tools</span>
                    <div>{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="capabilities" className="editorial-section dark-section" aria-labelledby="capabilities-heading">
          <Reveal>
            <div className="section-intro section-intro-split dark-intro">
              <div>
                <p className="eyebrow">02 / What I work with</p>
                <h2 id="capabilities-heading" className="display-heading">Capabilities,<br />kept practical.</h2>
              </div>
              <p className="section-lead">
                Practical capabilities. Tools and skills grouped by the work they support.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <CapabilityRows skills={data.skills} />
          </Reveal>
        </section>

        <section id="experience" className="editorial-section experience-section" aria-labelledby="experience-heading">
          <Reveal>
            <div className="experience-watermark" aria-hidden="true">EXPERIENCE</div>
            <div className="experience-content">
              <div>
                <p className="eyebrow">03 / Experience</p>
                <h2 id="experience-heading" className="display-heading">Experience<br />through practice.</h2>
              </div>
              <div className="experience-list">
                {experience.map((item) => (
                  <article className="experience-entry" key={`${item.role}-${item.company}`}>
                    <div className="experience-dates">
                      <span>{new Date(item.startDate).getFullYear()}</span>
                      <span>→</span>
                      <span>{item.current ? "Present" : new Date(item.endDate).getFullYear()}</span>
                    </div>
                    <div>
                      <h3>{item.role}</h3>
                      <p className="experience-company">{item.company} · {item.location}</p>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="about" className="editorial-section about-section" aria-labelledby="about-heading">
          <Reveal>
            <div className="about-grid">
              <div>
                <p className="eyebrow">04 / About</p>
                <h2 id="about-heading" className="display-heading">A practical approach<br />to analytical work.</h2>
              </div>
              <div className="about-copy">
                <p>{data.profile.headline}</p>
                <p>{data.experience[0]?.description ?? data.siteSettings.tagline}</p>
                <p>{data.education[0]?.description ?? "Focused on practical analytical workflows."}</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <Reveal>
            <p className="eyebrow">05 / Contact</p>
            <h2 id="contact-heading">LET&apos;S TURN<br />DATA INTO DECISIONS.</h2>
            <div className="contact-bottom">
              <p>{data.profile.availability}</p>
              <Link className="contact-button" href="/contact">Let&apos;s talk <span>↗</span></Link>
            </div>
            <div className="contact-links">
              <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="social-link"
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                >
                  <SocialIcon label={link.label} />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
              {data.contact.github ? (
                <a className="social-link" href={data.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <SocialIcon label="GitHub" />
                  <span className="sr-only">GitHub</span>
                </a>
              ) : null}
            </div>
          </Reveal>
        </section>

        <footer className="editorial-footer">
          <span>{data.siteSettings.siteName}</span>
          <span>{data.siteSettings.footerText.replace("2025", String(new Date().getFullYear()))}</span>
        </footer>
      </div>
    </main>
  );
}
