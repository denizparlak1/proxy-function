module.exports = {
    success: (result) => {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(result),
        }
    },
    failure: (msg, code, data) => {
        return {
            statusCode: code,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
                statusCode: code,
                error: msg,
                data
            }),
        }
    },
    parseHttpResponse: (response) => {
        return {
            code: response.status,
            text: response.statusText,
            time: (response.config.time) ? response.config.time : (new Date() - response.config.start)
        }
    },
    parseTcpResponse: (response) => {
        return {
            connect: response.connect,
            time: response.time
        }
    }
};