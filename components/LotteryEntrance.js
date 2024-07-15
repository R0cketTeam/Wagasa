import WagasaABI from "../constants/WagasaABI.json";
import { whitelist } from "../constants";
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { ethers } from "ethers";
import dotenv from 'dotenv';
import Wrapper from "./Wrapper";
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../components/DataContext';
import { captureCanvasImage } from "../utils/captureCanvasImage";
import { useSwitchChain } from 'wagmi'

dotenv.config();

export default function LotteryEntrance() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.mainnet.taiko.xyz");
    const WagasaContract = process.env.WAGASA_CONTRACT;

    const provide = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provide.getSigner();

    const contract = new ethers.Contract(WagasaContract, WagasaABI, provider);

    const { switchChain } = useSwitchChain()
    const { address, chainId } = useAccount();
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const { data, setData, iref, cata, setCata } = useContext(DataContext);
    const [userData, setUserData] = useState(null);
    const [id, setId] = useState(null);
    const [minting, setMinting] = useState(false);
    const [tsupply, setTsupply] = useState(0);
    const [tokenHash, setTokenHash] = useState(null);
    const [merkleProof, setMerkleProof] = useState(null)
    const [isFirstButtonVisible, setIsFirstButtonVisible] = useState(false);
    const [isSecondButtonVisible, setIsSecondButtonVisible] = useState(false);
    const [price, setPrice] = useState(null)

    const firstButtonUnixTime = 1720897300;
    const secondButtonUnixTime = firstButtonUnixTime + 100;

    const handleMerkleProof = () => {

        let proof = []

        if (whitelist.includes(address)) {
            const { keccak256 } = ethers.utils
            let leaves = whitelist.map((addr) => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true })
            let hashedAddress = keccak256(address)
            proof = merkleTree.getHexProof(hashedAddress)
            setMerkleProof(proof)
        }
    }

    const listenToWagasaMintedEvent = () => {
        contract.on("WagasaMinted", (owner, tokenId, tokenURI, event) => {
            console.log("WagasaMinted event detected:", owner, tokenId, tokenURI);
            fetchTotalSupply(); // Fetch the updated total supply when a mint event occurs
        });
    };

    const tokenID = async () => {
        const tid = await contract.totalSupply();
        setId(tid.toNumber());
        setTokenHash(`${address}${tid}${unixTimestamp}`);
        const userData = {
            contractAddress: WagasaContract,
            chainId: chainId,
            tokenId: tid.toNumber(),
            walletAddress: address,
            timestamp: unixTimestamp,
            tokenHash: `${address}${tid}${unixTimestamp}`
        };
        setUserData(userData);
    };

    async function mintWagasa(tokenId, URI, tokenHash, merkleProof) {
        const contractWithSigner = new ethers.Contract(WagasaContract, WagasaABI, signer);

        try {
            const transaction = await contractWithSigner.mintWagasa(tokenId, URI, tokenHash, merkleProof, {
                value: ethers.utils.parseEther(`${price}`),
            });
            console.log("Transaction sent:", transaction);
            return transaction;
        } catch (error) {
            if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
                console.log("Insufficient funds");
                handleFailedNotification("Insufficient funds in the wallet.");
            } else if (error.message.includes("reverted")) {
                console.log("Transaction reverted");
                handleFailedNotification("Transaction reverted: Ether value sent is below the price.");
            } else {
                console.log("Error:", error.message);
                handleFailedNotification(`Error: ${error.message}`);
            }
            setMinting(false);

            throw error;
        }
    }

    const handleSuccessNotification = () => toast.success("Minted!");

    const handleFailedNotification = () => toast.error("Failed!");

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1);
            console.log("Transaction confirmed:", tx);
            handleSuccessNotification();
        } catch (error) {
            console.log("Transaction error:", error);
            handleFailedNotification();
        } finally {
            setMinting(false);
            setData(null)
            setCata(false)
            setId(null)
            setUserData(null)
        }
    };

    useEffect(() => {
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime >= secondButtonUnixTime) {
            setIsFirstButtonVisible(false);
            setIsSecondButtonVisible(true);
        } else if (currentTime >= firstButtonUnixTime) {
            setIsFirstButtonVisible(true);
            setIsSecondButtonVisible(false);

            const timeUntilSecondButtonEnable = secondButtonUnixTime - currentTime;
            setTimeout(() => {
                setIsFirstButtonVisible(false);
                setIsSecondButtonVisible(true);
            }, timeUntilSecondButtonEnable * 1000);
        }
    }, [firstButtonUnixTime, secondButtonUnixTime]);

    useEffect(() => {
        if (userData && data && id && tokenHash) {
            const mintWagasaProcess = async () => {
                try {
                    const URL = await captureCanvasImage(data);
                    const cleanUri = URL.replace('ipfs://', '');
                    const lastUri = `https://ipfs.io/ipfs/${cleanUri}`;
                    const transaction = await mintWagasa(id, lastUri, tokenHash);
                    await handleSuccess(transaction);

                } catch (error) {
                    console.error("Minting process failed:", error);
                }
            };
            mintWagasaProcess();
        }
    }, [userData, data, id, tokenHash]);

    const fetchTotalSupply = async () => {
        try {
            const total = await contract.totalSupply();
            setTsupply(total.toNumber());
        } catch (error) {
            console.error("Failed to fetch total supply:", error);
        }
    };

    useEffect(() => {
        fetchTotalSupply();
        listenToWagasaMintedEvent(); // Set up the event listener
        handleMerkleProof()
        return () => {
            contract.off("WagasaMinted"); // Clean up the event listener
        };
    }, []);

    return (
        <>
            <div className="p-5 flex h-[700px] w-[700px] items-center justify-center">
                <div className="w-full max-w-2xl items-center justify-center bg-white shadow dark:bg-zinc-950 dark-bg-taiko rounded-lg">
                    <div className="p-5 m-10">
                        <div>
                            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-5 tracking-widest">Wagasa</h5>
                            <p className="leading-6 text-m text-gray-900 dark:text-white mb-4">
                                WAGASA is a limited series collection of 39,393 generative artworks, encapsulating themes of nihilism, inherent cruelty, and greed—echoing our trivial existence in an uncaring universe.
                                <br /><br />
                                Each element in these artworks—from colors to strokes—reflects the fleeting nature of life amidst an eternal void, the scars of violence, and the complacency they foster.
                                <br /><br />
                                Though seemingly colorful and tranquil, underlying currents challenge the observer to confront deeper truths.
                                WAGASA, not for the faint of heart, mirrors our darkest despair and spurs introspection, urging us to confront our demons and strive for a better future.
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-l font-semibold text-gray-900 dark:text-white tracking-widest">Price: 0.001 ETH</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-l font-semibold text-gray-900 dark:text-white mt-2 tracking-widest">{tsupply} / 10,000 Minted</span>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                {isFirstButtonVisible && (
                                    chainId == 167000 ? (
                                        <button
                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold px-20 py-3.5 mt-5 ${minting ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={async () => {
                                                if (merkleProof) {
                                                    setMinting(true);
                                                    setPrice("0.0003")
                                                    await tokenID();
                                                }
                                            }}
                                            disabled
                                        >
                                            {minting ? "Minting..." : "Whitelist Mint"}
                                        </button>
                                    ) : (
                                        <button
                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold px-20 py-3.5 mt-5`}
                                            onClick={() => switchChain({ chainId: 167000 })}
                                        >
                                            Switch to Taiko Mainnet
                                        </button>
                                    )
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {isSecondButtonVisible && (
                                    chainId == 167000 ? (
                                        <button
                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold px-20 py-3.5 mt-5 ${minting ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={async () => {
                                                setMinting(true);
                                                setPrice("0")
                                                setMerkleProof([])
                                                await tokenID();
                                            }}
                                            disabled
                                        >
                                            {minting ? "Minting..." : "Public Mint"}
                                        </button>
                                    ) : (
                                        <button
                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold px-20 py-3.5 mt-5`}
                                            onClick={() => switchChain({ chainId: 167000 })}
                                        >
                                            Switch to Taiko Mainnet
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Wrapper userData={userData} />
        </>
    );
}
