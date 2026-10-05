import Image from "next/image";
import Link from "next/link";
import type { PortfolioData } from "@/lib/portfolio-store";

export default function Hero({
  profile,
  settings,
}: {
  profile: PortfolioData["profile"];
  settings: PortfolioData["siteSettings"];
}) {
  const backgroundImage = profile.heroPhoto || profile.photo;
  const profileImage = profile.photo || profile.heroPhoto;

  return (
    <section
      className="editorial-hero"
      aria-labelledby="hero-title"
      style={{ ["--hero-bg-image" as string]: `url(${backgroundImage})` }}
    >
      <div className="hero-topline">
        <span>{profile.title}</span>
        <span className="hero-location">{profile.location}</span>
      </div>

      <div className="hero-grid">
        <div className="hero-copy-column">
          <h1 id="hero-title" className="hero-heading">
            {profile.headline}
          </h1>
          {profile.bio ? <p className="hero-description">{profile.bio}</p> : null}
          <div className="hero-actions">
            <Link className="editorial-button editorial-button-dark" href={settings.heroPrimaryLink}>
              {settings.heroCtaPrimary}<span>↗</span>
            </Link>
            <Link className="editorial-button editorial-button-quiet" href={settings.heroSecondaryLink}>
              {settings.heroCtaSecondary}<span>↗</span>
            </Link>
          </div>
          <div className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability}
          </div>
        </div>

        <div className="hero-media" aria-label="Kennedy profile image">
          <div className="hero-media-index">01 / 01</div>
          <Image
            src={profileImage}
            alt={profile.name}
            fill
            sizes="(max-width: 900px) 100vw, 44vw"
            className="hero-image"
            priority
          />
          <div className="hero-media-caption">
            <span>{profile.name}</span>
            <span>Data / Decisions</span>
          </div>
        </div>
      </div>

      <div className="hero-bottomline">
        <span>Scroll to explore</span>
        <span className="hero-scroll-line" aria-hidden="true" />
        <span>Selected work ↓</span>
      </div>
    </section>
  );
}
