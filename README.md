# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных

Карточка

```
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number|null;
}
```

Базовый список карточек, получаемый с сервера

```
interface ICardsList {
  total: number;
  items: ICard[];
}
```

Модель данных карточек

```
interface IAppData {
  cards: ICard[];
  preview: string|null;
  addItem(card: ICard): void;
  getCard(cardId: string): ICard;
  cart: ICard[];
  total: number;
  deleteItem(id: string): void;
}
```

Карточка без описания для основного списка

```
type TCardPreview = Omit<ICard, 'description'>;
```

Товар в корзине

```
type TCardBasketItem = Pick<ICard, 'id'|'title'|'price'>;
```

Данные для форм отправки заказа

```
interface IOrderData {
  payment: string;
  email: string;
  phone: string;
  address: string;
}
```

Ответ с результатом заказа

```
interface IOrderResult {
  id: string;
  total: number|null;
}
```

Ответ с ошибкой

```
interface IRequestError {
  error: string;
}
```

## Архитектура приложения

Код приложения разделён на слои согласно парадигме MVP:
- слой данных, отвечает за хранение и изменение данных
- слой представления, отвечает за отображение данных на странице
- презентер, отвечает за связь представления и данных

### Базовый Код

#### Класс Api
Содержит в себе базовую логику отправки запросов. Конструктор принимает адрес сервера и опциональный объект с заголовками запросов .
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер (массив товаров либо конкретный товар если передать id).
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределён третьим параметром при вызове метода.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события в системе. Класс используется в презентере для обработки событий и в других слоях для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Классы данных

#### Класс AppData
Класс отвечает за хранение и работу с данными карточек товаров в общем списке товаров и корзине. Конструктор класса принимает экземпляр брокера событий .\
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек
- _preview: string|null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий
- cart: ICard[] - массив выбранных товаров
- total: number - общая сумма заказа

Так же класс предоставляет методы:
- getCard(cardId: string): ICard для получения карточки по id
- deleteItem(id: string): void - для удаления товара из корзины и вызова события изменения корзины
- getCartLength(cart: ICard[]): number - для получения количества товаров в корзине
- addItem(item:ICard) - метод добавления карточки в корзину
- а так же геттеры и сеттеры для получения данных из полей класса
Данные будут передаваться в класс `BasketView` по событию `basket:changed`


### Классы представления

#### Класс Component 
Является базовым абстрактным классом для классов представления.\

constructor(protected readonly container: HTMLElement) - принимает контейнер дочернего класса, сохраняет его в своем поле для последующего рендера в этот контейнер.

Методы:

toggleClass - переключает класс элемента.
setText - устанавливает текстовое содержание.
setDisabled - меняет статус блокировки элемента.
setHidden - скрывает элемент.
setVisible - показывает элемент.
setImage - устанавливает изображение с альтернативным текстом.
render - возвращает корневой DOM-элемент.

#### Класс CardView
Является базовым классом для классов отображения карточек.
Классы принимают в конструктор DOM-элемент шаблона для создания карточки нужного типа (для списка на главной, для модалки и для корзины).
В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия пользователя с которыми генерируются события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор так же принимает экземпляр `EventEmitter` для инициации событий и нужный шаблон карточки в виде HTMLTemplateElement.
Методы:
- setData(cardData: ICard): void - заполняет атрибуты элементов карточки
- render(): HTMLElement - возвращает заполненную карточку с установленными слушателями
- addItem(card: ICard): void - для добавления карточки в корзину кликом по кнопке и вызова события изменения корзины
- checkButtonState(): void - для проверки наличия товара в корзине и цены, чтобы обновлять состояние кнопки добавления

#### Класс Page
Реализует управление отображением каталога товаров и счётчика товаров в корзине. 
- constructor(cardsListContainer: HTMLElement,cardsListTemplate: HTMLTemplateElement, events: IEvents) - Конструктор принимает элемент-контейнер для списка товаров, шаблон разметки списка и экземпляр класса `EventEmitter`.
Поля класса:
- cardsListContainer: HTMLElement - контейнер для списка товаров
- basketButton: HTMLElement - кнопка корзины
- basketItemsCounter - счётчик товаров на иконке корзины
- cardsListTemplate: HTMLTemplateElement - хранит шаблон разметки для списка
Методы:
set cardsList(items:TCardPreview[]): void - собирает список html элементов из объектов карточек
set basketItemsCounter - обновляет значение счётчика товаров в корзине


