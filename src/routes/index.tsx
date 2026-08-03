import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Products } from "@/components/site/Products";
import { Gallery } from "@/components/site/Gallery";
import { Booking } from "@/components/site/Booking";
import { Testimonials, CtaBand } from "@/components/site/Testimonials";
import { Contact, Footer } from "@/components/site/Contact";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

const title = "Ativa Saúde e Nutrição Animal | Pet Shop em Areal - RJ";
const description =
  "Pet shop em Areal (RJ) com banho e tosa sem estresse, consultoria de nutrição, vacinas e entrega de ração no mesmo dia. Amor em cada patinha.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PetStore",
          name: "Ativa Saúde e Nutrição Animal - Pet Shop",
          slogan: "Amor em cada patinha",
          telephone: "(02) 49884-2476",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Pr. Pres. Castelo Branco, 320 - Lot. Projetado",
            addressLocality: "Areal",
            addressRegion: "RJ",
            postalCode: "25845-000",
            addressCountry: "BR",
          },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Products />
        <Gallery />
        <Booking />
        <Testimonials />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
