/* переменные */

const placesList = document.querySelector('.places-list');
const userInfo = document.querySelector('.user-info');

/* классы */

class Card {
    constructor(name, link) {
        this.cardElement = this.create(name, link);
        this.link = link;
        this.cardElement
            .querySelector('.place-card__like-icon')
            .addEventListener('click', this.like);
        this.cardElement
            .querySelector('.place-card__delete-icon')
            .addEventListener('click', this.remove.bind(this));
        this.cardElement
            .querySelector('.place-card__image')
            .addEventListener('click', this.enlargePic.bind(this));
    }

    create(name, link) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('place-card');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('place-card__delete-icon');
        deleteButton.onclick = function () {
            event.stopPropagation();
        };

        const imageElement = document.createElement('div');
        imageElement.classList.add('place-card__image');
        imageElement.setAttribute('data-target', 'modal_3');
        imageElement.style.backgroundImage = `url(${link})`;

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('place-card__description');

        const cardTitle = document.createElement('h3');
        cardTitle.classList.add('place-card__name');
        cardTitle.textContent = name;

        const likeButton = document.createElement('button');
        likeButton.classList.add('place-card__like-icon');

        cardContainer.appendChild(imageElement);
        imageElement.appendChild(deleteButton);
        cardContainer.appendChild(descriptionElement);
        descriptionElement.appendChild(cardTitle);
        descriptionElement.appendChild(likeButton);

        return cardContainer;
    }

    like(event) {
        event.target.classList.toggle('place-card__like-icon_liked');
    }

    remove(event) {
        this.cardElement.parentNode.removeChild(this.cardElement);
    }

    enlargePic(event) {
        document.querySelector('.popup__picture_large').setAttribute('src', this.link);
        picPopUp.open();
    }

}

class CardList {
    constructor(container, api) {
        this.container = container;
        api.loadCards().then(cards => {
            this.cards = cards;
            this.render();
        })
    }

    render() {
        this.cards.forEach(cardsArray => this.addCard(cardsArray.name, cardsArray.link));
    }

    addCard(name, link) {
        const {
            cardElement
        } = new Card(name, link);
        this.container.appendChild(cardElement);
    };
}

