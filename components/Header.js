import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Header() {
    return (
        <>
            <div className="bg-white shadow dark:dark-bg-taiko flex flex-row mb-10 pb-3 pt-2 dark-bg-taiko" >
                <div className="w-full max-w-screen-xl mx-auto p-4">
                    <nav className="flex flex-row dark-bg-taiko">
                        <img src='https://i.ibb.co/YjS3zs8/wasaga-Logo-Website2.png' />
                        {/*<h1 className="py-6 px-4 font-semibold text-4xl text-green-500 tracking-widest"> Wagasa</h1>*/}
                        <div className="ml-auto py-2 mt-5">
                            <ConnectButton />
                            <ToastContainer />
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}