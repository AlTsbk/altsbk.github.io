import EventEmitter from "./eventEmitter.js";

/**
 * class view
 */
class View extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * renders orders items on sidebar
     * 
     * @param {Object[]} orders - orders for render
     */
    renderOrderItems(orders) {
        const ordersSection = document.querySelector(".orders");
        const countOrders = document.querySelector(".js-count-orders");
        countOrders.textContent = `Orders (${orders.length})`;

        if (orders.length > 0) {
            ordersSection.innerHTML = "";

            orders.forEach((order) => {
                const orderItem = document.createElement("div");
                orderItem.classList.add("order-item");
                orderItem.innerHTML = `<p class="order-number">Order ${order.id}</p>
                                   <p class="order-date">${order.summary.createdAt.slice(0,10)}</p>
                                   <p class="customer-name">${order.summary.customer}</p>
                                   <p class="order-status">${order.summary.status}</p>
                                   <p class="shiped-date">Shipped: ${order.summary.shippedAt}</p>`;

                this.orderStatusColor(orderItem.querySelector(".order-status"));
                ordersSection.appendChild(orderItem);
                this.chooseOrderItemEvent();
            });

        } else {
            const message = document.createElement("div");
            message.innerHTML = `<p class="no-orders-text">no orders</p>`;
            message.classList.add("no-orders-message");
            ordersSection.innerHTML = "";
            ordersSection.appendChild(message);
        }
    }

    /**
     * chooses color of order status
     * 
     * @param {string} orderStatus - order status 
     */
    orderStatusColor(orderStatus) {
        switch (orderStatus.textContent.toLowerCase()) {
            case "pending":
                orderStatus.classList.add("pending-status");
                break;
            case "too late":
                orderStatus.classList.add("too-late-status");
                break;
            default:
                orderStatus.classList.add("accept-status");
                break;
        }
    }

    /**
     * renders order info
     * 
     * @param {Object[]} orders - orders
     */
    renderOrder(orders) {
        const information = document.querySelector(".information");
        const noOrderInfo = document.querySelector(".no-order-info");

        if (orders.length > 0) {
            const urlAddress = document.location.hash;
            const orderItemsId = document.querySelectorAll(".order-number");
            information.classList.remove('display-none');
            information.classList.add('display-block');
            noOrderInfo.classList.add('display-none');

            if (urlAddress.slice(1) != "") {

                let orderExist = false;

                orderItemsId.forEach(orderItemId => {
                    if (orderItemId.textContent.slice(6) == urlAddress.slice(1)) {
                        orderItemId.parentNode.classList.add("order-item-active");
                    }
                });

                orders.forEach(order => {
                    if (order.id == urlAddress.slice(1)) {
                        this.renderInformation(order);
                        orderExist = true;
                    }
                });

                if (!orderExist) {
                    this.showNotFoundPage(urlAddress.slice(1));
                }

            } else {
                this.renderInformation(orders[0]);
                orderItemsId[0].parentNode.classList.add("order-item-active");
                document.location.hash = `#${orders[0].id}`;
            }
        } else {
            information.classList.add('display-none');
            noOrderInfo.classList.remove('display-none');
            noOrderInfo.classList.add('display-flex');
        }
    }

    /**
     * shows "not found page"
     * 
     * @param {string} orderId - order id 
     */
    showNotFoundPage(orderId) {
        const notFoundPage = document.querySelector(".not-found-page");
        const content = document.querySelector(".container");
        const notFoundOrder = document.querySelector(".not-found-order");

        content.classList.add('display-none');
        notFoundPage.classList.remove('display-none');
        notFoundPage.classList.add('display-flex');
        notFoundOrder.textContent = `Order ${orderId} does not exist`;
    }

    /**
     * renders information about order
     * 
     * @param {object} order - order for render 
     */
    renderInformation(order) {
        //render order info
        this.renderOrderInfo(order);

        //render shipping address
        this.renderShippingAddress(order)

        //render details
        this.renderDetails(order);

        //render table
        this.renderLineItems(order.products);
    }

    /**
     * renders part "Order Info"
     * 
     * @param {order} order - order for render
     */
    renderOrderInfo(order) {
        const orderInfoNumber = document.querySelector(".order-info-number");
        const orderInfoCustomer = document.querySelector(".order-info-customer");
        const orderInfoOrdered = document.querySelector(".order-info-ordered");
        const orderInfoShiped = document.querySelector(".order-info-shiped");
        const orderInfoPrice = document.querySelector(".order-info-price");
        const orderInfoCurrency = document.querySelector(".order-info-currency");
        let orderPrice = 0;
        if (order.products.length > 0) {
            orderPrice = order.products.map((product) => {
                return +product.totalPrice;
            }).reduce((sum, current) => {
                return sum + current;
            });
        }

        orderInfoNumber.textContent = `Order ${order.id}`;
        orderInfoCustomer.textContent = `Customer: ${order.summary.customer}`;
        orderInfoOrdered.textContent = `Ordered: ${order.summary.createdAt}`;
        orderInfoShiped.textContent = `Shipped: ${order.summary.shippedAt}`;
        orderInfoPrice.textContent = orderPrice;
        if (order.products.length > 0) {
            orderInfoCurrency.textContent = order.products[0].currency;
        }
    }

    /**
     * renders part "Shipping Addres"
     * 
     * @param {order} order - order for render
     */
    renderShippingAddress(order) {
        const name = document.querySelectorAll(".js-name");
        const address = document.querySelectorAll(".js-street");
        const zipCode = document.querySelectorAll(".js-zip-code");
        const region = document.querySelectorAll(".js-region");
        const country = document.querySelectorAll(".js-country");

        name.forEach((e) => {
            e.textContent = order.shipTo.name;
        });
        address.forEach((e) => {
            e.textContent = order.shipTo.address;
        });
        zipCode.forEach((e) => {
            e.textContent = order.shipTo.ZIP;
        });
        region.forEach((e) => {
            e.textContent = order.shipTo.region;
        });
        country.forEach((e) => {
            e.textContent = order.shipTo.country;
        });
    }

    /**
     * renders part "Details"
     * 
     * @param {order} order - order for render 
     */
    renderDetails(order) {
        const customerName = document.querySelectorAll(".js-customer-name");
        const customerAddress = document.querySelectorAll(".js-customer-address");
        const customerPhone = document.querySelectorAll(".customer-phone");
        const customerEmail = document.querySelectorAll(".js-customer-email");

        customerName.forEach((e) => {
            e.textContent = order.customerInfo.firstName + " " + order.customerInfo.lastName;
        });
        customerAddress.forEach((e) => {
            e.textContent = order.customerInfo.address;
        });
        customerPhone.forEach((e) => {
            e.textContent = order.customerInfo.phone;
        });
        customerEmail.forEach((e) => {
            e.textContent = order.customerInfo.email;
        });
    }

    /**
     * renders part "Line Items"
     * 
     * @param {object[]} products - products for render 
     */
    renderLineItems(products) {
        const noProducts = document.querySelector(".no-products");
        const lineItemsContent = document.querySelector(".js-line-items-content");
        const countItems = document.querySelector(".count-items");

        countItems.textContent = `Line Items(${products.length})`;

        if (products.length > 0) {
            lineItemsContent.classList.remove('display-none');
            lineItemsContent.classList.add('display-block');
            noProducts.classList.add('display-none');

            this.renderTable(products);
        } else {
            lineItemsContent.classList.add('display-none');
            noProducts.classList.remove('display-none');
            noProducts.classList.add('display-flex');
        }
    }

    /**
     * renders table in "Line Items"
     * 
     * @param {Object[]} products - products for render 
     */
    renderTable(products) {
        const tableContent = document.querySelector(".table-content");

        tableContent.innerHTML = "";

        products.forEach((product) => {
            const row = document.createElement("tr");
            row.classList.add("product-item");

            row.innerHTML = `<td class="product-row"><b>${product.name}</b><p>${product.id}</p></td>
                             <td data-label="Unit Price:" class="product-row"><p><b>${product.price}</b> ${product.currency}</p></td>
                             <td data-label="Quantity:" class="product-row">${product.quantity}</td>
                             <td data-label="Total:" class="product-row"><p><b>${product.totalPrice}</b> ${product.currency}</p></td>
                             <td class="delete-btn product-row"><i class="fa fa-trash-o" aria-hidden="true"></i></td>`;

            row.querySelector(".delete-btn").addEventListener("click", () => {
                this.confirmAction("deleteProduct", product);
            });
            tableContent.appendChild(row);
        });
    }

    /**
     * adds event listeners for switch tabs "Map", "Details" and "Shipping Address"
     */
    switchTabsInOrder() {
        const shippingAddressIcon = document.querySelector(".shipping-address-icon");
        const customerInfIcon = document.querySelector(".customer-inf-icon");
        const mapIcon = document.querySelector(".map-icon");
        const shippingAddress = document.querySelector(".shipping-address");
        const customerInformation = document.querySelector(".customer-information");
        const map = document.querySelector("#map");

        mapIcon.addEventListener("click", this.clickOnIcon.bind(event, mapIcon, map));

        shippingAddressIcon.addEventListener("click", this.clickOnIcon.bind(event, shippingAddressIcon, shippingAddress));

        customerInfIcon.addEventListener("click", this.clickOnIcon.bind(event, customerInfIcon, customerInformation));
    }

    /**
     * switching tabs function
     * 
     * @param {Object} icon - clicked icon 
     * @param {Object} tab - tab for display
     */
    clickOnIcon(icon, tab) {
        const shippingAddress = document.querySelector(".shipping-address");
        const customerInformation = document.querySelector(".customer-information");
        const map = document.querySelector("#map");
        const activeIcon = document.querySelector(".active-icon");

        customerInformation.classList.add('display-none');
        map.classList.add('display-none');
        shippingAddress.classList.add('display-none');
        activeIcon.classList.remove("active-icon");
        icon.parentNode.classList.add("active-icon");
        tab.classList.remove('display-none');
        tab.classList.add('display-block');
    }

    /**
     * initialization yandex map
     */
    initMap(res) {
        let myMap;

        this.clearMap();

        myMap = new ymaps.Map("map", {
            center: res.geoObjects.get(0).geometry.getCoordinates(),
            zoom: 10
        });
        myMap.geoObjects.add(res.geoObjects);
    }

    clearMap() {
        let mapContainer = document.querySelector("#map");
        mapContainer.innerHTML = " ";
    }


    /**
     * number validations
     * 
     * @param {Object} input - input for validation 
     * @returns {boolean}
     */
    validateNumber(input) {
        if (input.value == "" || Number.isNaN(+input.value)) {
            input.classList.remove("correct-validation");
            input.classList.add("wrong-validation");
            return false;
        } else {
            input.classList.remove("wrong-validation");
            input.classList.add("correct-validation");
            return true;
        }
    }

    /**
     * email validation
     * 
     * @param {Object} input - input for validation 
     * @returns {boolean}
     */
    validateEmail(input) {
        let email = new RegExp("^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$");
        if (!email.test(input.value)) {
            input.classList.remove("correct-validation");
            input.classList.add("wrong-validation");
            return false;
        } else {
            input.classList.remove("wrong-validation");
            input.classList.add("correct-validation");
            return true;
        }
    }

    /**
     * text validation
     * 
     * @param {Object} input - input for validation
     * @returns {boolean} 
     */
    validateText(input) {
        if (input.value == "") {
            input.classList.remove("correct-validation");
            input.classList.add("wrong-validation");
            return false;
        } else {
            input.classList.remove("wrong-validation");
            input.classList.add("correct-validation");
            return true;
        }
    }

    /**
     * tel validation
     * 
     * @param {Object} input - input for validation 
     * @returns {boolean}
     */
    validateTel(input) {
        const minPhoneNumberLength = 7;
        if (input.value.length < minPhoneNumberLength) {
            input.classList.remove("correct-validation");
            input.classList.add("wrong-validation");
            return false;
        } else {
            input.classList.remove("wrong-validation");
            input.classList.add("correct-validation");
            return true;
        }
    }

    /**
     * cleans inputs in window
     * 
     * @param {object} window - window for clean 
     */
    cleanFields(window) {
        const fields = window.querySelectorAll(".fields-input")
        fields.forEach((field) => {
            field.value = "";
        });
    }

    /**
     * adds event listeners for add new product
     */
    addNewProduct() {
        const closeBtn = document.querySelector(".js-close-cpw");
        const popupWindow = document.querySelector(".popup-window");
        const addBtn = document.querySelector(".add-product-btn");
        const createProductWindow = document.querySelector(".create-product-window");
        const createBtn = document.querySelector(".js-create-product-btn");

        /**
         * closes window "add new product"
         */
        closeBtn.addEventListener("click", () => {
            popupWindow.classList.add('display-none');
            createProductWindow.classList.add('display-none');
            this.cleanFields(createProductWindow);
        });

        /**
         * opens window "add new product"
         */
        addBtn.addEventListener("click", () => {
            popupWindow.classList.remove('display-none');
            popupWindow.classList.add('display-flex');
            createProductWindow.classList.remove('display-none');
            createProductWindow.classList.add('display-flex');
        });

        /**
         * calls function for create new product and closes window "add new product"
         */
        createBtn.addEventListener("click", () => {
            if (this.createProduct()) {
                this.emit("createProduct");
                popupWindow.classList.add('display-none');
                createProductWindow.classList.add('display-none');
                this.cleanFields(createProductWindow);
            }
        });
    }

    /**
     * creates new product
     * @returns {object} - new product
     */
    createProduct() {
        const productName = document.querySelector(".js-new-product-name");
        const productPrice = document.querySelector(".js-new-product-price");
        const productCurrency = document.querySelector(".js-new-product-currency");
        const productQuantity = document.querySelector(".js-new-product-quantity");
        const productTotalPrice = document.querySelector(".js-new-product-total-price");
        const orderId = document.querySelector(".order-info-number").textContent.slice(6);
        const validation = this.validateText(productName) && this.validateNumber(productPrice) && this.validateText(productCurrency) &&
            this.validateNumber(productQuantity) && this.validateNumber(productTotalPrice);

        if (validation) {
            return {
                "name": productName.value,
                "price": productPrice.value,
                "currency": productCurrency.value,
                "quantity": productQuantity.value,
                "totalPrice": productTotalPrice.value,
                "orderId": orderId
            }
        } else {
            return false;
        }
    }

    /**
     * adds event listener for search button
     */
    searchProductBtn() {
        const searchBtn = document.querySelector(".js-table-search-btn");

        /**
         * calls function for search products
         */
        searchBtn.addEventListener("click", () => {
            this.emit("searchProduct");
        });
    }

    /**
     * @returns {string} - search request
     */
    searchProducts() {
        return document.querySelector(".product-search").value;
    }

    /**
     * @returns {string} - id of current order
     */
    getCurrentOrderId() {
        return document.querySelector(".order-info-number").textContent.slice(6);
    }

    /**
     * calls function for sort table
     */
    sortTable() {
        this.sortTableByNameAsc();
        this.sortTableByNameDesc();
        this.resetSortTableByName();
        this.sortTableByUnitPriceAsc();
        this.sortTableByUnitPriceDesc();
        this.resetSortTableByUnitPrice();
        this.sortTableByTotalPriceAsc();
        this.sortTableByTotalPriceDesc();
        this.resetSortTableByTotalPrice();
    }

    /**
     * adds event listener for sort table by name ascending 
     */
    sortTableByNameAsc() {
        const ascProductSort = document.querySelector(".asc-product-sort");
        const descProductSort = document.querySelector(".desc-product-sort");

        /**
         * calls fucntion for sortTable
         */
        ascProductSort
            .addEventListener("click", () => {
                ascProductSort.classList.add('display-none');
                descProductSort.classList.remove('display-none');
                descProductSort.classList.add('display-block');
                this.emit("sortTableAscending", "name");
            });
    }

    /**
     * adds event listener for sort table by name descending 
     */
    sortTableByNameDesc() {
        const descProductSort = document.querySelector(".desc-product-sort");
        const resetProductSort = document.querySelector(".reset-product-sort");

        /**
         * calls fucntion for sortTable
         */
        descProductSort
            .addEventListener("click", () => {
                descProductSort.classList.add('display-none');
                resetProductSort.classList.remove('display-none');
                resetProductSort.classList.add('display-block');
                this.emit("sortTableDescending", "name");
            });
    }

    /**
     * adds event listener reset sort table by name
     */
    resetSortTableByName() {
        const resetProductSort = document.querySelector(".reset-product-sort");
        const ascProductSort = document.querySelector(".asc-product-sort");

        /**
         * calls function for resetSort
         */
        resetProductSort.addEventListener("click",()=>{
            resetProductSort.classList.add('display-none');
            ascProductSort.classList.remove('display-none');
            ascProductSort.classList.add('display-block');
            this.emit("searchProduct");
        });
    }

    /**
     * adds event listener for sort table by unit price ascending 
     */
    sortTableByUnitPriceAsc() {
        const ascUnitPriceSort = document.querySelector(".asc-unit-price-sort");
        const descUnitPriceSort = document.querySelector(".desc-unit-price-sort");

        /**
         * calls fucntion for sortTable
         */
        ascUnitPriceSort
            .addEventListener("click", () => {
                ascUnitPriceSort.classList.add('display-none');
                descUnitPriceSort.classList.remove('display-none');
                descUnitPriceSort.classList.add('display-block');
                this.emit("sortTableAscending", "price");
            });
    }

    /**
     * adds event listener for sort table by unit price descending 
     */
    sortTableByUnitPriceDesc() {
        const descUnitPriceSort = document.querySelector(".desc-unit-price-sort");
        const resetUnitPriceSort = document.querySelector(".reset-unit-price-sort");

        /**
         * calls fucntion for sortTable
         */
        descUnitPriceSort
            .addEventListener("click", () => {
                descUnitPriceSort.classList.add('display-none');
                resetUnitPriceSort.classList.remove('display-none');
                resetUnitPriceSort.classList.add('display-block');
                this.emit("sortTableDescending", "price");
            });
    }

     /**
     * adds event listener reset sort table by unit price
     */
    resetSortTableByUnitPrice() {
        const resetUnitPriceSort = document.querySelector(".reset-unit-price-sort");
        const ascUnitPriceSort = document.querySelector(".asc-unit-price-sort");

        /**
         * calls function for resetSort
         */
        resetUnitPriceSort.addEventListener("click",()=>{
            resetUnitPriceSort.classList.add('display-none');
            ascUnitPriceSort.classList.remove('display-none');
            ascUnitPriceSort.classList.add('display-block');
            this.emit("searchProduct");
        });
    }

    /**
     * adds event listener for sort table by total price ascending 
     */
    sortTableByTotalPriceAsc() {
        const ascTotalPriceSort = document.querySelector(".asc-total-price-sort");
        const descTotalPriceSort = document.querySelector(".desc-total-price-sort");

        /**
         * calls fucntion for sortTable
         */
        ascTotalPriceSort
            .addEventListener("click", () => {
                ascTotalPriceSort.classList.add('display-none');
                descTotalPriceSort.classList.remove('display-none');
                descTotalPriceSort.classList.add('display-block');
                this.emit("sortTableAscending", "totalPrice");
            });
    }

    /**
     * adds event listener for sort table by total price descending 
     */
    sortTableByTotalPriceDesc() {
        const descTotalPriceSort = document.querySelector(".desc-total-price-sort");
        const resetTotalPriceSort = document.querySelector(".reset-total-price-sort");

        /**
         * calls fucntion for sortTable
         */
        descTotalPriceSort
            .addEventListener("click", () => {
                descTotalPriceSort.classList.add('display-none');
                resetTotalPriceSort.classList.remove('display-none');
                resetTotalPriceSort.classList.add('display-block');
                this.emit("sortTableDescending", "totalPrice");
            });
    }

    /**
     * adds event listener reset sort table by total price
     */
    resetSortTableByTotalPrice() {
        const resetTotalPriceSort = document.querySelector(".reset-total-price-sort");
        const ascTotalPriceSort = document.querySelector(".asc-total-price-sort");

        /**
         * calls function for resetSort
         */
        resetTotalPriceSort.addEventListener("click",()=>{
            resetTotalPriceSort.classList.add('display-none');
            ascTotalPriceSort.classList.remove('display-none');
            ascTotalPriceSort.classList.add('display-block');
            this.emit("searchProduct");
        });
    }

    /**
     * adds event listeners for add new order
     */
    addNewOrder() {
        const closeBtn = document.querySelector(".js-close-cow");
        const createOrderWindow = document.querySelector(".create-order-window");
        const popupWindow = document.querySelector(".popup-window");
        const addBtn = document.querySelector(".js-add-order-btn");
        const createBtn = document.querySelector(".js-create-order-btn");

        /**
         * opens window "add new order"
         */
        addBtn.addEventListener("click", () => {
            popupWindow.classList.remove('display-none');
            popupWindow.classList.add('display-flex');
            createOrderWindow.classList.remove('display-none');
            createOrderWindow.classList.add('display-flex');
        });

        /**
         * closes window "add new order"
         */
        closeBtn.addEventListener("click", () => {
            popupWindow.classList.add('display-none');
            createOrderWindow.classList.add('display-none');
            this.cleanFields(createOrderWindow);
        });

        /**
         * calls function for create new order
         */
        createBtn.addEventListener("click", () => {
            if (this.createSummary() && this.createShipTo() && this.createCustomerInfo()) {
                this.emit("createOrder");
                popupWindow.classList.add('display-none');
                createOrderWindow.classList.add('display-none');
                this.cleanFields(createOrderWindow);
            }

        });
    }

    /**
     * creates part "summary" of new order
     * @returns {(Object|boolean)} - new "summary" or false
     */
    createSummary() {
        const customer = document.querySelector(".js-new-order-customer");
        const orderStatus = document.querySelector(".js-new-order-status");
        const shipped = document.querySelector(".js-new-order-shipped");
        const currency = document.querySelector(".js-new-order-currency");
        const createdAt = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
        const validation = this.validateText(customer) && this.validateText(orderStatus) && this.validateText(shipped) &&
            this.validateText(currency);

        if (validation) {
            return {
                "createdAt": createdAt,
                "customer": customer.value,
                "status": orderStatus.value,
                "shippedAt": shipped.value,
                "currency": currency.value
            }
        } else {
            return false;
        }
    }

    /**
     * creates part "ship to" of new order
     * @returns {(Object|boolean)} - new "ship to" or false
     */
    createShipTo() {
        const name = document.querySelector(".js-new-order-name");
        const address = document.querySelector(".js-new-order-ship-to-address");
        const orderZIP = document.querySelector(".js-new-order-ZIP");
        const region = document.querySelector(".js-new-order-region");
        const country = document.querySelector(".js-new-order-country");
        const validation = this.validateText(name) && this.validateText(address) && this.validateNumber(orderZIP) && this.validateText(region) &&
            this.validateText(country);

        if (validation) {
            return {
                "name": name.value,
                "address": address.value,
                "ZIP": orderZIP.value,
                "region": region.value,
                "country": country.value
            }
        } else {
            return false;
        }
    }

    /**
     * creates part "customer info" of new order
     * @returns {(Object|boolean)} - new "customer info" of false
     */
    createCustomerInfo() {
        const firstName = document.querySelector(".js-new-order-first-name");
        const lastName = document.querySelector(".js-new-order-last-name");
        const address = document.querySelector(".js-new-order-customer-address");
        const phone = document.querySelector(".js-new-order-phone");
        const email = document.querySelector(".js-new-order-email");
        let validation = this.validateText(firstName) && this.validateText(lastName) && this.validateText(address) && this.validateTel(phone) &&
            this.validateEmail(email);

        if (validation) {
            return {
                "firstName": firstName.value,
                "lastName": lastName.value,
                "address": address.value,
                "phone": phone.value,
                "email": email.value
            }
        } else {
            return false;
        }
    }

    /**
     * adds event listener for delete btn for orders
     */
    deleteOrder() {
        const deleteBtn = document.querySelector(".delete-order-btn");

        deleteBtn.addEventListener("click", () => {
            this.confirmAction("deleteOrder");
        });
    }

    /**
     * adds event lister for switch orders
     */
    chooseOrderItemEvent() {
        const orderItems = document.querySelectorAll(".order-item");

        /**
         * calls function for choose order item
         */
        orderItems.forEach(orderItem => {
            orderItem.addEventListener("click", () => {
                this.emit("chooseOrderItem", orderItem);
            });
        });
    }

    /**
     * switching orders
     * 
     * @param {Object[]} orders - orders
     * @param {Object} orderItem - selected order item
     */
    chooseOrderItem(orders, orderItem) {
        const activeOrder = document.querySelector(".order-item-active");

        if (activeOrder) {
            activeOrder.classList.remove("order-item-active");
        }

        orderItem.classList.add("order-item-active");

        orders.forEach((order) => {
            if (orderItem.querySelector(".order-number").textContent == `Order ${order.id}`) {
                this.renderInformation(order);
                document.location.hash = `#${order.id}`;
            }
        });
    }


    /**
     * adds event listeners for search order
     */
    searchOrdersEvent() {
        const searchBtn = document.querySelector(".js-search-btn");
        const refreshBtn = document.querySelector(".js-refresh-btn");

        /**
         * calls function for search order
         */
        searchBtn.addEventListener("click", () => {
            this.emit("searchOrders");
        });

        /**
         * calls function for refresh search
         */
        refreshBtn.addEventListener("click", () => {
            document.querySelector(".order-search").value = "";
            this.emit("searchOrders");
        });
    }

    /**
     * @returns {string} search request
     */
    searchOrders() {
        return document.querySelector(".order-search").value;
    }


    /**
     * gets DOM object styles 
     * 
     * @param {object} e - DOM object
     * @returns {object} - DOM objects style  
     */
    getCssStyle(e) {
        if (e.currentStyle) {
            return e.currentStyle;
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(e, null);
        }
    }

    /**
     * gets value from input
     * 
     * @param {Object[]} inputs - inputs
     * @returns {string} - value from input
     */
    getValueFromInput(inputs) {
        let value = "";
        inputs.forEach(input => {
            if (this.getCssStyle(input.parentNode.parentNode).display != "none") {
                value = input.value;
            }
        });
        return value;
    }

    /**
     * shows inputs and hides fields
     * 
     * @param {Object[]} fields - fields for hide 
     * @param {Object[]} inputs - inputs for show
     */
    showInputs(fields, inputs) {
        fields.forEach(field => {
            field.classList.add('display-none')
        });
        inputs.forEach(input => {
            input.value = fields[0].textContent;
            input.classList.remove('display-none');
            input.classList.add('display-block');
        });
    }

    /**
     * adds event listeners for change info in "shipping address"
     */
    changeShippingAddress() {
        const editBtn = document.querySelector(".js-edit-shipping-address");
        const saveBtn = document.querySelector(".js-save-shipping-address");
        const closeBtn = document.querySelector(".js-close-shipping-address");

        /**
         * calls function for turns on edit mode
         */
        editBtn.addEventListener("click", () => {
            editBtn.classList.add('display-none');
            saveBtn.classList.remove('display-none');
            saveBtn.classList.add('display-block');
            closeBtn.classList.remove('display-none');
            closeBtn.classList.add('display-block');
            this.editShippingAddress();
        });

        /**
         * calls function for save changes and function for turns off edit mode
         */
        saveBtn.addEventListener("click", () => {
            saveBtn.classList.add('display-none');
            closeBtn.classList.add('display-none');
            editBtn.classList.remove('display-none');
            editBtn.classList.add('display-block');
            this.emit("changeShippingAddress");
            this.closeShippingAddress();
        });

        /**
         * calls function for turns off edit mod without saving
         */
        closeBtn.addEventListener("click", () => {
            saveBtn.classList.add('display-none');
            closeBtn.classList.add('display-none');
            editBtn.classList.remove('display-none');
            editBtn.classList.add('display-block');
            this.closeShippingAddress();
        });
    }

    /**
     * enables editing mode in "shipping addres"
     */
    editShippingAddress() {
        const names = document.querySelectorAll(".js-name");
        const nameInputs = document.querySelectorAll(".js-name-input");
        const streets = document.querySelectorAll(".js-street");
        const streetInputs = document.querySelectorAll(".js-street-input");
        const zipCodes = document.querySelectorAll(".js-zip-code");
        const zipCodeInputs = document.querySelectorAll(".js-zip-code-input");
        const regions = document.querySelectorAll(".js-region");
        const regionInputs = document.querySelectorAll(".js-region-input");
        const countrys = document.querySelectorAll(".js-country");
        const countryInputs = document.querySelectorAll(".js-country-input");

        this.showInputs(names, nameInputs);
        this.showInputs(streets, streetInputs);
        this.showInputs(zipCodes, zipCodeInputs);
        this.showInputs(regions, regionInputs);
        this.showInputs(countrys, countryInputs);
    }

    /**
     * saving changing in "shipping address"  
     * 
     * @param {Object[]} orders - orders
     * @returns {Object} - edited order
     */
    saveChangesShippingAddress(orders) {
        const nameInputs = document.querySelectorAll(".js-name-input");
        const streetInputs = document.querySelectorAll(".js-street-input");
        const zipCodeInputs = document.querySelectorAll(".js-zip-code-input");
        const regionInputs = document.querySelectorAll(".js-region-input");
        const countryInputs = document.querySelectorAll(".js-country-input");

        let newOrder = {};
        orders.forEach(order => {
            if (order.id == this.getCurrentOrderId()) {
                order.shipTo.name = this.getValueFromInput(nameInputs);
                order.shipTo.address = this.getValueFromInput(streetInputs);
                order.shipTo.ZIP = this.getValueFromInput(zipCodeInputs);
                order.shipTo.region = this.getValueFromInput(regionInputs);
                order.shipTo.country = this.getValueFromInput(countryInputs);

                newOrder = order;
            }
        });
        return newOrder;
    }

    /**
     * turns off edit mode without saving
     */
    closeShippingAddress() {
        const names = document.querySelectorAll(".js-name");
        const streets = document.querySelectorAll(".js-street");
        const zipCodes = document.querySelectorAll(".js-zip-code");
        const regions = document.querySelectorAll(".js-region");
        const countrys = document.querySelectorAll(".js-country");
        const inputs = document.querySelectorAll(".shipping-address input");

        inputs.forEach(input => {
            input.classList.add('display-none');
        });
        names.forEach(name => {
            name.classList.remove('display-none');
            name.classList.add('display-block');
        })
        streets.forEach(street => {
            street.classList.remove('display-none');
            street.classList.add('display-block');
        });
        zipCodes.forEach(code => {
            code.classList.remove('display-none');
            code.classList.add('display-block');
        });
        regions.forEach(region => {
            region.classList.remove('display-none');
            region.classList.add('display-block');
        });
        countrys.forEach(country => {
            country.classList.remove('display-none');
            country.classList.add('display-block');
        });
    }

    /**
     * adds event listeners for change info in "customer information"
     */
    changeCustomerInf() {
        const editBtn = document.querySelector(".js-edit-customer-inf");
        const saveBtn = document.querySelector(".js-save-customer-inf");
        const closeBtn = document.querySelector(".js-close-customer-inf");

        /**
         * calls function for turns on editing mode in "customer info"
         */
        editBtn.addEventListener("click", () => {
            editBtn.classList.add('display-none');
            closeBtn.classList.remove('display-none');
            closeBtn.classList.add('display-block');
            saveBtn.classList.remove('display-none');
            saveBtn.classList.add('display-block');
            this.editCustomerInf();
        });

        /**
         * calls function for save changes and function for turns off edit mode
         */
        saveBtn.addEventListener("click", () => {
            closeBtn.classList.add('display-none');
            saveBtn.classList.add('display-none');
            editBtn.classList.remove('display-none');
            editBtn.classList.add('display-block');
            this.emit("changeCustomerInf");
            this.closeCustomerInf();
        });

        /**
         * calls function for turns off edit mode without saving
         */
        closeBtn.addEventListener("click", () => {
            closeBtn.classList.add('display-none');
            saveBtn.classList.add('display-none');
            editBtn.classList.remove('display-none');
            editBtn.classList.add('display-block');
            this.closeCustomerInf();
        });
    }

    /**
     * enables editing mode in "customer info"
     */
    editCustomerInf() {
        const names = document.querySelectorAll(".js-customer-name");
        const nameInputs = document.querySelectorAll(".js-customer-name-input");
        const addresses = document.querySelectorAll(".js-customer-address");
        const addressInputs = document.querySelectorAll(".js-customer-address-input");
        const phones = document.querySelectorAll(".customer-phone");
        const phoneInputs = document.querySelectorAll(".js-customer-phone-input");
        const emails = document.querySelectorAll(".js-customer-email");
        const emailInputs = document.querySelectorAll(".js-customer-email-input");

        this.showInputs(names, nameInputs);
        this.showInputs(addresses, addressInputs);
        this.showInputs(phones, phoneInputs);
        this.showInputs(emails, emailInputs);
    }

    /**
     * create new order with changes in "customer information"
     * 
     * @param {Object[]} orders - orders
     * @returns {Object} - changes order
     */
    saveChangesCustomerInf(orders) {
        const nameInputs = document.querySelectorAll(".js-customer-name-input");
        const addressInputs = document.querySelectorAll(".js-customer-address-input");
        const phoneInputs = document.querySelectorAll(".js-customer-phone-input");
        const emailInputs = document.querySelectorAll(".js-customer-email-input");
        let newOrder = {};
        orders.forEach(order => {
            if (order.id == this.getCurrentOrderId()) {
                const name = this.getValueFromInput(nameInputs);
                order.customerInfo.firstName = name.slice(0, name.indexOf(" "));
                order.customerInfo.lastName = name.slice(name.indexOf(" ")+1);
                order.customerInfo.address = this.getValueFromInput(addressInputs);
                order.customerInfo.phone = this.getValueFromInput(phoneInputs);
                order.customerInfo.email = this.getValueFromInput(emailInputs);

                newOrder = order;
            }
        });

        return newOrder;
    }

    /**
     * turns off edit mode without saving
     */
    closeCustomerInf() {
        const names = document.querySelectorAll(".js-customer-name");
        const addresses = document.querySelectorAll(".js-customer-address");
        const phones = document.querySelectorAll(".customer-phone");
        const emails = document.querySelectorAll(".js-customer-email");
        const inputs = document.querySelectorAll(".customer-information input");

        inputs.forEach(input => {
            input.classList.add('display-none');
        });

        names.forEach(name => {
            name.classList.remove('display-none');
            name.classList.add('display-block');
        });
        addresses.forEach(address => {
            address.classList.remove('display-none');
            address.classList.add('display-block');
        });
        phones.forEach(phone => {
            phone.classList.remove('display-none');
            phone.classList.add('display-block');
        });
        emails.forEach(email => {
            email.classList.remove('display-none');
            email.classList.add('display-block');
        });
    }

    /**
     * shows confirm window
     * 
     * @param {function} event - function 
     * @param {*} arg - argument
     */
    confirmAction(event, arg) {
        const popupWindow = document.querySelector(".popup-window");
        const confirmWindow = document.querySelector(".confirm-window");
        const yesBtn = document.querySelector(".yes-btn");
        const noBtn = document.querySelector(".no-btn");

        popupWindow.classList.remove('display-none');
        popupWindow.classList.add('display-flex');
        confirmWindow.classList.remove('display-none');
        confirmWindow.classList.add('display-flex');

        /**
         * closes confirm window
         */
        noBtn.addEventListener("click", () => {
            popupWindow.classList.add('display-none');
            confirmWindow.classList.add('display-none');
        });

        /**
         * confirms action and closes confirm window
         */
        yesBtn.addEventListener("click", () => {
            popupWindow.classList.add('display-none');
            confirmWindow.classList.add('display-none');
            this.emit(event, arg);
        })
    }

    /**
     * shows sidebar in mobile version
     */
    showSidebar() {
        let showBtn = document.querySelector(".show-sidebar-btn");
        let sidebar = document.querySelector(".sidebar");
        let hiddenBtn = document.querySelector(".hidden-sidebar-btn")

        /**
         * shows sidebar
         */
        showBtn.addEventListener("click", () => {
            sidebar.classList.remove('display-none');
            sidebar.classList.add('display-flex');
            showBtn.classList.add('display-none');
            sidebar.classList.add('position-absolute');;
        });

        /**
         * hiddens sidebar
         */
        hiddenBtn.addEventListener("click", () => {
            sidebar.classList.add('display-none');
            showBtn.classList.remove('display-none');
            showBtn.classList.add('display-block');
        })
    }

}
export default View;