class Api {
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

const api = new Api('http://95.216.175.5/cohort4', 'b609187f-538a-4dd9-8e49-ec8acb2e6948');
const cardList = new CardList(placesList, api);

/* открываем и закрываем попапы */

class Popup {
    constructor(container) {
        this.container = container;
        this.container
            .querySelector('.popup__close')
            .addEventListener('click', this.close.bind(this));
    }
    open() {
        this.container.classList.add('popup_is-opened');
    }
    close(event) {
        this.container.classList.remove('popup_is-opened');
    }
}

const placePopUp = new Popup(document.querySelector('#modal_1'));
const editPopUp = new Popup(document.querySelector('#modal_2'));
const picPopUp = new Popup(document.querySelector('#modal_3'));


/* подключаем форму */

const form = document.forms.new;
const name = form.elements.name;
const link = form.elements.link;

function addNewPlace(event) {

    event.preventDefault();

    cardList.addCard(name.value, link.value);

    form.reset();

    placePopUp.close();
}

form.addEventListener('submit', addNewPlace);

/* редактируем информацию о себе  */

const editForm = document.forms.edit;
const myname = editForm.elements.myname;
const myjob = editForm.elements.myjob;

myname.value = document.querySelector('.user-info__name').textContent;
myjob.value = document.querySelector('.user-info__job').textContent;

function editProfile(event) {
    event.preventDefault();

    const myname = editForm.myname.value;
    const myjob = editForm.myjob.value;

    document.querySelector('.user-info__name').textContent = myname;
    document.querySelector('.user-info__job').textContent = myjob;

    api.renewInfo(myname, myjob);

    editPopUp.close();
}

editForm.addEventListener('submit', editProfile);

function updateInfo(userData) {
    document.querySelector('.user-info__name').textContent = userData.name;
    document.querySelector('.user-info__job').textContent = userData.about;
}

api.loadInfo();

/* валидируем всяческие формы */

function validateForms(input) {

    const error = input.parentNode.querySelector('.error');

    if (input.type !== 'url' && (input.validity.tooShort || input.validity.tooLong)) {
        error.textContent = 'Должно быть от 2 до 30 символов';
        return false;
    } else if (input.hasAttribute('required') && input.validity.valueMissing && input.value == '') {
        error.textContent = 'Это обязательное поле';
        return false;
    } else if (input.type === 'url' && input.validity.typeMismatch) {
        error.textContent = 'Здесь должна быть ссылка';
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

function validateAll(event) {
    event.preventDefault();

    validateForms(event.target);

    document.querySelector('.popup__button').disabled = !form.checkValidity();
    document.querySelector('.popup__button_edit').disabled = !editForm.checkValidity();
}

name.addEventListener('input', validateAll);
link.addEventListener('input', validateAll);
myname.addEventListener('input', validateAll);
myjob.addEventListener('input', validateAll);

/* закрываем попап после клика по кнопке */
/* Можно лучше: не сразу понял каким образом у Вас закрывается попап добавления карточки пока не нашел
 onclick="closeSelf();". Лучше придерживаться одного подхода и вешать обработчики через addEventListener, так код
 более однороден. Но в данном случае лучше было просто вызывать placePopUp.close() в обработчике отправки формы  } */


/*

    По работе 8: Хорошая работа, все сделано верно и критических замечаний не нашел.
    Отлично, что в классе Popup используется bind для привязки контекста обработчика события.
    Есть некоторые места где можно сделать лучше - их я описал в коде.
    Главное замечание - если созданы экземпляры классов попапа то нужно для закрытия использовать из методы.

    Если будет свободное время полезно будет ознакомиться с принципами SOLID 
    применяемые для проектирования ООП программ https://ota-solid.now.sh/ ,
    а если уж совсем захотите погрузиться в то, как правильно проектировать
    программы, можете почитать про паттерны проектирования, вот неплохое 
    руководство https://refactoring.guru/ru/design-patterns и там же хорошо
    про рефакторинг https://refactoring.guru/ru/refactoring
    Также недавно вышла отличная статья про ООП и SOLID https://habr.com/ru/post/446816/
*/




/* В целом по работе:

Отлично!

    Весь функционал работает корректно
    Код чистый и хорошо читается
    Вы используете логические группировки операций
    У вас нет дублирование кода
    Вы не используете небезопасный innerHtml
    Вы используете делегирование
    Вы валидируете ввод пользователя

    Можно лучше:

    Вы не закрываете попап при добавлении карточки, это нужно делать.

    У вас хоршая работа, вы писали про затруднение с попапом, я явной ошибки не заметил, поэтому работу пропуская.
    Однако советую вам уточнить все непонятные моменты.

*/

/**
 * Здравствуйте
 * 
 * Неплохо реализован класс API но надо его доделать
 * Убрать с конструктора this.loadInfo();
 * В конструкторе можно только инициализировать переменные.
 * 
 * Класс API ничего не должен знать о DOM
 *  document.querySelector('.user-info__name').textContent = result.name;
    document.querySelector('.user-info__job').textContent = result.about;
 * Передать управление классу который вызывает этот метод
 * 
 * можно лучше: function validateForms(input) просит чтобы разбить её на небольшие функции
 * 
 * Вам не нужен уже     <script src="js/initialCards.js"></script> удалите
 * 
 * Можно лучше. Не очень хорошая идея создавать виртуальный DOM при создании карточки, используйте лучше шаблон. 
 * Для примера можете посмотреть здесь https://wesbos.com/template-strings-html/
 * 
 * 
 * Можно лучше: обычно названия, для примера 'Должно быть от 2 до 30 символов' 
 * выносят в отдельный объект. Допустим может появится задача сделать многоязычный сайт
 * Для примера : const lang = { validationLenght: 'Должно быть от 2 до 30 символов' } 
 * 
 * Жду ваших исправлений
 * 
 */

/* Здравствуйте, спасибо за ревью и за ссылки! 
   Разбираюсь с markup-разметкой на каникулах, если вы не возражаете, думаю, на переписывание DOM уйдёт много времени 
   Критические ошибки исправила, DOM больше не в Api */

   /**
    * классы вообще ничего не должны знать о друг друге, если только не наследуют друг друга. 
    * 
    * Это как микроволновка ничего не знает о посудомоечной посуде, хотя обе посточянно взаимодействуют с тарелками. 
    * Ручка включения  микроволновки(метод класса) ничего не знает о тарелке которая ставится в отдел разогрева микроволновки( другой метод класса). 
    * Только так должны работать классы. 
    * 
    * Сейчас у вас в классе API остался   updateInfo(result); чего не должно быть...
    * 
    * Вот за такой код в проектах тоже бьют по рукам
    * class CardList {
    constructor(container, api) {
        this.container = container;
        api.loadCards().then(cards => {
            this.cards = cards;
            this.render();
        })
    }
    * В конструкторе только можно инициализировать. 

    * Удачи вам
    * 
    */