import Image from 'next/image';

export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex justify-center p-3 sm:p-4 lg:p-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-[300px] lg:min-h-screen">
                <div className="absolute inset-0 bg-primary-50">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <Image 
                            src="/auth0.svg" 
                            alt="Authentication" 
                            width={700} 
                            height={700}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}