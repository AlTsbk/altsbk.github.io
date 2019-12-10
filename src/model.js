/**
 * class model
 */
class Model {
    constructor() {
        this.mainUrl = "http://localhost:3000/api/";
    }

    /**
     * update objects in database
     * 
     * @param {string} url - url for requers 
     * @param {Object} body - updated object
     * @returns {Promise}
     */
    updateData(url, body) {
        const headers = {
            "Content-Type": "application/json"
        };
        return fetch(this.mainUrl + url, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: headers
        }).catch(e => console.error(e));
    }

    /**
     * delete objects in database
     * 
     * @param {url} url - url for request 
     * @returns {Promise}
     */
    deleteData(url) {
        return fetch((this.mainUrl + url), {
            method: "DELETE"
        }).catch(e => console.error(e));
    }

    /**
     * get data from database
     * 
     * @param {url} url - url for request
     * @returns {Object[]}
     */
    getData(url) {
        return fetch(url).then(response => {
            return response.json();
        }).catch(e => console.error(e));
    }

    /**
     * add new object in database
     * 
     * @param {string} url - url for request 
     * @param {*} body - new object
     * @returns {Promise}
     */
    postData(url, body) {
        const headers = {
            "Content-Type": "application/json"
        };
        return fetch((this.mainUrl + url), {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        }).catch(e => console.error(e));
    }

    /**
     * get orders from database
     * @returns {Object[]}
     */
    async getOrders() {
        let orders = [];

        await this.getData(`${this.mainUrl}Orders`)
            .then(data => {
                data.forEach(order => {
                    orders.push(order);
                });
            });

        for (let i = 0; i < orders.length; i++) {
            await this.getData(`${this.mainUrl}Orders/${orders[i].id}/products`)
                .then(data => {
                    if (data.length > 0) {
                        orders[i].products = data;
                    } else {
                        orders[i].products = [];
                    }
                });

        }

        return orders;
    }

    /**
     * search products
     * 
     * @param {string} searchProduct - search request 
     * @param {string} currentOrderId - current order ID
     * @returns {Object[]}
     */
    async serachProducts(searchProduct, currentOrderId) {
        let result = [];
        const searchText = new RegExp(searchProduct.trim(), "i");
        await this.getOrders().then(orders => {
            orders.forEach((order) => {
                if (order.id == currentOrderId) {
                    if (searchProduct != "") {
                        order.products.forEach((product) => {
                            let checkCondition = false;
                            Object.keys(product).forEach((property) => {

                                if (searchText.test(product[property])) {
                                    checkCondition = true;
                                }
                            });

                            if (checkCondition) {
                                result.push(product);
                            }
                        });
                    } else {
                        result.push(...order.products);
                    }
                }
            });
        });
        return result;
    }

    /**
     * sort table ascending
     * 
     * @param {string} property - sortable field
     * @param {Object[]} products - products for sort
     * @returns {Object[]} - sorted products
     */
    sortTableAscending(property, products) {
        if (!+products[0][property]) {
            products.sort((a, b) => {
                return a[property] > b[property] ? 1 : -1;
            });


        } else {
            products.sort((a, b) => {
                return +a[property] > +b[property] ? 1 : -1;
            });
        }
        return products;
    }

    /**
     * sort table descending
     * 
     * @param {string} property - sortable field
     * @param {Object[]} products - products for sort
     * @returns {Object[]} - sorted products
     */
    sortTableDescending(property, products) {

        if (!+products[0][property]) {
            products.sort((a, b) => {
                return a[property] < b[property] ? 1 : -1;
            });
        } else {
            products.sort((a, b) => {
                return +a[property] < +b[property] ? 1 : -1;
            });
        }

        return products;
    }

    /**
     * search orders
     * 
     * @param {string} searchOrder - search request
     * @returns {Object[]} - searched orders 
     */
    searchOrders(searchOrder) {
        return this.getOrders().then(orders => {
            if (searchOrder) {

                let searchedOrders = [];
                orders.forEach((order) => {
                    const searchText = new RegExp(searchOrder.trim(), "i");
                    let checkCondition = false;

                    Object.keys(order.summary).forEach((property) => {
                        if (searchText.test(order.summary[property])) {
                            checkCondition = true;
                        }
                    });

                    if (searchText.test(`Order ${order.id}`)) {
                        checkCondition = true;
                    }

                    if (checkCondition) {
                        searchedOrders.push(order);
                    }

                });
                return searchedOrders;
            } else {
                return orders;
            }
        });
    }
}

export default Model;