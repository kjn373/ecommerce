"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Tag, 
    Users,
    Menu,
    LogOut,
    Settings,
    X
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path ? "bg-navaccent font-semibold rounded-lg" : "";
    };

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/categories', label: 'Categories', icon: Tag },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
        { href: '/admin/users', label: 'Users', icon: Users },
    ];

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            router.push('/login');
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden"
                variant="ghost"
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            <nav className={`
                font-heading
                fixed lg:static
                w-64 bg-card border-r border-border 
                flex flex-col
                min-h-screen
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                z-40
            `}>
                <div className="p-4 flex flex-col min-h-screen bg-card">
                    <div className="flex justify-between items-center mb-6 mt-6">
                        <h2 className="text-2xl font-bold text-foreground font-heading">Admin Panel</h2>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden"
                            variant="ghost"
                            size="icon"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href} 
                                    className={`py-3 px-4 rounded hover:bg-muted transition flex items-center gap-3 ${isActive(item.href)}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                        
                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="py-3 px-4 rounded hover:bg-muted transition flex items-center gap-3 text-left text-foreground"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-xs z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
} 