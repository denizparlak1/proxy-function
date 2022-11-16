const axios = require('axios');

// axios.interceptors.response.use(response => return response, error => Promise.reject(error));

axios.defaults.headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36';

axios.interceptors.request.use((config) => {
    config.start = new Date();
    return config;
}, error => Promise.reject(error));


axios.interceptors.response.use((response) => {
    response.config.time = new Date() - response.config.start;
    return response;
}, error => Promise.reject(error));


module.exports = {
    call: (url, config) => new Promise(resolve => {
        config = Object.assign({ url: url }, config);
        axios(config)
            .then(response => {
                resolve(response);
            })
            .catch(e => {
                resolve(e.response);
            });
    })
};