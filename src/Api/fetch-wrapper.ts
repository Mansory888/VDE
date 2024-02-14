
const API_URL = "http://192.168.1.4:3000/drivingexam/v1/";

interface FetchOptions extends RequestInit {}
/**
 * Fetch wrapper to automatically include authorization headers.
 */
export const fetchWithToken = async (url: string, options: FetchOptions = {}) => {
  // Retrieve and parse the stored user information
  const storedUser = localStorage.getItem('userResp');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user ? user.token : '';

  // Set default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  // Ensure the method defaults to GET if not specified
  const method = options.method || 'GET';

  // Combine default headers with any headers provided in options
  const headers = { ...defaultHeaders, ...options.headers };

  // Perform the fetch call with the token included in the headers
  const response = await fetch(`${API_URL}${url}`, { ...options, method, headers });
  const data = await response.json();

  // Check for an HTTP error status
  if (!response.ok) {
    throw new Error(data.message || 'Unknown error occurred');
  }

  return data;
};
