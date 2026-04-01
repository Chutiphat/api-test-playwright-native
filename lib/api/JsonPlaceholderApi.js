class JsonPlaceholderApi {
    constructor(request) {
        this.request = request;
    }

    async createPost(headers, data) {
        return await this.request.post('https://jsonplaceholder.typicode.com/posts', {
            headers: headers,
            data: data
        });
    }
}
module.exports = JsonPlaceholderApi;
