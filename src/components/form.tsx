import type { ReactNode } from "react";

interface FormProps{
    children: ReactNode
}
export default function AuthForm({children}:FormProps){
    return(
         <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-xl space-y-8 p-8 lg:mt-20">
                {children}
            </div>
        </div>
    );
}