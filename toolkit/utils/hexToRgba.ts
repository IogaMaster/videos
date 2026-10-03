export const hexToRgba = (hex: String, alpha = 1) => {
    // Remove the leading hash if present
    let cleanHex = hex.replace(/^#/, '');

    // If it's a 3-digit shorthand hex, expand it to 6 digits
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }

    // Parse the r, g, b values into integers
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
