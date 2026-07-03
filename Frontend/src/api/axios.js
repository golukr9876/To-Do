import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
});


api.interceptors.response.use(
    (response) => {
        // Any status code in the range of 2xx triggers this function
        // Production Trick: Directly return response.data so components don't have to keep doing .data
        return response.data;
    },
    (error) => {
        // Any status codes outside the range of 2xx trigger this function
        let normalizedError = {
            status: error.response?.status || 500,
            message: "Something went wrong. Please try again.",
            data: error.response?.data || null
        };

        if (error.response) {
            // The server responded with a status code outside of 2xx
            // Use the exact custom message sent by your backend (e.g., ApiError)
            normalizedError.message = error.response.data?.message || `Error: ${error.response.status}`;
            
            // Production Level Status Code Decoding & Actions
            switch (error.response.status) {
                case 400:
                    console.error("Bad Request: Check sent data properties.");
                    break;
                case 401:
                    console.warn("Unauthorized! Clearing session/redirecting to login...");
                    // Optional: trigger a logout action or clear tokens here
                    break;
                case 403:
                    console.error("Forbidden: You don't have permission.");
                    break;
                case 409:
                    console.warn("Conflict: Resource already exists.");
                    break;
                case 500:
                    console.error("Internal Server Error on backend.");
                    break;
            }
        } else if (error.request) {
           if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                normalizedError.message = "The server is taking too long to respond. Please wait a moment and try again.";
                normalizedError.status = 408; // Request Timeout status code
            } else {
                normalizedError.message = "Network error. Please check your internet connection.";
            }
        }

        // Return a rejected promise containing your clean, standardized error object
        return Promise.reject(normalizedError);
    }
);

export default api;