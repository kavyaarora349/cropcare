
import React from "react";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`${sizeClasses[size]} gradient-primary rounded-lg flex items-center justify-center shadow-lg`}>
                <img src="/favicon.svg" alt="Leaf" className="w-1/2 h-1/2" />
            </div>
            <span className={`font-display font-semibold text-foreground ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
                Crop Care Connect
            </span>
        </div>
    );
};

export default Logo;
