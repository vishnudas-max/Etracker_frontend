// for extracting error message from default django-rest responses

export function getFirstErrorMessage(errorResponseData) {
    if (!errorResponseData || typeof errorResponseData !== 'object') return "An error occurred.";

    const firstKey = Object.keys(errorResponseData)[0];
    const firstError = errorResponseData[firstKey];

    if (Array.isArray(firstError)) {
        return firstError[0];
    }

    return typeof firstError === 'string' ? firstError : "An error occurred.";
}
