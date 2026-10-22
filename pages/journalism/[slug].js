import Link from "next/link";
import Image from "next/image";
import SiteHead from "../../src/shared/components/SiteHead";
import Icon from "../../src/shared/components/Icon";
import { Container, Section } from "../../src/shared/components/Section";
import { allArticles, articleBySlug, formatDate } from "../../src/utils/journalism";

export async function getStaticPaths() {
  return { paths: allArticles().map((a) => ({ params: { slug: a.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const article = articleBySlug(params.slug);
  if (!article) return { notFound: true };
  return { props: { article: { ...article, dateLabel: formatDate(article.date) } } };
}

export default function Article({ article }) {
  const byline = [article.author && (article.role ? `${article.author}, ${article.role}` : article.author), article.dateLabel].filter(Boolean);
  return (
    <>
      <SiteHead
        title={article.title}
        path={`/journalism/${article.slug}`}
        description={article.summary || `${article.title}, from the Curing with Care journalism team.`}
        image={article.cover || undefined}
      />

      <Section tone="paper" size="tight" className="pt-10 md:pt-16">
        <Container size="narrow">
          <Link href="/journalism" className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-care-700 hover:underline underline-offset-4">
            <Icon name="arrow-left" size={16} />
            Journalism
          </Link>
          <h1 className="font-display text-h1 mt-4 font-semibold text-ink">{article.title}</h1>
          {article.summary && <p className="text-lead mt-5 text-ink-2">{article.summary}</p>}
          {byline.length > 0 && <p className="mt-6 text-[0.9375rem] text-muted">{byline.join(" · ")}</p>}
        </Container>
      </Section>

      {article.cover && (
        <Container size="default" className="pb-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-band bg-care-100">
            <Image src={article.cover} alt={article.coverAlt} fill priority fetchPriority="high" sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
          </div>
        </Container>
      )}

      <Section tone="paper" size="tight">
        <Container size="narrow">
          {/* Article text comes from Markdown files in the repo, which only the board can change. */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
          <div className="mt-12 border-t border-line pt-6">
            <Link href="/journalism" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-care-700 hover:underline underline-offset-4">
              <Icon name="arrow-left" size={18} />
              More stories
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
