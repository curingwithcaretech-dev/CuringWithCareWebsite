import { Component } from "react";
import { Container, Section } from "./Section";
import { site } from "../site";

/**
 * Catches a crash in the browser so one broken page shows a friendly message, with the
 * navbar and footer still working, instead of a blank screen. Resets on route change.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  componentDidUpdate(prev) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) this.setState({ hasError: false });
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <Section tone="paper" className="min-h-[70vh]">
        <Container size="narrow">
          <p className="text-eyebrow text-care-700">Error</p>
          <h1 className="font-display text-display mt-4 font-semibold text-ink">This page hit a problem.</h1>
          <p className="text-lead mt-6 text-ink-2">
            Reload to try again, or use the menu to go somewhere else. If it keeps happening, email{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-care-700 underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-care-700 px-6 font-semibold text-white hover:bg-care-800"
          >
            Reload the page
          </button>
        </Container>
      </Section>
    );
  }
}
