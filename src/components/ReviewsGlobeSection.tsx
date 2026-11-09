"use client";

import * as React from "react";
import Link from "next/link";
import { TestimonialGlobe, type GlobeTestimonial } from "@/components/ui/testimonial-globe";
import { ArrowRight, Sparkles } from "lucide-react";

export const INDIAN_REVIEWS: GlobeTestimonial[] = [
  {
    id: "rohan-mumbai",
    name: "Rohan Sharma",
    role: "Lead Colorist & Commercial Editor",
    company: "RedChillies VFX Alum",
    city: "Mumbai",
    country: "IN",
    lat: 19.076,
    lng: 72.8777,
    image: "/reviews/rohan_mumbai.jpg",
    rating: 5,
    tone: 1,
    quote:
      "The 65x Kodak 500T 3D LUTs handled Sony S-Log3 Indian skin tones better than anything I've custom-built in Resolve. Exported our latest OTT commercial grade in half the usual turnaround.",
  },
  {
    id: "ananya-bengaluru",
    name: "Ananya Iyer",
    role: "Tech YouTuber & Motion Designer",
    company: "850K+ Channel Lead",
    city: "Bengaluru",
    country: "IN",
    lat: 12.9716,
    lng: 77.5946,
    image: "/reviews/ananya_bengaluru.jpg",
    rating: 5,
    tone: 2,
    quote:
      "Finding clean, uncompressed alpha PNG memes and kinetic typography that don't look cheesy is rare. The 100GB vault became my channel's daily editing template. My retention rate jumped 18%.",
  },
  {
    id: "kabir-delhi",
    name: "Kabir Malhotra",
    role: "Documentary Filmmaker",
    company: "IndieDocs India",
    city: "New Delhi",
    country: "IN",
    lat: 28.6139,
    lng: 77.209,
    image: "/reviews/kabir_delhi.jpg",
    rating: 5,
    tone: 3,
    quote:
      "The 96kHz broadcast WAV sound effects are incredible. The tactile foley, whooshes, and atmospheric room tones brought life to our Ladakh documentary without a single audio artifact.",
  },
  {
    id: "arjun-hyderabad",
    name: "Arjun Reddy",
    role: "Tollywood Film Editor & VFX Artist",
    company: "Feature Post Facility",
    city: "Hyderabad",
    country: "IN",
    lat: 17.385,
    lng: 78.4867,
    image: "/reviews/arjun_hyderabad.jpg",
    rating: 5,
    tone: 4,
    quote:
      "The 4K ProRes 422 film burns and optical light leaks saved our action teaser cut. In Premiere Pro, they drop directly onto timeline tracks with zero rendering lag.",
  },
  {
    id: "priya-chennai",
    name: "Priya Sundaram",
    role: "Post-Production Supervisor",
    company: "Madras Ad Agency",
    city: "Chennai",
    country: "IN",
    lat: 13.0827,
    lng: 80.2707,
    image: "/reviews/priya_chennai.jpg",
    rating: 5,
    tone: 5,
    quote:
      "Most bundles sell bloated 50GB packs full of junk. VVM is the first time every single file is calibrated, properly folder-structured, and ready for commercial client delivery.",
  },
  {
    id: "vikram-pune",
    name: "Vikram Deshmukh",
    role: "Luxury Wedding Cinematographer",
    company: "Royal Stories Weddings",
    city: "Pune",
    country: "IN",
    lat: 18.5204,
    lng: 73.8567,
    image: "/reviews/vikram_pune.jpg",
    rating: 5,
    tone: 1,
    quote:
      "During wedding season we edit 15+ cinematic trailers a month. The warm Fuji Eterna LUTs and analog halation overlays gave our bride & groom portraits that rich Bollywood film aesthetic instantly.",
  },
  {
    id: "sourav-kolkata",
    name: "Sourav Mukherjee",
    role: "Independent Music Video Director",
    company: "Studio Hooghly",
    city: "Kolkata",
    country: "IN",
    lat: 22.5726,
    lng: 88.3639,
    image: "/reviews/sourav_kolkata.jpg",
    rating: 5,
    tone: 2,
    quote:
      "True 35mm optical grain scans with zero digital compression. We projected our music video on a 2K screening screen and the grain toe roll-off looked genuinely shot on 16mm celluloid.",
  },
  {
    id: "hardik-ahmedabad",
    name: "Hardik Patel",
    role: "Creative Director & D2C Video Lead",
    company: "PixelCraft Media",
    city: "Ahmedabad",
    country: "IN",
    lat: 23.0225,
    lng: 72.5714,
    image: "/reviews/hardik_ahmedabad.jpg",
    rating: 5,
    tone: 3,
    quote:
      "We produce 40+ performance ad creatives every week. The fast speed-ramp transitions and punchy impact SFX paid for the ₹49 bundle within the first 2 minutes of use.",
  },
  {
    id: "rahul-kochi",
    name: "Rahul Nair",
    role: "Assistant Film Editor",
    company: "Mollywood Features",
    city: "Kochi",
    country: "IN",
    lat: 9.9312,
    lng: 76.2673,
    image: "/reviews/rahul_kochi.jpg",
    rating: 5,
    tone: 4,
    quote:
      "Universal .CUBE and standard WAV files that load seamlessly on our DaVinci Resolve Studio rig and Final Cut Pro. Zero plugin dependencies. It's an indispensable toolbox.",
  },
  {
    id: "siddharth-jaipur",
    name: "Siddharth Rathore",
    role: "Travel Creator & Drone Cinematographer",
    company: "Thar Visuals",
    city: "Jaipur",
    country: "IN",
    lat: 26.9124,
    lng: 75.7873,
    image: "/reviews/siddharth_jaipur.jpg",
    rating: 5,
    tone: 5,
    quote:
      "Color grading desert sunset drone footage used to take me hours of hue balancing. The teal-orange and golden hour cine grades lock the highlights without clipping sky detail.",
  },
];

export function ReviewsGlobeSection() {
  return (
    <div id="reviews" className="relative w-full border-t border-vvm-border">
      <TestimonialGlobe
        items={INDIAN_REVIEWS}
        eyebrow="Trusted Across Indian Cinema & Creator Studios"
        heading="What creators say, from where they edit."
        caption="From Bollywood color suites in Mumbai to Bangalore tech creators and South Indian film post-houses, explore verified feedback across India."
        autoplay={true}
        interval={4200}
        size={460}
        action={
          <a
            href="#bundle-showcase"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs sm:text-sm font-semibold hover:bg-vvm-accent hover:text-white transition-all shadow-card hover:shadow-glow"
          >
            <Sparkles className="w-3.5 h-3.5 text-vvm-accent hover:text-white" />
            <span>Join 2,400+ Indian Editors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        }
      />
    </div>
  );
}

export default ReviewsGlobeSection;
