export default function truncateString(str, maxlenght) {
    if (str.length > maxlenght) {
        return str.slice(0, maxlenght) + '...';
    } else {
        return str;
    }
}

