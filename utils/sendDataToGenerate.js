export const sendData = async (data) => {
    const response = await fetch('/api/generate-artwork', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
};