export const convertToWebP = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], `${file.name}.webp`, { type: 'image/webp' }));
                }, 'image/webp', 0.7);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

export const convertCamelCase = (camelCasedString) => {
    const spacedString = camelCasedString.replace(/([A-Z])/g, ' $1').trim();
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
};

