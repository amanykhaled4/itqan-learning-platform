// Talks to the Itqan API and keeps the login token.

const Api = (() => {
    // Same server when the API serves the site; port 5111 when using VS Code Live Server
    const BASE = (window.ITQAN_API_URL || (location.port === "5500" ? "http://localhost:5111" : "")) + "/api";
    const TOKEN_KEY = "itqan.token";

    class ApiError extends Error {
        constructor(status, code, message) {
            super(message);
            this.status = status;
            this.code = code;
        }
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    function clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    async function request(method, path, body) {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;

        let response;
        try {
            response = await fetch(BASE + path, {
                method,
                headers,
                body: body === undefined ? undefined : JSON.stringify(body)
            });
        } catch {
            throw new ApiError(0, "NETWORK", "Could not reach the server.");
        }

        // Token missing or expired: send the student back to the login page
        if (response.status === 401 && token) {
            clearToken();
            location.href = "index.html?expired=1";
            return new Promise(() => {});
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const code = data?.code || (response.status === 400 ? "VALIDATION" : `HTTP_${response.status}`);
            throw new ApiError(response.status, code, data?.message || data?.title || response.statusText);
        }

        return data;
    }

    return {
        ApiError,
        getToken,
        setToken,
        clearToken,
        isLoggedIn: () => Boolean(getToken()),
        get: (path) => request("GET", path),
        post: (path, body) => request("POST", path, body ?? {}),
        put: (path, body) => request("PUT", path, body ?? {}),
        delete: (path) => request("DELETE", path)
    };
})();
