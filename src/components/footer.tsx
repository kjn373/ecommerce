import Link from "next/link";
import { Button } from '@/components/ui/button';

const subLinkStyle:string = "text-gray-600 font-body  hover:text-gray-900";
const subheadingStyle:string = "text-base md:text-lg font-heading font-semibold";
const divStyle:string = "space-y-2 md:space-y-3 m-2"

export default function Footer(){
    return(
        <>
        {/* Newsletter Signup */}
        <section className="py-12 bg-subcard">
            <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">Join Our Newsletter</h2>
            <p className="mb-6 font-body  text-gray-700">Get the latest updates and offers.</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs sm:max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 flex-1 w-full" />
                <Button type="submit" className="px-6 font-body py-2" variant="default">Subscribe</Button>
            </form> 
            </div>
        </section>
        <footer className="bt-1 grid grid-cols-1 sm:grid-cols-2 lg:md:grid-cols-4 mx-10 sm:mx-44 my-10">
            <div className={divStyle}>
                <h3 className={subheadingStyle}>VYV</h3>
                <p className={subLinkStyle}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore numquam 
                    modi accusantium. Modi quibusdam quas suscipit quis repudiandae.
                </p>
            </div>
            <div className={divStyle}>
                <h3 className={subheadingStyle}>Quick Links</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li><Link href="/about" className={subLinkStyle}>About</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Offers and Discounts</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Get Coupons</Link></li>
                    <li><Link href="/contact" className={subLinkStyle}>Contact Us</Link></li>
                </ul>
            </div>
            <div className={divStyle}>
                <h3 className={subheadingStyle}>New Products</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li><Link href="/about" className={subLinkStyle}>About</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Offers and Discounts</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Get Coupons</Link></li>
                    <li><Link href="/contact" className={subLinkStyle}>Contact Us</Link></li>
                </ul>
            </div>
            <div className={divStyle}>
                <h3 className={subheadingStyle}>Support</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li><Link href="/about" className={subLinkStyle}>Frequently Asked Questions</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Terms and Conditions</Link></li>
                    <li><Link href="#" className={subLinkStyle}>Privacy Policy</Link></li>
                    <li><Link href="/contact" className={subLinkStyle}>Report a Payment Isssue</Link></li>
                </ul>
            </div>
        </footer>
        </>
    );
}