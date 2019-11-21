import {
    Card
} from "./card.js";
import {
    CardList
} from "./cardlist.js";
import {
    Api
} from "./api.js";
import {
    Popup
} from "./popup.js";


/* переменные */

const placesList = document.querySelector('.places-list');
const userInfo = document.querySelector('.user-info');
const api = new Api('serverUrl', 'b609187f-538a-4dd9-8e49-ec8acb2e6948');
const cardList = new CardList(placesList, api);
const placePopUp = new Popup(document.querySelector('#modal_1'));
const editPopUp = new Popup(document.querySelector('#modal_2'));
export const picPopUp = new Popup(document.querySelector('#modal_3'));

document.querySelector('.user-info__button').addEventListener('click', () => placePopUp.open());
document.querySelector('.user-info__button_edit').addEventListener('click', () => editPopUp.open());


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

export function updateInfo(userData) {
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
