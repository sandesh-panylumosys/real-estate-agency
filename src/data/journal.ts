import { media } from "./media";
import type { Article } from "./types";

const team = {
  meera: { name: "Meera Shah", role: "Head of Advisory" },
  arjun: { name: "Arjun Rao", role: "Research & Investment" },
  leah: { name: "Leah D'Souza", role: "Design Editor" },
};

export const articles: Article[] = [
  {
    slug: "the-quiet-return-of-the-courtyard-house",
    category: "Architecture",
    title: "The quiet return of the courtyard house",
    excerpt:
      "Why India's most considered new residences are turning inward — towards light wells, shaded verandahs and private gardens.",
    readMinutes: 8,
    date: "Sep 2026",
    isoDate: "2026-09-18",
    author: team.leah,
    image: { src: media.villaNightPool, alt: "Courtyard villa with pool at night" },
    body: [
      {
        type: "p",
        text: "For most of the last two decades, the measure of a luxury home in India was how much of the outside world it could see. Taller towers, wider glass, longer views. The newest generation of residences is asking a different question: not how far you can look, but how well you can live inside.",
      },
      {
        type: "p",
        text: "The answer, increasingly, is the courtyard. An old idea — found in Chettinad mansions, Gujarati havelis and Goan Portuguese houses alike — returning in contemporary form.",
      },
      { type: "h", text: "Light without glare" },
      {
        type: "p",
        text: "A courtyard brings daylight deep into a plan without exposing rooms to harsh western sun. Bedrooms that would otherwise face a street or a neighbour can open onto a planted void instead. Architects describe it as borrowing the sky rather than the view.",
      },
      {
        type: "p",
        text: "The effect inside is noticeably calmer. Light arrives softened by walls and foliage, and moves across floors through the day in a way that large picture windows rarely achieve.",
      },
      {
        type: "quote",
        text: "A courtyard is the one room in the house that belongs to the weather.",
        cite: "Architect, Assagao",
      },
      { type: "h", text: "Air that moves on its own" },
      {
        type: "p",
        text: "Courtyards also work as chimneys. Warm air rises out of the open centre and draws cooler air through shaded rooms at the edges. Combined with deep verandahs and operable screens, many new courtyard homes rely far less on air-conditioning through the shoulder seasons.",
      },
      {
        type: "image",
        image: { src: media.livingBright, alt: "Bright living room opening onto a garden" },
        caption: "Living spaces that open fully to a planted court blur the line between room and garden.",
      },
      { type: "h", text: "Privacy as a luxury" },
      {
        type: "p",
        text: "Perhaps the strongest argument is privacy. In dense neighbourhoods, a courtyard creates an outdoor room that no one else can see into — somewhere children play, dinners stretch late and mornings begin slowly. It is the rarest thing a city home can offer.",
      },
      {
        type: "p",
        text: "When we evaluate a residence, we now ask how it behaves at its centre as much as at its edges. The best new homes we represent are, quite literally, built around that answer.",
      },
    ],
  },
  {
    slug: "western-suburbs-market-insight",
    category: "Market Insights",
    title: "Prime western suburbs: the decade in review",
    excerpt: "Infrastructure, scarcity and a new generation of buyers.",
    readMinutes: 6,
    date: "Sep 2026",
    isoDate: "2026-09-04",
    author: team.arjun,
    image: { src: media.towersUp, alt: "Glass towers seen from street level" },
    body: [
      {
        type: "p",
        text: "Ten years ago, the prime western suburbs of Mumbai were valued mainly for what they already had: the sea, established neighbourhoods and proximity to the airport. Today they are valued just as much for what is arriving.",
      },
      { type: "h", text: "Three forces" },
      {
        type: "list",
        items: [
          "Infrastructure — new coastal roads and metro lines have shortened journeys that once defined where people could live.",
          "Scarcity — land for low-density, sea-facing homes is effectively finite, and redevelopment is slow.",
          "A new buyer — returning professionals and founders who prioritise space, schools and outdoor living over prestige addresses.",
        ],
      },
      {
        type: "p",
        text: "In our own transactions, capital values for prime residences have roughly doubled over the decade, with the steepest gains in the last four years. These are indicative figures drawn from homes we have advised on, not a market index, but the direction is consistent with what we see across the segment.",
      },
      {
        type: "quote",
        text: "Buyers are no longer paying for an address. They are paying for time — shorter commutes, longer evenings.",
      },
      { type: "h", text: "What we are watching" },
      {
        type: "p",
        text: "Supply of genuinely well-designed residences remains thin. We expect the gap between ordinary and exceptional homes to widen further: buildings with good light, ventilation and generous outdoor space are already commanding a clear premium and leasing faster.",
      },
      {
        type: "p",
        text: "As always, these observations are context rather than advice. Every purchase should be judged on its own merits and with independent financial guidance.",
      },
    ],
  },
  {
    slug: "a-neighbourhood-guide-to-bandra",
    category: "Neighbourhood Guides",
    title: "Bandra, slowly: a walking guide",
    excerpt: "Chapels, cafés and the lanes that make it home.",
    readMinutes: 5,
    date: "Aug 2026",
    isoDate: "2026-08-21",
    author: team.meera,
    image: { src: media.cityStreet, alt: "City street lined with buildings" },
    body: [
      {
        type: "p",
        text: "Bandra rewards walking. Its best qualities — old bungalows, hidden chapels, sea air arriving between buildings — are easy to miss from a car. This is the route we take clients on before a viewing.",
      },
      { type: "h", text: "Morning: Mount Mary and the hill" },
      {
        type: "p",
        text: "Begin early at the basilica on the hill, when the steps are quiet and the city below is still waking. Walk down through the lanes of Pali Hill, where a few of the old villas still stand among newer apartment buildings.",
      },
      { type: "h", text: "Midday: the villages" },
      {
        type: "p",
        text: "Ranwar and Chimbai are the original fishing and farming villages around which Bandra grew. Narrow lanes, painted cottages and small shrines make them feel a world away from the main roads a few minutes away.",
      },
      {
        type: "quote",
        text: "Every viewing in Bandra starts with a walk. By the end of it, people usually know which street they want to live on.",
        cite: "Meera Shah",
      },
      { type: "h", text: "Evening: the sea" },
      {
        type: "p",
        text: "End along Carter Road or Bandstand as the light goes. Joggers, families and the evening breeze — it is the hour when the neighbourhood is most itself, and the reason so many of our clients choose to stay.",
      },
      {
        type: "list",
        items: [
          "Best for: families who want community, cafés and the sea within walking distance.",
          "Consider: traffic at peak hours, and the premium for quiet lanes.",
        ],
      },
    ],
  },
  {
    slug: "materials-that-age-well",
    category: "Interior Design",
    title: "Materials that age well",
    excerpt: "Oak, lime, brass and stone — choosing for the next thirty years.",
    readMinutes: 7,
    date: "Aug 2026",
    isoDate: "2026-08-07",
    author: team.leah,
    image: { src: media.readingCorner, alt: "Reading corner with yellow armchair" },
    body: [
      {
        type: "p",
        text: "The materials that look best on handover day are rarely the ones that look best twenty years later. When we assess the interiors of a residence, we look for materials that improve with use rather than merely survive it.",
      },
      { type: "h", text: "Oiled timber" },
      {
        type: "p",
        text: "Solid oak and teak with an oiled — rather than lacquered — finish can be spot-repaired, and develop a warm patina over time. Scratches soften into character instead of breaking through a plastic surface.",
      },
      { type: "h", text: "Lime and natural plaster" },
      {
        type: "p",
        text: "Lime-based finishes breathe in humid climates, resist mould and carry a subtle depth that paint cannot imitate. They also age gracefully: small marks blend rather than stand out.",
      },
      {
        type: "image",
        image: { src: media.diningWood, alt: "Oak dining table and timber joinery" },
        caption: "Wide-plank oak deepens in tone over the years.",
      },
      { type: "h", text: "Unlacquered brass and honed stone" },
      {
        type: "p",
        text: "Living finishes like unlacquered brass darken where hands touch them most, recording the life of a home. Honed marble and travertine hide the etching that polished surfaces show immediately.",
      },
      {
        type: "quote",
        text: "Choose materials you will be glad to see wear in.",
      },
      {
        type: "p",
        text: "A useful rule: if a material can be repaired by a craftsperson rather than replaced, it will probably still look right in thirty years.",
      },
    ],
  },
  {
    slug: "buying-your-first-luxury-residence",
    category: "Buying Guides",
    title: "Buying your first luxury residence",
    excerpt: "Due diligence, title, timing — a clear guide.",
    readMinutes: 10,
    date: "Jul 2026",
    isoDate: "2026-07-16",
    author: team.meera,
    image: { src: media.whiteCubic, alt: "White cubic modernist house" },
    body: [
      {
        type: "p",
        text: "Buying a high-value residence is less about finding the right home than about avoiding the wrong one. This is the sequence we walk our clients through.",
      },
      { type: "h", text: "1. Define how you want to live" },
      {
        type: "p",
        text: "Before looking at listings, describe a typical weekday and weekend. Commutes, schools, how often you host, how much outdoor space you actually use. This brief does more to narrow the search than any budget.",
      },
      { type: "h", text: "2. View at the right hour" },
      {
        type: "p",
        text: "See shortlisted homes at different times — morning light, evening noise, weekend traffic. A home that feels perfect at 11am can feel very different at 7pm.",
      },
      { type: "h", text: "3. Due diligence" },
      {
        type: "list",
        items: [
          "Clear title and chain of ownership, reviewed by an independent lawyer.",
          "Approvals, occupancy certificate and, for new projects, RERA registration.",
          "Society or association records, outstanding dues and any pending disputes.",
          "A structural and services inspection for older buildings.",
        ],
      },
      {
        type: "quote",
        text: "The best negotiation happens after the paperwork is understood, not before.",
      },
      { type: "h", text: "4. Negotiate and close" },
      {
        type: "p",
        text: "With the facts established, negotiation becomes a conversation about value rather than fear. Factor in stamp duty, registration and any renovation into your total budget before agreeing a price.",
      },
      {
        type: "p",
        text: "This guide is general information, not legal or financial advice. We always recommend independent legal and tax counsel for every purchase.",
      },
    ],
  },
  {
    slug: "reading-rental-yield-honestly",
    category: "Investment",
    title: "Reading rental yield honestly",
    excerpt: "Gross, net and the costs that quietly sit between them.",
    readMinutes: 6,
    date: "Jun 2026",
    isoDate: "2026-06-24",
    author: team.arjun,
    image: { src: media.darkFacade, alt: "Dark facade with warmly lit windows" },
    body: [
      {
        type: "p",
        text: "Rental yield is the number most often quoted and least often explained. A headline figure can look attractive while hiding the costs that determine what an owner actually earns.",
      },
      { type: "h", text: "Gross versus net" },
      {
        type: "p",
        text: "Gross yield is annual rent divided by purchase price. Net yield subtracts the costs of owning and letting: maintenance, property tax, insurance, furnishing, agency fees and the months a home sits empty between tenants.",
      },
      {
        type: "list",
        items: [
          "Vacancy — even a few weeks a year changes the picture.",
          "Furnishing — luxury tenants expect quality, and it wears.",
          "Maintenance and society charges — often higher in amenity-rich buildings.",
          "Taxes on rental income — which vary by individual circumstance.",
        ],
      },
      {
        type: "quote",
        text: "A slightly lower yield on a home that is always let is usually worth more than a high yield on paper.",
      },
      { type: "h", text: "What sustains rent" },
      {
        type: "p",
        text: "In our experience, the residences that lease fastest share a few traits: good natural light, sensible layouts, proximity to work and schools, and buildings that are well run. Design quality is not a luxury in a rental — it is what keeps it occupied.",
      },
      {
        type: "p",
        text: "These are general observations. Please speak to an independent financial advisor about your own situation before investing.",
      },
    ],
  },
  {
    slug: "what-to-ask-before-buying-off-plan",
    category: "New Developments",
    title: "What to ask before buying off-plan",
    excerpt: "Seven questions that separate a good early purchase from a long wait.",
    readMinutes: 7,
    date: "Jun 2026",
    isoDate: "2026-06-10",
    author: team.meera,
    image: { src: media.apartmentFacade, alt: "Facade of a contemporary apartment building" },
    body: [
      {
        type: "p",
        text: "Buying a residence before it is built can mean the best choice of floor and outlook — and a better price. It also means trusting a drawing. These are the questions we ask every developer on our clients' behalf.",
      },
      { type: "h", text: "The seven questions" },
      {
        type: "list",
        items: [
          "Is the project registered under RERA, and does the registered completion date match what is being promised?",
          "Who are the architect and contractor, and what have they built before?",
          "Are all approvals in place for the full height and design being sold?",
          "How are payments linked to construction milestones?",
          "What exactly is included in the specification — and what is an upgrade?",
          "What are the expected maintenance charges once complete?",
          "What happens if completion is delayed?",
        ],
      },
      {
        type: "quote",
        text: "Visit a finished building by the same developer. It tells you more than any brochure.",
      },
      { type: "h", text: "Following progress" },
      {
        type: "p",
        text: "Once reserved, regular site visits and photographed progress reports keep surprises to a minimum. For our clients we coordinate these quarterly, along with snagging and interiors in the final months so the keys arrive with nothing left to do.",
      },
    ],
  },
];
