import {
    Popup
} from "./popup.js";

import {
    picPopUp
} from "./script.js";

export class Card {
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
