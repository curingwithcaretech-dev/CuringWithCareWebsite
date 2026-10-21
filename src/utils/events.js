import rawEvents from "../../data/events";
import { regionName, regionSlug } from "./chapters";

// Helpers over data/events.js. Events are listed newest first in the file.

// "[TODO: ...]" notes in data/events.js mark details still to confirm. They stay in the
// data file but never reach the site; a description that is only a note is dropped.
const hideTodo = (text) => (text || "").replace(/\s*\[TODO:[^\]]*\]/g, "").trim();
const events = rawEvents.map((e) => ({ ...e, description: hideTodo(e.description) }));

export const allEvents = () => events;

export const latestEvents = (count) => events.slice(0, count);

export const eventsForBranch = (branch) => events.filter((e) => e.branch === branch);

export const eventBySlug = (slug) => events.find((e) => e.slug === slug) || null;

// Branch names that have at least one event, in the order they first appear,
// plus `null` at the end if some events have no branch yet.
export function eventBranches() {
  const names = [];
  let unassigned = false;
  for (const e of events) {
    if (e.branch === null) unassigned = true;
    else if (!names.includes(e.branch)) names.push(e.branch);
  }
  names.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  return { names, unassigned };
}

// Serializable list of branch filters for the Events page: label, slug (for
// ?branch=) and the branch name used in the data.
export function eventFilters() {
  const { names, unassigned } = eventBranches();
  const filters = names.map((name) => ({ name, label: regionName({ region: name }), slug: regionSlug(name) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }));
  if (unassigned) filters.push({ name: null, label: "Across CARE", slug: "all-chapters" });
  return filters;
}

// Lightbox slides for one event.
export const eventSlides = (event) => event.photos.map((p, i) => ({ src: p.src, width: p.width, height: p.height, alt: `${event.title}, photo ${i + 1} of ${event.photos.length}` }));
