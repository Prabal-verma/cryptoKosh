import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { ethers } from 'ethers';
import { Buffer } from "buffer";
import process from 'process';
import { Copy, Eye, EyeOff, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

window.Buffer = Buffer;
window.process = process;
window.Crypto = Crypto;

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

function WalletManager() {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(() => {
    const savedMnemonic = localStorage.getItem('mnemonicWords');
    return savedMnemonic ? JSON.parse(savedMnemonic) : [];
  });
  const [mnemonicWordsInput, setMnemonicWordsInput] = useState<string>(() => localStorage.getItem('mnemonicWordsInput') || '')
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const savedWallets = localStorage.getItem('wallets');
    return savedWallets ? JSON.parse(savedWallets) : [];
  });
  // const [privateKeys, setPrivateKeys] = useState<string>();
  // const [publicKey, setPublicKey] = useState<string>('');
  const [blockchain, setBlockchain] = useState<string>(() => localStorage.getItem('blockchain') || '');
  const [isCopied, setIsCopied] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    localStorage.setItem('wallets', JSON.stringify(wallets));
  }, [wallets])

  useEffect(() => {
    localStorage.setItem('blockchain', JSON.stringify(blockchain))
  }, [blockchain])

  useEffect(() => {
    localStorage.setItem('mnemonicWords', JSON.stringify(mnemonicWords));
    localStorage.setItem('mnemonicWordsInput', mnemonicWordsInput);
  }, [mnemonicWords, mnemonicWordsInput]);

  useEffect(() => {
    const blockchainParam = searchParams.get('blockchain');
    if (blockchainParam && ['solana', 'ethereum'].includes(blockchainParam)) {
      setBlockchain(blockchainParam);
    } else {
      toast.error('Invalid blockchain. Please select Solana or Ethereum.');
    }
  }, [searchParams]);

  const handleGenerateMnemonic = () => {
    const mnemonicInput = mnemonicWordsInput.trim();
    const wordCount = mnemonicInput.split(' ').length;
    if (mnemonicInput && (wordCount < 12 || !validateMnemonic(mnemonicInput))) {
      toast.error('Invalid mnemonic. Please try again.')
      setMnemonicWordsInput('');
      return;
    }
    if (!blockchain || !['solana', 'ethereum'].includes(blockchain)) {
      toast.error('Invalid or missing blockchain. Please select Solana or Ethereum.');
      return;
    }
    try {
      const mnemonic = mnemonicInput || generateMnemonic();
      const words = mnemonic.split(' ');
      setMnemonicWords(words);

      const seed = mnemonicToSeedSync(mnemonic);
      const accountIndex = wallets.length;

      if (blockchain === 'solana') {
        const path = `m/44'/501'/0'/${accountIndex}'`;
        const { key: derivedSeed } = derivePath(path, seed.toString('hex'));
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);
        // setPrivateKeys(Buffer.from(keypair.secretKey).toString('hex'))
        // setPublicKey(keypair.publicKey.toBase58());

        const newWallet: Wallet = {
          publicKey: keypair.publicKey.toBase58(),
          privateKey: (Buffer.from(keypair.secretKey).toString('hex')),
          mnemonic,
          path
        }
        // setWallets([...wallets, newWallet]);
        setWallets((prevWallets) => [...prevWallets, newWallet]);

        toast.success("Wallet generated successfully!")

      } else if (blockchain === 'ethereum') {
        const path = `m/44'/60'/0'/${accountIndex}'`;
        const derivedSeed = derivePath(path, seed.toString('hex')).key;
        const privateKey = Buffer.from(derivedSeed).toString('hex')
        const wallet = new ethers.Wallet(privateKey)

        // setPrivateKeys(privateKey);
        // setPublicKey(wallet.address);

        const newWallet: Wallet = {
          publicKey: wallet.address,
          privateKey,
          mnemonic,
          path,
        };
        // setWallets([...wallets, newWallet]);
        setWallets((prevWallets) => [...prevWallets, newWallet]);
        toast.success("Wallet generated successfully!")
      }
    } catch (error) {
      console.error("Something went wrong while generating the wallet:", error);
      toast.error("Something went wrong while generating the wallet");
    }
  }

  const copyMnemonic = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mnemonicWords.join(' '));
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      toast.error("Clipboard API not supported");
    }
  }

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  }

  const AddNewWallet = () => {
    if (!mnemonicWords.length) {
      toast.error("No mnemonic found. Please generate a wallet first.");
      return;
    }
    const mnemonic = mnemonicWords.join(' ');
    const seed = mnemonicToSeedSync(mnemonic);
    const accountIndex = wallets.length;
    if (blockchain === 'solana') {
      const path = `m/44'/501'/0'/${accountIndex}'`;
      const { key: derivedSeed } = derivePath(path, seed.toString('hex'));
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(secretKey);

      const newWallet: Wallet = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: (Buffer.from(keypair.secretKey).toString('hex')),
        mnemonic,
        path
      }
      setWallets((prevWallets) => [...prevWallets, newWallet]);
      toast.success("Wallet generated successfully!")

    } else if (blockchain === 'ethereum') {
      const path = `m/44'/60'/0'/${accountIndex}'`;
      const derivedSeed = derivePath(path, seed.toString('hex')).key;
      const privateKey = Buffer.from(derivedSeed).toString('hex')
      const wallet = new ethers.Wallet(privateKey)

      const newWallet: Wallet = {
        publicKey: wallet.address,
        privateKey,
        mnemonic,
        path,
      };
      setWallets((prevWallets) => [...prevWallets, newWallet]);
      toast.success("Wallet generated successfully!")
    }

  }

  const removeWallet = (i: number) => {
    const updatedWallets = wallets.filter((_, walletIndex) => walletIndex !== i);
    setWallets(updatedWallets);
    if (updatedWallets.length === 0) {
      setMnemonicWords([]);
      setMnemonicWordsInput('');
      setBlockchain('');
      localStorage.removeItem('wallets')
      localStorage.removeItem('blockchain')
      localStorage.removeItem('mnemonicWords')
      localStorage.removeItem('mnemonicWordsInput')
      navigate('/', { replace: true });
    }
    toast.success('Wallet deleted successfully!')
  }

  const removeAllWallets = () => {
    setWallets([]);
    setMnemonicWords([]);
    setMnemonicWordsInput('');
    setBlockchain('');
    localStorage.removeItem('wallets')
    localStorage.removeItem('blockchain')
    localStorage.removeItem('mnemonicWords')
    localStorage.removeItem('mnemonicWordsInput')
    toast.success('All wallets deleted successfully!')
    navigate('/', { replace: true });
  }

  return (
<>
  <section className="px-4 py-6 md:max-w-[80%] mx-auto mt-24"> {/* Add margin-top to avoid content being hidden */}
    <div className="flex flex-col gap-6 md:gap-12">
      {!mnemonicWords.length && (
        <>
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient bg-clip-text text-transparent">
              Your Secret Recovery Phrase Awaits
            </h1>
            <p className="text-lg md:text-xl font-semibold text-gray-300">
              Securely save and manage your mnemonic phrase here.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <input
              className="bg-gray-800 border border-gray-600 text-white rounded-lg py-3 px-4 w-full md:w-80 focus:outline-none focus:border-indigo-500"
              type="password"
              placeholder="Enter your mnemonic phrase or leave blank to generate a new one"
              onChange={(e) => setMnemonicWordsInput(e.target.value)}
              value={mnemonicWordsInput}
            />
            <button
              onClick={handleGenerateMnemonic}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg py-3 px-6 w-full md:w-64 font-bold shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {mnemonicWordsInput ? 'Add Wallet' : 'Generate Wallet'}
            </button>
          </div>
        </>
      )}
      {mnemonicWords.length > 0 && (
        <div className="mt-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient bg-clip-text text-transparent">
            Your Generated Mnemonic Phrase
          </h1>
          <p className="text-lg md:text-xl font-semibold text-gray-300">
            Save these words in a safe place for future use.
          </p>
          <button
            onClick={copyMnemonic}
            className={`mx-auto mt-4 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg py-2 px-6 font-bold shadow-md flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 ${isCopied ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-gray-600 to-gray-800 text-gray-400' : ''}`}
            disabled={isCopied}
          >
            {isCopied ? 'Copied!' : (
              <>
                <Copy />
                Copy to Clipboard
              </>
            )}
          </button>
          <div className="shadow-2xl shadow-neutral-800 p-5 rounded-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 justify-center w-full md:w-[85%] items-center mx-auto mt-3">
            {mnemonicWords.map((word, index) => (
              <p key={index} className="bg-white/30 text-white font-bold rounded-lg py-2 px-3 backdrop-blur-lg shadow-lg">{word}</p>
            ))}
          </div>
        </div>
      )}
      {wallets.length > 0 && (
        <>
          <hr />
          <div className="flex flex-col mt-5 gap-4">
            <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
              <h2 className="text-white text-4xl font-bold capitalize">Your {blockchain} Wallet{wallets.length > 1 ? 's' : ''}</h2>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={AddNewWallet}
                  className='bg-white text-black rounded-full text-base px-4 py-2 font-bold shadow-2xl shadow-neutral-800 hover:bg-white transition-all duration-200 ease-out flex items-center justify-center gap-2'
                >
                  <Plus /> Add Wallet
                </button>
                <button
                  onClick={removeAllWallets}
                  className='bg-white text-black rounded-full text-base px-4 py-2 font-bold shadow-2xl shadow-neutral-800 hover:bg-white transition-all duration-200 ease-out flex items-center justify-center gap-2'
                >
                  <Trash /> Clear Wallets
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              {wallets.map((wallet, index) => (
                <div key={index} className="flex flex-col rounded-2xl border border-black bg-gray-300">
                  <div className="bg-gray-300 rounded-t-2xl flex justify-between px-6 py-4">
                    <h3 className="font-bold text-2xl md:text-3xl tracking-tighter">Wallet {index + 1}</h3>
                    <button onClick={() => removeWallet(index)} className="text-red-500 px-4 py-2" type="button">
                      <Trash />
                    </button>
                  </div>
                  <div className="bg-white flex flex-col gap-4 px-8 py-4 rounded-2xl">
                    <div className="flex flex-col w-full gap-2">
                      <span className="text-lg md:text-xl font-bold tracking-tighter">Public Key</span>
                      <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate overflow-hidden">{wallet.publicKey}</p>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <span className="text-lg md:text-xl font-bold tracking-tighter">Private Key</span>
                      <div className="flex justify-between w-full items-center gap-2">
                        <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                          {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                        </p>
                        <button onClick={togglePrivateKeyVisibility} className="px-4 py-2">
                          {showPrivateKey ? <Eye /> : <EyeOff />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </section>
</>

  )
}
export default WalletManager;