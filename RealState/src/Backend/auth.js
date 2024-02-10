import axios from "axios";

class Auth {

    constructor() {
        this.api = axios.create({
            baseURL: '/api/v1/', 
            withCredentials: true
        });
    }


    // Register Function
    async createAccount({ username, email, password }) {
        try {
            const response = await this.api.post('auth/register', {
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
            const response = await this.api.post('auth/login', {
                email,
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    async refreshToken(id) {
        // console.log(id);
        try {
            const response = await this.api.get('auth/refresh-token',{
                params: {
                    param1: id,
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

    async updateAccount({ email, username , password ,avatar }) {
        try {
            const response = await this.api.patch('user/update-account', {
                email,
                username,
                password,
                avatar
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
            const response = await this.api.get('auth/get-user');
            return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    async googleAuth({username,email,avatar}){
        try {
            const response = await this.api.post('auth/google', {
                email,
                username,
                avatar
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
            const response = await this.api.post("auth/logout");
            return response.data
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    // delete function
    async delete() {
        try {
            const response = await this.api.delete("user/delete-account");
            return response.data
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    async getUserListing(){
        try {
            const response = await this.api.get('user/get-user-listing');
            return response.data;
        } catch (error) {
                throw error
        }
    }
}

const AuthService = new Auth();
export default AuthService