#### Класс Modal
Реализует модальное окно-контейнер.  Предоставляет методы `open` и `close` для управления отображением модального окна. Метод `close` содержит инструкцию `this._content = null` для удаления обработчиков событий и DOM-элементов и вызов метода `remove()` для удаления разметки. Устанавливает слушатели на клик по оверлею и кнопке закрытия для закрытия окна.
- constructor(selector: string, events: IEvents) - Конструктор принимает селектор , по которому в разметке будет найдено модальное окно(в нашем случаем общий контейнер для всех модальных окон) и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- modal: HTMLElement - хранит элемент модального окна
- events: EventEmitter - брокер событий
- render(content: HTMLElement) - метод рендера контента в модальном окне, контент передаётся параметром из классов представления

#### Класс BasketView
Класс отображения корзины. Принимает в конструктор экземпляр класса `EventEmitter` и шаблон элемента корзины. Так же класс получает массив объектов карточек и сумму заказа от класса `BasketData` при помощи брокера событий.
 Содержит следующие поля:
- basketTemplate: HTMLTemplateElement - шаблон корзины из разметки
- basketItemsList: HTMLElement[] - массив карточек в корзине, собранных по нужному для корзины шаблону
И методы:
- renderBasket(): HTMLElement - возвращает готовую разметку корзины со списком карточек, суммой заказа и установленными обработчиками

#### Класс Form
Является родительским классом для форм. При сабмите инициирует событие , передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сабмита.\
Поля класса:
- formTemplate:HTMLTemplateElement - шаблон формы из разметки
- submitButton:HTMLElement - Кнопка подтверждения
- _form: HTMLElement - элемент формы
- errorElement - элемент для отображения ошибок валидации
Методы:
- setError(inputField: HTMLElement, errorMessage): void - устанавливает сообщение об ошибке поля ввода
- hideInputError(inputField: HTMLElement): void - очищает сообщение об ошибке под указанным полем ввода
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- formReset(): void - очищает поля ввода и выключает кнопку сабмита

#### Класс PaymentForm
Расширяет класс ModalForm, предоставляет форму для заполнения адреса доставки и выбора типа оплаты:
- paymentType: string[] - типы оплаты
- address: string - адрес доставки

#### Класс ContactForm
Расширяет класс ModalForm, предоставляет форму для заполнения номера телефона и почты:
- phone: string - номер телефона
- email: string - почта

#### Класс Success
Класс для создания сообщения об успешном оформлении заказа, хранит поля 
- orderSum: number - сумма заказа, которая приходит в ответе сервера
- successMessage: string - шаблонная строка с сообщением об успешном оформлении, куда будет подставлена сумма заказа.
- acceptButton: HTMLElement - кнопка подтверждения

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы для взаимодействия с бэкендом сервиса

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющим роль презентера. Взаимодействие осуществляется за счёт событий, генерируемых с помощью брокера событий и обработчиков, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список основных событий, которые будут генерироваться в системе*\

*События модели данных*
- `cardsList:changed` - обновление (и начальная загрузка) списка карточек
- `basket:changed` - изменение содержимого корзины
- `card:add` - добавление карточки
- `card:remove` - удаление карточки

*События представления*
- `card:select` - клик на карточку
- `modal:open` - открытие модального окна
- `modal: close` - закрытие модального окна
- `preview:changed` - открытие карточки
- `basket:open` - открытие корзины
- `order:open` - переход в форму заказа (форма с доставкой)
- `order:submit` - переход в форму контактов
- `contacts:submit` - закрытие формы контактов
- `PaymentFormError:change` - изменение состояния валидации формы доставки
- `ContactFormError:change` - изменение состояния валидации формы контактов
- `successMessage:close` - закрытие окна подтверждения покупки
