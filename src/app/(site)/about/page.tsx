import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-card py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              About Us
            </h1>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              We&apos;re passionate about bringing you the finest selection of
              watches and accessories, combining timeless elegance with modern
              style.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading  text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground font-body  mb-4">
                Founded in 2024, our journey began with a simple mission: to
                provide exceptional timepieces and accessories that reflect both
                quality and style. What started as a small boutique has grown
                into a trusted destination for watch enthusiasts and
                fashion-conscious individuals alike.
              </p>
              <p className="text-muted-foreground font-body ">
                Today, we continue to curate a collection that represents the
                perfect blend of traditional craftsmanship and contemporary
                design, ensuring that every piece tells its own unique story.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <Image
                  src="/building.png"
                  alt="About Us"
                  fill
                  className="object-cover"
                />
                {/* <Image src="https://images.unsplash.com/photo-1630060041646-3ba002aa7d37?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" fill className="object-cover" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center border border-border p-6 rounded-3xl shadow-md bg-background">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Quality First
              </h3>
              <p className="text-muted-foreground font-body ">
                We carefully select each product, ensuring it meets our high
                standards of quality and craftsmanship.
              </p>
            </div>
            <div className="text-center border border-border p-6 rounded-3xl shadow-md bg-background">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Customer Focus
              </h3>
              <p className="text-muted-foreground font-body ">
                Your satisfaction is our priority. We&apos;re committed to
                providing exceptional service and support.
              </p>
            </div>
            <div className="text-center border border-border p-6 rounded-3xl shadow-md bg-background">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Innovation
              </h3>
              <p className="text-muted-foreground font-body ">
                We continuously explore new designs and technologies to bring
                you the latest in watch and accessory trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-foreground text-center mb-12">
            Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-48 h-48 mx-auto rounded-full bg-muted mb-4 overflow-hidden">
                <Image
                  src="/pn.png"
                  alt="About Us"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Person 1
              </h3>
              <p className="text-muted-foreground font-body ">Founder & CEO</p>
            </div>
            <div className="text-center bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-48 h-48 mx-auto rounded-full bg-muted mb-4 overflow-hidden">
                <Image
                  src="/pn.png"
                  alt="About Us"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-heading  font-semibold text-foreground mb-2">
                Person 2
              </h3>
              <p className="text-muted-foreground font-body ">
                Creative Director
              </p>
            </div>
            <div className="text-center bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-48 h-48 mx-auto rounded-full bg-muted mb-4 overflow-hidden">
                <Image
                  src="/pn.png"
                  alt="About Us"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Person 3
              </h3>
              <p className="text-muted-foreground font-body ">
                Head of Operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading  text-foreground mb-6">
            Join Our Journey
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl font-body  mx-auto">
            Experience the perfect blend of style and quality. Browse our
            collection and find your perfect timepiece or accessory today.
          </p>
          <Link href="/products">
            <Button className="px-8 py-3 font-body " variant="default">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
