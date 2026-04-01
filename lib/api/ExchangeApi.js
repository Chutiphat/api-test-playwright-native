class ExchangeApi {
    constructor(request) {
        this.request = request;
    }

    async getLatestRates(headers, baseCurrency = 'THB') {
        return await this.request.get(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
            headers: headers
        });
    }
}
module.exports = ExchangeApi;
