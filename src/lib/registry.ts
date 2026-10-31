export const CATEGORIES = [
  { id: "bento", label: "Bento grids" },
  { id: "animated", label: "Animated stills" },
  { id: "cards", label: "Cards" },
  { id: "hero", label: "Hero sections" },
  { id: "micro", label: "Micro-interactions" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type ShowcaseMeta = {
  slug: string;
  title: string;
  category: CategoryId;
  summary: string;
  notes: string[];
  /** Design size in CSS pixels; previews scale this box to fit. */
  width: number;
  height: number;
  /** Reflows with its container instead of scaling on the detail page. */
  fluid?: boolean;
  interactive?: boolean;
  animated?: boolean;
};

export const SHOWCASES: ShowcaseMeta[] = [
  {
    slug: "launch-bento",
    title: "Launch bento",
    category: "bento",
    summary:
      "A hero-and-strip feature grid: one live deploy row leads, a stat, a control, a statement and a crowd support it.",
    notes: [
      "Only two of five tiles show UI; the rest are a number, a sentence and a collection.",
      "The deploy row is the one motion, and it plays once as the grid scrolls in.",
      "Copy sits outside each picture at page size, never inside the UI.",
    ],
    width: 1040,
    height: 650,
    fluid: true,
    animated: true,
  },
  {
    slug: "edge-ruled-bento",
    title: "Ruled edge bento",
    category: "bento",
    summary:
      "A dark, ruled developer grid: a terminal that streams a deploy, a latency stat, a region map and keycaps.",
    notes: [
      "One container, hairline rules, no gaps: the ruled family from the bento recipes.",
      "Depth comes from surface steps on black, with a single lit green for status.",
      "Monospace only where it is code; labels stay in the sans.",
    ],
    width: 1040,
    height: 650,
    fluid: true,
    animated: true,
  },
  {
    slug: "profile-bento",
    title: "Profile bento",
    category: "bento",
    summary:
      "A personal bento for Oliver Sim: an intro tile, a contribution rhythm, what is shipping now and the stack.",
    notes: [
      "The intro tile is the hero; the heatmap is a diagram, not a screenshot.",
      "Neighbors alternate kinds: words beside a picture, a status beside a collection.",
      "The heatmap fills in once, column by column, then holds still.",
    ],
    width: 1040,
    height: 650,
    fluid: true,
    animated: true,
  },
  {
    slug: "ai-answer",
    title: "AI answer",
    category: "animated",
    summary:
      "A question is sent, the assistant thinks, the answer streams in with its own height, and sources land last.",
    notes: [
      "No sparkles and no purple: the feature is shown by what it does.",
      "The thread grows smoothly, carrying the composer instead of jumping.",
      "Under reduced motion the finished answer is the still.",
    ],
    width: 800,
    height: 500,
    animated: true,
  },
  {
    slug: "payout-flow",
    title: "Instant payout",
    category: "animated",
    summary:
      "A cursorless system story: the balance counts up, payouts stagger in, an instant payout sends and its row settles.",
    notes: [
      "Overlapping arrivals on one soft curve; the payoff holds before the reset.",
      "The row that caused the payout changes from Pending to Paid, closing the loop.",
      "Amounts use tabular figures so digits never wobble while they roll.",
    ],
    width: 800,
    height: 500,
    animated: true,
  },
  {
    slug: "board-drag",
    title: "Board drag",
    category: "animated",
    summary:
      "A cursor picks up a task card, carries it across the board with a slight tilt and drops it into Done.",
    notes: [
      "The card is held, not slid: scale, deeper shadow and a degree of tilt.",
      "The destination opens a slot while the card is in flight.",
      "The column count rolls a beat after the drop.",
    ],
    width: 800,
    height: 500,
    animated: true,
  },
  {
    slug: "command-menu",
    title: "Command menu",
    category: "animated",
    summary:
      "Keycaps press, a command palette opens, a query filters the list and a toast confirms the result.",
    notes: [
      "Keyboard stories show their keys; no cursor is needed.",
      "The palette is pinned by its top edge, so filtering never makes it jump.",
      "The selection highlight travels between rows instead of blinking.",
    ],
    width: 800,
    height: 500,
    animated: true,
  },
  {
    slug: "pricing-card",
    title: "Pricing card",
    category: "cards",
    summary:
      "A plan card with a sliding monthly and yearly switch; the price rolls only the digits that change.",
    notes: [
      "The currency sign hangs outside the centered digits.",
      "The savings badge opens its own space instead of shifting the price.",
      "Fully keyboard accessible with a real radio group.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "profile-card",
    title: "Profile card",
    category: "cards",
    summary:
      "Oliver Sim's profile card with a pinned project and a Follow button that settles into Following.",
    notes: [
      "The button keeps one footprint across both states.",
      "The check draws in; the label crossfades in the same slot.",
      "Links out to github.com/olishiz.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "holo-pass",
    title: "Holo pass",
    category: "cards",
    summary:
      "A membership pass that tilts toward the pointer with a moving sheen, and lies flat for reduced motion.",
    notes: [
      "Tilt is capped at a few degrees so text never smears.",
      "The sheen follows the pointer with a soft spring, not one-to-one.",
      "Keyboard focus gives the same lift as hover.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "split-hero",
    title: "Split hero",
    category: "hero",
    summary:
      "Headline and actions beside a product window bleeding off the corner, with a live search that resolves.",
    notes: [
      "Corner-bleed layout: the window is inset top and left, cropped right and bottom.",
      "Only filler is cropped; the action and its result stay whole.",
      "Reflows to a stacked composition on narrow screens.",
    ],
    width: 1040,
    height: 650,
    fluid: true,
    animated: true,
  },
  {
    slug: "status-hero",
    title: "Status hero",
    category: "hero",
    summary:
      "A dark, centered hero where a status pill changes on its own from Building to Live above a log fading at its foot.",
    notes: [
      "One lit color on black; depth from lighter surfaces, not shadows.",
      "The pill morphs its width with the label instead of swapping.",
      "The window fades out at the foot with a mask, over filler only.",
    ],
    width: 1040,
    height: 650,
    fluid: true,
    animated: true,
  },
  {
    slug: "copy-command",
    title: "Copy command",
    category: "micro",
    summary:
      "An install command with a copy button whose icon morphs into a check and back.",
    notes: [
      "Feedback starts on press; the confirmation lasts long enough to read.",
      "Announces Copied to screen readers through a live region.",
      "Both icons share one box so nothing shifts.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "like-burst",
    title: "Like burst",
    category: "micro",
    summary:
      "A heart that pops with a ring of particles while the count rolls up a single digit.",
    notes: [
      "Only the icon overshoots; the count and surface settle without bounce.",
      "The number rolls, last digit first, in a fixed slot.",
      "Reduced motion keeps the color change and drops the burst.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "hold-to-confirm",
    title: "Hold to confirm",
    category: "micro",
    summary:
      "A destructive action that fills while held, cancels on release and confirms with a check.",
    notes: [
      "Works with pointer, touch and the keyboard (hold Space or Enter).",
      "Releasing early drains the fill quickly instead of snapping.",
      "The fill is the progress; no separate bar is needed.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
  {
    slug: "sliding-tabs",
    title: "Sliding tabs",
    category: "micro",
    summary:
      "A tab bar whose pill travels to the selected tab while the panel below crossfades with a small rise.",
    notes: [
      "The indicator measures each tab, so labels of any width work.",
      "Arrow keys move between tabs, following the WAI-ARIA tabs pattern.",
      "The panel keeps its height steady while content swaps.",
    ],
    width: 560,
    height: 350,
    interactive: true,
  },
];

export function getShowcase(slug: string) {
  return SHOWCASES.find((s) => s.slug === slug);
}

export function categoryLabel(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
