import {
    updateInfo
} from "./script.js";


export class Api {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    loadInfo() {
        return fetch(this.url + '/users/me', {
                headers: {
                    authorization: this.key
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                updateInfo(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renewInfo(nameValue, aboutValue) {
        return fetch(this.url + '/users/me', {
                method: 'PATCH',
                headers: {
                    authorization: this.key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameValue,
                    about: aboutValue
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then(() => {
                this.loadInfo();
            })
            .catch((err) => {
                console.log(err);
            });
    }


    loadCards() {
        return fetch(this.url + '/cards', {
                headers: {
                    authorization: this.key
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

}
