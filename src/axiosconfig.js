import axios from 'axios';

const baseURL=process.env.REACT_APP_BASE_URL

console.log(baseURL)

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically fetch CSRF token before POST/PUT/DELETE
axiosInstance.interceptors.request.use(async config => {
    const safeMethods = ['GET', 'OPTIONS', 'HEAD'];
    if (!safeMethods.includes(config.method.toUpperCase())) {
        const csrfToken = await getCsrfToken();
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

async function getCsrfToken() {
    const response = await axios.get(`${baseURL}/csrf/`, {
        withCredentials: true
    });
    const csrftoken = getCookie('csrftoken');
    return csrftoken
}

export default axiosInstance;
