import { AppApi } from './components/AppApi';
import { AppData } from './components/AppData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CardBasketView, CardCatalogueView, CardPreview } from './components/CardView';
import './scss/styles.scss';
import { IApi, IFormErrors, IOrderData, IOrderResult } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { ContactForm } from './components/ContactForm';
import { PaymentForm } from './components/PaymentForm';
import { OrderData } from './components/OrderData';
import { Success } from './components/Success';

//шаблоны 
const previewCardTemplate:HTMLTemplateElement = document.getElementById('card-preview') as HTMLTemplateElement;
const basketCardTemplate:HTMLTemplateElement = document.getElementById('card-basket') as HTMLTemplateElement;
const catalogCardTemplate:HTMLTemplateElement = document.getElementById('card-catalog') as HTMLTemplateElement;
const basketTemplate: HTMLTemplateElement = document.getElementById('basket') as HTMLTemplateElement;
const contactFormTemplate: HTMLTemplateElement = document.getElementById('contacts') as HTMLTemplateElement;
const paymentFormTemplate: HTMLTemplateElement = document.getElementById('order') as HTMLTemplateElement;
const modalContainer = document.getElementById('modal-container');
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

//экземпляры
const events = new EventEmitter();
const baseApi:IApi = new Api(API_URL, settings)
const appApi = new AppApi(baseApi);
const appData = new AppData(events);
const page = new Page (document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(paymentFormTemplate), events);
const modal = new Modal(modalContainer, events);
const cardPreview = new CardPreview(cloneTemplate(previewCardTemplate), events);
const orderData = new OrderData(events);
const successWindow = new Success(cloneTemplate(successTemplate), events);



//получаем карточки с сервера, сохраняем в модель 
appApi.getCards().then((data)=>{
    appData.cards = data;
    console.log(appData.cards);
    events.emit('initialData:loaded');
    console.log('loaded');
})
.catch((err)=>{
    console.error(err);
});

events.on('initialData:loaded', ()=>{
    console.log(appData.cards);
    const cardsArray = appData.cards.map((item)=>{
        const cardCatalogue = new CardCatalogueView(cloneTemplate(catalogCardTemplate), events);
        return cardCatalogue.render(item)
    });
    page.render({gallery:cardsArray});
})

events.on('modal:open', () => {
    page.locked = true;
});


events.on('modal:close', () => {
    page.locked = false;
});

//открытие корзины
events.on('basket:open', ()=>{
    const cardsArray = appData.cart.map((item)=>{
        const cardBasket = new CardBasketView(cloneTemplate(basketCardTemplate), events);
        return cardBasket.render(item);
    })
    modal.render({modalContent:basket.render({items:cardsArray})});
    if(appData.cart.length===0){
        basket.blockButton();
    }else{
        basket.unblockButton();
    }   
});
//открытие модалки с карточкой
events.on('card:select', (data:{card:CardCatalogueView})=>{
    const {card} = data;
    appData.preview = card.id;
    //console.log(appData.preview)
    modal.render({modalContent:cardPreview.render(appData.getCard(appData.preview))});
});
//проверка кнопки и установка состояния
events.on('preview:ready', (data:{card: CardPreview})=>{
    const {card} = data;
    console.log(card)
    if(appData.checkInCart(appData.preview)){
        card.blockButton();
        //console.log(`${appData.preview}`)
    }else{
        card.unblockButton();
    } 
      if(card.id==='b06cde61-912f-4663-9751-09956c0eed67'){
        card.blockButton();
      }
});
//добавление карточки в корзину
events.on('card:add', (data:{card: CardPreview})=>{
    const {card} = data;
    card.blockButton();
    appData.addItem(appData.preview);
});
//удаление
events.on('card:remove', (data:{card: CardBasketView})=>{
    const {card} = data;
    console.log(card.id);
    appData.deleteItem(card.id);
    events.emit('basket:open');   
});
//обновление корзины
events.on('basket:changed', ()=>{
    page.basketCounter = appData.getTotal();
    basket.total = appData.getSum();
});
//события форм заказа
//открытие формы оплаты
events.on('order:open', ()=>{
    modal.render({modalContent:paymentForm.render({valid: false, errors: [], address: '', payment: ''})}); 
 });
//валидация
events.on(/^order\..*:input/, (data: { field: keyof IOrderData; value: string }) => {
    const { field, value } = data
   // console.log(data);
    orderData.setPaymentFields(field, value);
    //console.log(orderData.getData());
});

events.on('formErrorsPayment:change', (formErrors: IFormErrors)=> {
    //console.log('formErrorsPayment:change')
    const isEmpty = Object.keys(formErrors).length === 0
    const validation = {valid: isEmpty, errors: [formErrors.address || '', formErrors.payment || '']}
   // console.log(formErrors)
    //console.log(validation)
    paymentForm.render(validation)
});
//открытие формы контактов
events.on('order:submit', ()=> {
    // console.log(orderData.getUserDate());
    modal.render({modalContent:contactForm.render({valid: false, errors: [], address: '', payment: ''})});
});
//валидация
events.on(/^contacts\..*:input/, (data: { field: keyof IOrderData; value: string }) => {
    const { field, value } = data
   // console.log(data);
    orderData.setContactFields(field, value);
    //console.log(orderData.getData());
});

events.on('formErrorsContact:change', (formErrors: IFormErrors)=> {
   // console.log('formErrorsContact:change', formErrors)
    const isEmpty = Object.keys(formErrors).length === 0
    const validation = {valid: isEmpty, errors: [formErrors.phone || '', formErrors.email || '']}
   // console.log(formErrors)
    //console.log(validation)
    contactForm.render(validation)
});

events.on('contacts:submit', ()=>{
    const userInfo = orderData.getData();
    const total = appData.getSum();
    const items = appData.getIdList();
    const orderObj = {...userInfo, total, items};
    console.log(orderObj);
    appApi.sendOrderData(orderObj)
    .then((response:IOrderResult)=>{
        orderData.resetOrder();
        appData.resetBasket();
        basket.basketReset();
        events.emit('basket:changed')
        modal.render({modalContent:successWindow.render({total:response.total})});
    })
    .catch((err)=>{
        console.error(err);
    });
});

events.on('success:close', ()=>{
    modal.close();
})