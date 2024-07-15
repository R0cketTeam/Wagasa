import { uploadMetaToIPFS } from "./uploadToIPFS";

export const captureCanvasImage = async (data) => {
    let canvas = document.querySelector('#defaultCanvas1');

    const waitAndCapture = async () => {
        // Canvas varsa ve 1 saniye beklet
        if (canvas) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1000ms = 1 saniye beklet
        }

        // Tekrar kontrol et
        canvas = document.querySelector('#defaultCanvas1');

        if (canvas) {
            const imageDataUrl = canvas.toDataURL();
            const ipfsUri = await uploadMetaToIPFS(imageDataUrl, data);
            return ipfsUri;
        } else {
            console.error('Canvas element not found or not initialized.');
        }
    };

    return waitAndCapture();
};
