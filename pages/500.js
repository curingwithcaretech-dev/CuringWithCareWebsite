import SiteHead from "../src/shared/components/SiteHead";
import Button from "../src/shared/components/Button";
import { Container, Section } from "../src/shared/components/Section";

export default function ServerError() {
  return (
    <>
      <SiteHead title="Something went wrong" description="The Curing with Care site hit an error loading this page." />
      <Section tone="paper" className="min-h-[70vh]">
        <Container size="narrow">
          <p className="text-eyebrow text-care-700">500</p>
          <h1 className="font-display text-display mt-4 font-semibold text-ink">Something went wrong on our end.</h1>
          <p className="text-lead mt-6 text-ink-2">
            The page could not load. Try again in a minute, or head back home. If it keeps happening, let us know.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" icon="arrow-right">
              Go home
            </Button>
            <Button href="/contact" variant="secondary">
              Report the problem
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
