export const siteConfig = {
  name: "অক্ষরায়ণ",
  nameTransliteration: "Okhorayon",
  tagline: "নীরবতার প্রান্তে চিন্তার বিস্তার; যেখানে ভাব এসে অক্ষরের রূপ নেয়।",
  taglineEn: "Thinking in the margin of silence; observing where thought meets form.",
  description:
    "অক্ষরায়ণ — চিন্তাশীল রচনা, মননশীল প্রবন্ধ, কবিতা, গবেষণা, এবং দৃশ্যশিল্পের উন্মুক্ত পাঠাগার।",
  author: "রাফি / Rafi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://okhorayon.vercel.app",
  navLinks: [
    { href: "/poems", label: "কবিতা", labelEn: "Poems" },
    { href: "/articles", label: "প্রবন্ধ", labelEn: "Articles" },
    { href: "/research", label: "গবেষণা", labelEn: "Research" },
    { href: "/posters", label: "পোস্টার", labelEn: "Posters" },
    { href: "/books", label: "বই", labelEn: "Books" },
  ],
  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rafi2026",
};

export type SiteConfig = typeof siteConfig;
