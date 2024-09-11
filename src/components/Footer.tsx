import { Linkedin, X } from "lucide-react";

function Footer() {
    return (
        <footer className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 p-6 md:p-8 bg-gray-900 text-white">
            <h3 className="text-center text-lg md:text-xl font-medium tracking-wider">
                Designed & Developed by 
                <a 
                    className="ml-1 font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600" 
                    target="_blank" 
                    href="https://x.com/poxyPixels" 
                    rel="noreferrer"
                >
                    Prabal Verma
                </a>
            </h3>
            <div className="flex gap-6">
                <a 
                    href="https://linkedin.com/in/prabal-verma" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                    <Linkedin className="w-6 h-6" />
                    LinkedIn
                </a>
                <a 
                    href="https://x.com/poxyPixels" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                    <X className="w-6 h-6" />
                    Twitter
                </a>
                <a 
                    href="https://instagram.com/prabalverma" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                    <Instagram className="w-6 h-6" />
                    Instagram
                </a>
            </div>
        </footer>
    );
}

export default Footer;
