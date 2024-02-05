import axios from "axios";

class Auth {

    constructor() {
        this.api = axios.create({
            baseURL: '/api/v1/auth', // Assuming your API base URL is /api/v1/auth
            withCredentials: true // Adding credentials option
        });
    }


    // Register Function
    async createAccount({ username, email, password }) {
        try {
            const response = await this.api.post('/register', {
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
            const response = await this.api.post('/login', {
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

    //Get Current User
    async getAuthUser(){
        try {
            const response = await this.api.get('/get-user');
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
            const response = await this.api.post("/logout");
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