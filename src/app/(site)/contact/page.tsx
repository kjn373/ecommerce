import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen pt-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-brand font-heading">
          Contact Us
        </h1>
        <div className="bg-card rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Contact Form */}
          <form className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-4 text-brand-dark font-heading">
              Send a Message
            </h2>
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              required
            />
            <Button type="submit" className="px-6 py-2" variant="default">
              Send Message
            </Button>
          </form>

          {/* Contact Info */}
          <div className="flex-1 flex flex-col gap-6 justify-between">
            <h2 className="text-2xl font-semibold mb-4 text-brand-dark font-heading">
              Contact Information
            </h2>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold text-brand">Email:</span>{" "}
              support@vyv.com
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold text-brand">Phone:</span> +1 234
              567 890
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold text-brand">Address:</span> 123
              Market Street, City, Country
            </p>
            <Image
              src="https://images.unsplash.com/photo-1717343824623-06293a62a70d?q=80&w=2121&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={400}
              height={100}
              className='"w-full h-auto bg-gray-200 rounded flex items-center justify-center'
              alt="map"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
