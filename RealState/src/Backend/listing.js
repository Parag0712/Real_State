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

    async updateListing({ name, description, address, sell, rent, parking, furnished, offer, bedrooms, bathrooms, regularPrice, discountPrice }, urls, id) {
        const obj = {
            name: name,
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
            const response = await this.api.patch(`/update-listing/${id}`, {
                ...obj
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response;
        } catch (error) {
            if (error.response.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    //Get Current User
    async getListings() {
        try {
            const response = await this.api.get('/get-listings');
            return response.data;
        } catch (error) {
            if (error?.response?.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }

    //Gte Listing 
    async getListing(id) {
        try {
            const response = await this.api.get(`/get-listing/${id}`);
            return response.data;
        } catch (error) {
            if (error?.response?.data) {
                throw error.response.data.message;
            } else {
                throw error
            }
        }
    }



    //Get Current User
    async getSearchListings({ offer, sort,furnished, sell, rent, searchTerm, limit, order, parking },startIndex) {
        console.log(startIndex);
        try {
            const response = await this.api.get('/get-search-listings',
                {
                    params: {
                        offer: offer || false,
                        furnished: furnished || false,
                        sell: sell || false,
                        rent: rent || false,
                        searchTerm: searchTerm || '',
                        limit: limit || 9,
                        startIndex: startIndex || 0,
                        order:  order|| 'desc',
                        sort:sort || 'createdAt',
                        parking: parking || false
                    }
                });
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