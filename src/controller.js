/**
 * class controller
 */
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initFunctions();
        this.view.on("createProduct", this.createNewProduct.bind(this));
        this.view.on("deleteProduct", this.deleteProduct.bind(this));
        this.view.on("searchProduct", this.searchProducts.bind(this));
        this.view.on("sortTableAscending", this.sortTableAscending.bind(this));
        this.view.on("sortTableDescending", this.sortTableDescending.bind(this));
        this.view.on("createOrder", this.createNewOrder.bind(this));
        this.view.on("deleteOrder", this.deleteOrder.bind(this));
        this.view.on("chooseOrderItem", this.chooseOrderItem.bind(this));
        this.view.on("searchOrders", this.searchOrders.bind(this));
        this.view.on("changeShippingAddress", this.changeShippingAddress.bind(this));
        this.view.on("changeCustomerInf", this.changeCustomerInf.bind(this));
    }

    /**
     * update order items
     * 
     * @param {Object[]} orders - orders
     */
    updateOrderItems(orders) {
        this.view.renderOrderItems(orders);
        this.view.renderOrder(orders);
        this.initMap(orders);
    }

    /**
     * calls functions for satrt work 
     */
    initFunctions() {
        this.model.getOrders().then(data => {
            this.updateOrderItems(data);
            this.view.switchTabsInOrder();
            this.view.addNewProduct();
            this.view.searchProductBtn();
            this.view.sortTable();
            this.view.addNewOrder();
            this.view.deleteOrder();
            this.view.searchOrdersEvent();
            this.view.changeShippingAddress();
            this.view.changeCustomerInf();
            this.view.showSidebar();
        });
    }

    /**
     * creates new product
     */
    createNewProduct() {
        let orderId = this.view.getCurrentOrderId();
        let product = this.view.createProduct();
        if (product) {
            this.model.postData(`OrderProducts`, product).then(() => {
                return this.model.getOrders();
            }).then(data => {
                data.forEach((order) => {
                    if (order.id == orderId) {
                        this.view.renderOrderInfo(order);
                        this.view.renderLineItems(order.products);
                    }
                });
            });
        }
    }

    /**
     * deletes product
     * 
     * @param {Object} product - product 
     */
    deleteProduct(product) {
        let orderId = this.view.getCurrentOrderId();
        this.model.deleteData(`orderProducts/${product.id}`).then(() => {
            return this.model.getOrders();
        }).then(orders => {
            orders.forEach((order) => {
                if (order.id = orderId) {
                    this.view.renderOrderInfo(order);
                    this.view.renderLineItems(order.products);
                }
            });
        });
    }

    /**
     * shows searched products
     * @returns {Object[]} - searched products
     */
    searchProducts() {
        let orderId = this.view.getCurrentOrderId();
        let searchProduct = this.view.searchProducts();
        return this.model.serachProducts(searchProduct, orderId).then(result => {
            this.view.renderLineItems(result);
            return result;
        });
    }

    /**
     * shows sorted table ascending
     * 
     * @param {string} param - sortable field
     */
    sortTableAscending(param) {
        this.searchProducts().then((products) => {
            const resultOfSort = this.model.sortTableAscending(param, products);
            this.view.renderLineItems(resultOfSort);
        });
    }

    /**
     * shows sorted table descending
     * 
     * @param {string} param - sotrable field
     */
    sortTableDescending(param) {
        this.searchProducts().then((products) => {
            const resultOfSort = this.model.sortTableDescending(param, products);
            this.view.renderLineItems(resultOfSort);
        });
    }

    /**
     * creates new order
     */
    createNewOrder() {
        const order = {
            "summary": this.view.createSummary(),
            "shipTo": this.view.createShipTo(),
            "customerInfo": this.view.createCustomerInfo()
        };

        this.model.postData(`Orders`, order).then(() => {
            return this.model.getOrders();
        }).then(orders => {
            this.updateOrderItems(orders);
        });
    }

    /**
     * deletes order
     */
    deleteOrder() {
        let orderId = this.view.getCurrentOrderId();
        this.model.deleteData(`Orders/${orderId}`).then(() => this.model.getOrders())
            .then((orders) => {
                document.location.hash = "";
                this.updateOrderItems(orders)
            });
    }

    /**
     * chooses order 
     * 
     * @param {Object} orderItem 
     */
    chooseOrderItem(orderItem) {
        this.model.getOrders().then((orders) => {
            this.view.chooseOrderItem(orders, orderItem);
            this.initMap(orders);
        });
    }

    /**
     * render map
     * 
     * @param {Object[]} orders - orders 
     */
    initMap(orders) {
        let currentId = this.view.getCurrentOrderId();
        orders.forEach(order => {
            if (order.id == currentId) {
                let address = order.shipTo.country + " " + order.shipTo.region + " " + order.shipTo.address;
                let myGeocoder = ymaps.geocode(address);

                myGeocoder.then((res) => {
                    this.view.initMap(res);
                }, function (err) {
                    console.log(err);
                });

            }
        });
    }

    /**
     * shows searched orders
     */
    searchOrders() {
        let searchText = this.view.searchOrders();

        this.model.searchOrders(searchText).then(result => {
            this.updateOrderItems(result);
        });
    }

    /**
     * changes "shipping addres"
     */
    changeShippingAddress() {
        this.model.getOrders().then(orders => {
            const order = this.view.saveChangesShippingAddress(orders);
            const url = `Orders/${order.id}`;
            this.model.updateData(url, order);
            this.view.renderShippingAddress(order);
            this.initMap(orders);
        });
    }

    /**
     * changes "customer information"
     */
    changeCustomerInf() {
        this.model.getOrders().then(orders => {
            const order = this.view.saveChangesCustomerInf(orders);
            const url = `Orders/${order.id}`;
            this.model.updateData(url, order);
            this.view.renderDetails(order);
        });
    }
}

export default Controller;