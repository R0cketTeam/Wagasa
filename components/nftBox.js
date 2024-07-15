export default function NFTBox({ token }) {
    return (
        <div className="max-w-sm dark-bg-taiko mb-10 rounded-lg">
            <a href={`https://wagasa.vercel.app/${token.tokenId}`} target="_blank" rel="noopener noreferrer">
                <img className="rounded-lg" src={token.image} alt={`NFT ${token.name}`} />
            </a>
            <div className="p-5">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white tracking-widest">{token.name}</h5>
                <p className="text-sm mb-4 font-normal text-zinc-700 dark:text-zinc-400">{token.description}</p>
                <h6 className="mb-1 text-l font-bold tracking-tight text-zinc-900 dark:text-white tracking-widest">Attributes:</h6>
                <ul className="list-inside list-disc text-sm font-semibold mb-2 font-normal text-zinc-700 dark:text-zinc-300 leading-6">
                    <li>Position: {token.attributes.position}</li>
                    <li>WenSet: {token.attributes.wenSet} </li>
                    <li>Stuff Meter: {token.attributes.stuffMeter}</li>
                    <li>Rotation Speed: {token.attributes.rotationSpeed}</li>
                    <li>Palette: {token.attributes.palette}</li>
                    <li>Segment: {token.attributes.segment}</li>
                    <li>Speed: {token.attributes.speed}</li>
                </ul>
            </div>
        </div>
    )
}