
export const objectToQueryString = (obj: Record<string, any>) => {
    const keyValuePairs = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            keyValuePairs.push(
                encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
            );
        }
    }
    return keyValuePairs.join("&");
};
