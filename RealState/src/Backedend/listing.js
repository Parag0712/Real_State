// listing/create-listing
import axios from "axios";
class Listing {
    constructor() {
        this.api = axios.create({
            baseURL: '/api/v1/listing', // Assuming your API base URL is /api/v1/auth
            withCredentials: true // Adding credentials option
        });
    }


    // Register Function
    async createListing({ names, description, address, sell, rent, parking, furnished, offer, bedrooms, bathrooms, regularPrice, discountPrice }, urls) {

        const obj = {
            name: names,
            description: description,
            address: address,
            sell: sell || true,
            rent: rent,
            parking: parking,
            furnished: furnished,
            offer: offer,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            regularPrice: regularPrice || 0,
            discountPrice: discountPrice || 0,
            imageUrls: urls
        }

        try {
            const response = await this.api.post('/create-listing', {
                ...obj
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response;
            // return response.data;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    //Get Current User
    async getListing() {
        try {
            const response = await this.api.get('/get-listing');
            return response.data;
        } catch (error) {
            throw error
        }
    }

    //Delete Listing
    async deleteListing(id) {
        try {
            const response = await this.api.delete(`/delete-listing/${id}`);
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

const ListingService = new Listing();
export default ListingService