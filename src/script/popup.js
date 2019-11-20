export class Popup {
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
