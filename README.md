Here's an updated README for your `CryptoKosh` component, incorporating a better layout and UI details:

---

# CryptoKosh

**CryptoKosh** (referring to a "vault" in Hindi) is a modern React functional component designed to generate and manage cryptocurrency wallets. With features like wallet generation, recovery phrase entry, and key management, it offers an intuitive interface to securely handle your cryptocurrency credentials.

### Features

- **Generate Wallet**: Seamlessly create a new wallet with a fresh mnemonic phrase and view generated private and public keys.
- **Import Wallet**: Optionally enter an existing recovery phrase to generate and view associated keys.
- **Toggle Visibility**: Enhance security by toggling the visibility of private keys and recovery phrases.
- **Copy to Clipboard**: Conveniently copy private keys, public keys, and the recovery phrase with a single click.

### Installation

To use CryptoKosh in your project:

1. **Clone the repository** or add the component to your existing React project.

2. **Install the required dependencies**:

    ```bash
    npm install tweetnacl bip39 ed25519-hd-key @solana/web3.js sonner lucide-react
    ```

3. **Import and use the `CryptoKosh` component** in your React project:

    ```jsx
    import CryptoKosh from 'path-to-crypto-kosh-component';
    
    function App() {
      return (
        <div>
          <CryptoKosh />
        </div>
      );
    }
    ```

### State Management

- **`mnemonicWords`**: Stores the words of the recovery phrase, initialized from `localStorage` if previously saved.

    ```tsx
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(() => {
      const savedMnemonic = localStorage.getItem('mnemonicWords');
      return savedMnemonic ? JSON.parse(savedMnemonic) : [];
    });
    ```

- **`mnemonicWordsInput`**: Manages the input for the mnemonic recovery phrase.

    ```tsx
    const [mnemonicWordsInput, setMnemonicWordsInput] = useState<string>(() => localStorage.getItem('mnemonicWordsInput') || '');
    ```

- **`wallets`**: Stores generated wallets, initialized from `localStorage` if previously saved.

    ```tsx
    const [wallets, setWallets] = useState<Wallet[]>(() => {
      const savedWallets = localStorage.getItem('wallets');
      return savedWallets ? JSON.parse(savedWallets) : [];
    });
    ```

- **`blockchain`**: Stores the selected blockchain for wallet generation.

    ```tsx
    const [blockchain, setBlockchain] = useState<string>(() => localStorage.getItem('blockchain') || '');
    ```

- **`isCopied`**: Tracks whether the key information has been copied to the clipboard.

    ```tsx
    const [isCopied, setIsCopied] = useState(false);
    ```

- **`showPrivateKey`**: Toggles the visibility of private keys for security purposes.

    ```tsx
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    ```

### How It Works

- **Generating a Wallet**: When generating a new wallet, a mnemonic phrase is created and used to derive a seed. This seed generates the corresponding private and public keys, which are displayed along with the mnemonic phrase.
- **Importing a Wallet**: Entering an existing recovery phrase allows for the derivation of private and public keys associated with that phrase.
- **Visibility Toggle**: The component allows for toggling the visibility of private keys and recovery phrases between visible text and a censored format (asterisks).
- **Clipboard Copy**: Keys and the recovery phrase can be copied to the clipboard with a button click for easy access.

### Contributing

We welcome contributions to improve CryptoKosh! Feel free to submit issues or pull requests.

### License

This project is licensed under the MIT License.

---

Feel free to adjust any section as needed!