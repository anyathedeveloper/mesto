import {
    Card
} from "./card.js";
import {
    Api
} from "./api.js";

export class CardList {
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
