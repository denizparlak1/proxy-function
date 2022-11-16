'use strict';
const res = require('./util/response');
const httpClient = require('./util/http-client');
const {v4: uuidv4} = require('uuid');
const faker = require('faker');

module.exports.check = (event, context, callback) => {
    httpClient.call('http://ip-api.com/json')
        .then(response => {
            let data = response.data;
            const protocol = (event.headers.Host.includes("localhost")) ? "http" : "https"
            const url = `${protocol}://${event.headers.Host}`
            callback(null, res.success({
                url,
                city: data.city,
                country: data.country,
                region: data.country,
                ip: data.query,
                timezone: data.timezone,
                location: {
                    latitude: data.lat,
                    longitude: data.lon
                }
            }));
        })
        .catch(e => {
            callback(null, res.failure(e.message))
        })
};

module.exports.verify = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const url = 'https://m.turkiye.gov.tr/api.php'
    const params = {
        p: 'belge-dogrulama',
        qr: data.barcode,
        deviceid: uuidv4(),
        ipAdresi: faker.internet.ip(),
        appVersion: '2.0.1.1',
        os: 'android'
    }
    httpClient.call(url, {
        params,
        method: 'GET'
    })
        .then(response => {
            const responseData = response.data
            if (responseData.return) {
                callback(null, res.success({
                    file: responseData.data.barkodluBelge,
                    createdAt: responseData.data.olusturulmaTarihi,
                    institution: responseData.data.verildigiKurum
                }))
            } else {
                callback(null, res.failure("Failed return", 422, responseData))
            }
        })
        .catch(e => callback(null, res.failure('Error occurred')));
};


module.exports.idVerify = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const url = 'https://tckimlik.nvi.gov.tr/tcKimlikNoDogrula/search'
    const params = {
        "TCKimlikNo": data.identityNumber,
        "CuzdanSeriNo": null,
        "TckkSeriNo": null,
        "GeciciKimlikNo": null,
        "Ad": data.firstName,
        "Soyad": data.lastName,
        "DogumGun": data.dob.split('-')[2],
        "DogumAy": data.dob.split('-')[1],
        "DogumYil": data.dob.split('-')[0]
    }
    httpClient.call(url, {
        data: params,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://tckimlik.nvi.gov.tr',
            'Referer': 'https://tckimlik.nvi.gov.tr/Modul/TcKimlikNoDogrula',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            const responseData = response.data
            console.log(response)
            if (responseData.success) {
                callback(null, res.success(responseData))
            } else {
                callback(null, res.failure("Record Not Found", 404, responseData))
            }
        })
        .catch(e => callback(null, res.failure('Error occurred')));
};