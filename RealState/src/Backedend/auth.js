class Auth {
    // We Need ENV  

    // Register Function
    async createAccount(formData) {
        try {
            const response = await axios.post('/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            console.log(data);
            // if (data.success === false) {
            //     return;
            // }
        } catch (error) {
            throw error.message
        }
    }


    // Login Function
    async login(formData) {
        try {
            const response = await axios.post('/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            console.log(data);
            // if (data.success === false) {
            //     return;
            // }
        } catch (error) {
            throw error.message
        }
    }

    // Logout Function
    async logout(){
        try {
            const response = await axios.post("/api/auth/login");
            return response.data
        } catch (error) {
            throw error.message
        }
    }
}


export default AuthService = new Auth();