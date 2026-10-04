import { media } from "./media";
import type { City } from "./types";

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    summary: "Sea-facing residences along the western coast, from the leafy lanes of Juhu to the towers of Worli and BKC.",
    coordinates: { lat: 19.076, lng: 72.8777 },
    neighbourhoods: ["Juhu", "Bandra West", "Worli", "Lower Parel", "BKC"],
    image: { src: media.apartmentFacade, alt: "Facade of a contemporary residential building" },
    guideId: "juhu",
  },
  {
    slug: "goa",
    name: "Goa",
    state: "Goa",
    summary: "Lime-washed villas, courtyards and palm gardens in the quiet villages of North Goa.",
    coordinates: { lat: 15.5937, lng: 73.7685 },
    neighbourhoods: ["Assagao", "Vagator", "Siolim", "Anjuna"],
    image: { src: media.whiteVillaPool, alt: "White villa with pool" },
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    summary: "Garden homes and sky residences in a city of tree-lined avenues and year-round temperate weather.",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    neighbourhoods: ["Lavelle Road", "Sadashivanagar", "Whitefield", "Hebbal"],
    image: { src: media.houseNight, alt: "Contemporary house glowing at night" },
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    summary: "Modernist pavilions, riverside estates and hill-view residences, a short drive from Mumbai.",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    neighbourhoods: ["Koregaon Park", "Kalyani Nagar", "Baner", "Mulshi"],
    image: { src: media.villaGlassPool, alt: "Glass villa reflected in a pool" },
  },
  {
    slug: "alibaug",
    name: "Alibaug",
    state: "Maharashtra",
    summary: "Weekend estates beneath old trees, across the harbour from Mumbai by boat.",
    coordinates: { lat: 18.6414, lng: 72.8722 },
    neighbourhoods: ["Kihim", "Awas", "Mandwa", "Nagaon"],
    image: { src: media.gardenHouse, alt: "House set in a mature garden" },
  },
];
