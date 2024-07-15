import { ThirdwebStorage } from "@thirdweb-dev/storage";
import dotenv from 'dotenv';

export const uploadToIPFS = async (imageDataUrl) => {
    const storage = new ThirdwebStorage({
        clientId: process.env.THIRDWEB_CLIENT_ID
    });

    try {
        const base64Data = imageDataUrl
        const base64ContentIndex = base64Data.indexOf(',') + 1;
        const base64WithoutPrefix = base64Data.substring(base64ContentIndex);
        const contentType = 'image/png';
        const blob = base64ToBlob(base64WithoutPrefix, contentType);
        const fileName = "image.png";
        const file = new File([blob], fileName, { type: blob.type });
        const result = await storage.upload(file, { uploadWithoutDirectory: true });
        return result;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
};

export const uploadMetaToIPFS = async (imageDataUrl, data) => {

    const storage = new ThirdwebStorage({
        clientId: process.env.THIRDWEB_CLIENT_ID
    });
    try {
        const imageUri = await uploadToIPFS(imageDataUrl);
        const cleanUri = imageUri.replace('ipfs://', '')
        const lastUri = `https://ipfs.io/ipfs/${cleanUri}`

        const metadata = {
            "name": data.name,
            "tokenId": data.tokenId,
            "description": data.description,
            "tokenHash": data.tokenHash,
            "image": lastUri,
            "attributes": data.attributes,
        }
        const result = await storage.upload(metadata, { uploadWithoutDirectory: true });
        return result
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
};

// Function to convert Base64 to Blob
function base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

