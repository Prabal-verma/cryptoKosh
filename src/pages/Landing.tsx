import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Landing() {
    const navigate = useNavigate();
    const handleNavigation = (blockchain: string) => {
        navigate(`/generate-mnemonic?blockchain=${blockchain}`);
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-black overflow-hidden relative">
            {/* Background Circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[300%] h-[300%] bg-gradient-radial from-pink-500 via-purple-600 to-blue-700 opacity-30 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[300%] h-[300%] bg-gradient-radial from-teal-400 via-blue-500 to-indigo-600 opacity-20 blur-3xl"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-2xl mx-auto">
                <h1 className="text-6xl font-extrabold mb-8 leading-tight">
                    Discover Blockchain with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">CryptoKosh</span>
                </h1>
                <p className="text-xl mb-12">
                    Select a blockchain and embark on your journey into the world of decentralized finance.
                </p>
                <div className="flex flex-col md:flex-row gap-6">
                    <button 
                        className="relative py-4 px-8 rounded-full font-bold text-white bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
                        onClick={() => {
                            handleNavigation('solana');
                            toast.success("Solana selected. Generate a wallet to continue.");
                        }}
                    >
                        <span className="absolute inset-0 bg-opacity-50 bg-yellow-300 rounded-full"></span>
                        Solana
                    </button>
                    <button 
                        className="relative py-4 px-8 rounded-full font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        onClick={() => {
                            handleNavigation('ethereum');
                            toast.success("Ethereum selected. Generate a wallet to continue.");
                        }}
                    >
                        <span className="absolute inset-0 bg-opacity-50 bg-blue-300 rounded-full"></span>
                        Ethereum
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Landing;
