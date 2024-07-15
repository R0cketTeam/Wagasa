import { useState, useEffect } from "react";
import NFTBox from "./nftBox";
import WagasaABI from "../constants/WagasaABI.json";
import { useAccount } from 'wagmi';
import { ethers } from "ethers";
import dotenv from 'dotenv';
import { fetchIPFSData } from "../utils/fetchIPFSData";

dotenv.config();

export default function NFTBoxContainer() {
    const [balance, setBalance] = useState("");
    const [nftsData, setNftsData] = useState([]);
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.mainnet.taiko.xyz");
    const WagasaContract = process.env.WAGASA_CONTRACT;
    const contract = new ethers.Contract(WagasaContract, WagasaABI, provider);

    const { address, isConnected, isDisconnected } = useAccount();

    const listenToWagasaMintedEvent = () => {
        contract.on("WagasaMinted", (owner, tokenId, tokenURI, event) => {
            if (owner.toLowerCase() === address.toLowerCase()) {
                updateUI();
            }
        });
    };

    const balanceOfOwner = async () => {
        const balance = await contract.balanceOf(address);
        setBalance(balance.toNumber());
    };

    const fetchTokenIdsAndData = async () => {
        let tokensData = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const tokenURI = await contract.tokenURI(tokenId);
            const data = await fetchIPFSData(tokenURI);
            tokensData.push({ tokenId: tokenId.toNumber(), tokenURI: tokenURI, ...data });
        }
        setNftsData(tokensData);
    };

    async function updateUI() {
        await balanceOfOwner();
        await fetchTokenIdsAndData();
    }

    useEffect(() => {
        if (isConnected) {
            listenToWagasaMintedEvent();
            updateUI();
        }

        return () => {
            contract.removeAllListeners("WagasaMinted");
        };
    }, [isConnected]);

    useEffect(() => {
        if (isConnected) {
            updateUI();
        }
    }, [balance]);

    useEffect(() => {
        if (isDisconnected) {
            setNftsData([]);
        }
    }, [isDisconnected]);

    return (
        !isConnected ? (
            <div className="flex flex-col items-center">
                <div>
                    <h5 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2 mt-10 tracking-widest">Please Connect your Wallet to View Your NFTs.</h5>
                </div>
            </div>
        ) : (
            nftsData.length > 0 ? (
                <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center w-full rounded-lg">
                        <h5 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-8 pb-3 pt-3 mt-10 mb-10 tracking-widest border-b border-b-zinc-700 flex flex-row">Owned NFTs</h5>
                    </div>
                    <div className="flex flex-wrap justify-evenly w-full mb-5 ">
                        {nftsData.map((token, index) => (
                            <NFTBox key={index} token={token} />
                        ))}
                    </div>
                </div>
            ) : balance === 0 ? (
                <div className="flex flex-col items-center">
                    <h5 className="text-l font-semibold tracking-tight text-zinc-900 dark:text-white mb-2 mt-10 tracking-widest"></h5>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h5 className="text-l font-semibold tracking-tight text-zinc-900 dark:text-white mb-2 mt-10 tracking-widest">Your NFT is being generated. Please wait a few minutes to view your unique artwork.<br /> Thank you for your patience! Do not reload the page before seeing your NFT.</h5>
                </div>
            )
        )
    );
}
