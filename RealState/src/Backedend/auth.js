import axios from "axios";

class Auth {
    // We Need ENV  

    // Register Function
    async createAccount({ username, email, password }) {
        try {
            const response = await axios.post('/api/v1/auth/register', {
                email,
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    // Login Function
    async login({ email, username = "", password }) {
        try {
            const response = await axios.post('/api/v1/auth/login', {
                email,
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    // Logout Function
    async logout() {
        try {
            const response = await axios.post("/api/v1/auth/logout");
            return response.data
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }
}

const AuthService = new Auth();
export default AuthService