import Link from "next/link";
import Image from "next/image";
import SiteHead from "../../src/shared/components/SiteHead";
import Reveal from "../../src/shared/components/Reveal";
import Icon from "../../src/shared/components/Icon";
import CtaBand from "../../src/shared/components/CtaBand";
import { Container, Section } from "../../src/shared/components/Section";
import { allArticles, formatDate } from "../../src/utils/journalism";
import photos from "../../src/shared/photos";

export async function getStaticProps() {
  // The list only needs the card fields, not each article body.
  const articles = allArticles().map(({ html: _html, ...rest }) => ({ ...rest, dateLabel: formatDate(rest.date) }));
  return { props: { articles } };
}

function Byline({ article }) {
  const parts = [article.author, article.dateLabel].filter(Boolean);
  return parts.length ? <p className="text-sm text-muted">{parts.join(" · ")}</p> : null;
}

export default function Journalism({ articles }) {
  const [lead, ...rest] = articles;
  return (
    <>
      <SiteHead
        title="Journalism"
        path="/journalism"
        description="Stories, interviews and reporting on cancer awareness, research and care, written by Curing with Care's student journalism team."
      />

      <Section tone="paper" size="tight" className="pt-12 md:pt-20">
        <Container>
          <p className="text-eyebrow text-care-700">Journalism</p>
          <h1 className="font-display text-display mt-4 max-w-4xl font-semibold text-ink">Stories from the CARE community.</h1>
          <p className="text-lead mt-6 max-w-2xl text-ink-2">
            Interviews, reporting and personal pieces on cancer awareness, research and care, written by our student journalism team.
          </p>
        </Container>
      </Section>

      <Section tone="paper" className="pt-0 md:pt-0">
        <Container>
          {articles.length === 0 ? (
            <div className="rounded-card bg-white p-8 ring-1 ring-inset ring-line md:p-10">
              <p className="text-eyebrow text-care-700">Coming soon</p>
              <p className="mt-2 text-lg text-ink">The first stories from the journalism team will be posted here.</p>
            </div>
          ) : (
            <>
              <Reveal>
                <Link href={`/journalism/${lead.slug}`} className="group grid overflow-hidden rounded-band bg-white shadow-card md:grid-cols-2">
                  {lead.cover && (
                    <div className="relative aspect-[4/3] bg-care-100 md:aspect-auto md:min-h-80">
                      <Image src={lead.cover} alt={lead.coverAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <p className="text-eyebrow text-care-700">Latest</p>
                    <h2 className="font-display text-h2 mt-3 font-semibold text-ink group-hover:text-care-800">{lead.title}</h2>
                    {lead.summary && <p className="mt-3 text-lg text-ink-2">{lead.summary}</p>}
                    <div className="mt-5">
                      <Byline article={lead} />
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-care-700">
                      Read the story
                      <Icon name="arrow-right" size={18} />
                    </span>
                  </div>
                </Link>
              </Reveal>

              {rest.length > 0 && (
                <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a, i) => (
                    <Reveal as="li" key={a.slug} delay={(i % 3) * 60}>
                      <Link href={`/journalism/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card hover:shadow-card-hover">
                        {a.cover && (
                          <div className="relative aspect-[16/10] bg-care-100">
                            <Image src={a.cover} alt={a.coverAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-5 md:p-6">
                          <h3 className="font-display text-h3 font-semibold text-ink group-hover:text-care-800">{a.title}</h3>
                          {a.summary && <p className="mt-2 text-[0.9375rem] text-ink-2">{a.summary}</p>}
                          <div className="mt-auto pt-4">
                            <Byline article={a} />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              )}
            </>
          )}
        </Container>
      </Section>

      <CtaBand
        photo={photos.letters}
        eyebrow="Write with us"
        title="Have a story about cancer care?"
        text="Patients, families, researchers and students: the journalism team wants to hear from you."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Meet the team", href: "/team" }}
      />
    </>
  );
}
