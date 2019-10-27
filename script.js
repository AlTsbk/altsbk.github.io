// data

var Orders = [{
        id: "1",
        OrderInfo: {
            createdAt: "10.08.1991",
            customer: "Alfreds Futterkiste",
            status: "Accepted",
            shippedAt: "8.09.1991"
        },
        ShipTo: {
            name: "Maria Anders",
            Address: "Obere Str. 57",
            ZIP: "12209",
            Region: "Germany",
            Country: "Germany"
        },
        CustomerInfo: {
            firstName: "Maria",
            lastName: "Anders",
            address: "Obere Str. 57",
            phone: "030-0074321",
            email: "Maria.Anders@company.com"
        },
        products: [{
                id: "1",
                name: "Chai",
                price: "18",
                currency: "EUR",
                quantity: "2",
                totalPrice: "36"
            },
            {
                id: "2",
                name: "Aniseed Syrup",
                price: "10",
                currency: "EUR",
                quantity: "3",
                totalPrice: "30"
            },
            {
                id: "3",
                name: "Chef Anton's Cajun Seasoning",
                price: "22",
                currency: "EUR",
                quantity: "2",
                totalPrice: "44"
            },
            {
                id: "4",
                name: "Chef Anton's Gumbo Mix",
                price: "36",
                currency: "EUR",
                quantity: "21",
                totalPrice: "756"
            },
            {
                id: "5",
                name: "Grandma's Boysenberry Spread",
                price: "25",
                currency: "EUR",
                quantity: "5",
                totalPrice: "125"
            }
        ]
    },
    {
        id: "2",
        OrderInfo: {
            createdAt: "23.12.2006",
            customer: "Bon app",
            status: "Pending",
            shippedAt: "13.02.2007"
        },
        ShipTo: {
            name: "Laurence Lebihan",
            Address: "12, rue des Bouchers",
            ZIP: "13008",
            Region: "France",
            Country: "France"
        },
        CustomerInfo: {
            firstName: "Laurence",
            lastName: "Lebihan",
            address: "12, rue des Bouchers",
            phone: "91.24.45.40",
            email: "Laurence.Lebihan@company.com"
        },
        products: [{
                id: "1",
                name: "Queso Cabrales",
                price: "21",
                currency: "EUR",
                quantity: "5",
                totalPrice: "105"
            },
            {
                id: "2",
                name: "Queso Manchego La Pastora",
                price: "38",
                currency: "EUR",
                quantity: "3",
                totalPrice: "114"
            },
            {
                id: "3",
                name: "Pavlova",
                price: "120",
                currency: "EUR",
                quantity: "5",
                totalPrice: "600"
            },
            {
                id: "4",
                name: "Sir Rodney's Marmalade",
                price: "5",
                currency: "EUR",
                quantity: "3",
                totalPrice: "15"
            },
            {
                id: "5",
                name: "Genen Shouyu",
                price: "40",
                currency: "EUR",
                quantity: "7",
                totalPrice: "280"
            },
            {
                id: "6",
                name: "Tofu",
                price: "23.25",
                currency: "EUR",
                quantity: "1",
                totalPrice: "23.25"
            },
            {
                id: "7",
                name: "Alice Mutton",
                price: "32",
                currency: "EUR",
                quantity: "39",
                totalPrice: "1248"
            }
        ]
    }
];

//rendering orders

function renderingOrder() {
    const ordersSection = document.querySelector('.orders');
    Orders.forEach((order) => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `<p class="order-number">Order ${order.id}</p>
                               <p class="order-date">${order.OrderInfo.createdAt}</p>
                               <p class="customer-name">${order.OrderInfo.customer}</p>
                               <p class="order-status">${order.OrderInfo.status}</p>
                               <p class="shiped-date">Shipped: ${order.OrderInfo.shippedAt}</p>`;

        orderStatusColor(orderItem.querySelector('.order-status'));
        ordersSection.appendChild(orderItem);
    });
    ordersSection.firstElementChild.classList.add('order-item-active');
}

// change order status color
function orderStatusColor(orderStatus) {
    console.log(orderStatus.textContent);

    switch (orderStatus.textContent) {
        case 'Pending':
            orderStatus.style.color = 'orange';
            break;
        case 'Too late':
            orderStatus.style.color = 'red';
            break;
        default:
            orderStatus.style.color = 'green';
            break;
    }
}

//switching Shipping Addres and Processor Information

function switchTabsInOrder() {

    const shippingAddress = document.querySelector('.shipping-addres');
    const processorInformation = document.querySelector('.processor-information');
    const shippingAddressIcon = document.querySelector('.shipping-address-icon');
    const processorInfIcon = document.querySelector('.processor-inf-icon');


    shippingAddressIcon.addEventListener('click', () => {
        processorInformation.style.display = 'none';
        shippingAddress.style.display = 'block';
        shippingAddressIcon.parentNode.classList.add('active-icon');
        processorInfIcon.parentNode.classList.remove('active-icon');
    });

    processorInfIcon.addEventListener('click', () => {
        shippingAddress.style.display = 'none';
        processorInformation.style.display = 'block';
        shippingAddressIcon.parentNode.classList.remove('active-icon');
        processorInfIcon.parentNode.classList.add('active-icon');
    });


}

// choose order-item
function chooseOrderItem() {
    const orderItems = document.querySelectorAll('.order-item');

    orderItems.forEach(orderItem => {
        orderItem.addEventListener('click', () => {
            const activeOrder = document.querySelector('.order-item-active');
            activeOrder.classList.remove('order-item-active');
            orderItem.classList.add('order-item-active');

            Orders.forEach((order) => {
                if (orderItem.querySelector('.order-number').textContent === `Order ${order.id}`) {
                    renderInformation(order);
                }
            });

        });
    });
}

// render information

function renderInformation(order) {
    //order info filds
    const orderInfoNumber = document.querySelector('.order-info-number');
    const orderInfoCustomer = document.querySelector('.order-info-customer');
    const orderInfoOrdered = document.querySelector('.order-info-ordered');
    const orderInfoShiped = document.querySelector('.order-info-shiped');
    const orderInfoPrice = document.querySelector('.order-info-price');
    const orderInfoCurrency = document.querySelector('.order-info-currency');
    const orderPrice = order.products.map((product) => {
        return +product.totalPrice
    }).reduce((sum, current) => {
        return sum + current;
    });

    //shipping addres filds
    const name = document.querySelectorAll('.name');
    const address = document.querySelectorAll('.street');
    const zipCode = document.querySelectorAll('.zip-code');
    const region = document.querySelectorAll('.region');
    const country = document.querySelectorAll('.country');

    //details filds
    const detailsName = document.querySelectorAll('.details-name');
    const employeeId = document.querySelectorAll('.employee-id');
    const jobTitle = document.querySelectorAll('.job-title');
    const phone = document.querySelectorAll('.phone');

    //line items filds
    const tableContent = document.querySelector('.table-content');
    const countItems = document.querySelector('.count-items');
    const lineItemsMobile = document.querySelector('.line-items-mobile');
    //render order info

    orderInfoNumber.textContent = `Order ${order.id}`;
    orderInfoCustomer.textContent = `Customer: ${order.OrderInfo.customer}`;
    orderInfoOrdered.textContent = `Ordered: ${order.OrderInfo.createdAt}`;
    orderInfoShiped.textContent = `Shipped: ${order.OrderInfo.shippedAt}`;
    orderInfoPrice.textContent = orderPrice;
    orderInfoCurrency.textContent = order.products[0].currency;

    //render shipping addres
    name.forEach((n) => {
        n.textContent = order.ShipTo.name;
    });
    address.forEach((a) => {
        a.textContent = order.ShipTo.Address;
    });
    zipCode.forEach((z) => {
        z.textContent = order.ShipTo.ZIP;
    });
    region.forEach((r) => {
        r.textContent = order.ShipTo.Region;
    });
    country.forEach((c) => {
        c.textContent = order.ShipTo.Country;
    });

    //render details
    detailsName.forEach((d) => {
        d.textContent = order.CustomerInfo.firstName + ' ' + order.CustomerInfo.lastName;
    });

    //render table
    countItems.textContent = `Line Items(${order.products.length})`

    tableContent.innerHTML = '';
    lineItemsMobile.innerHTML = '<p>Product</p>';
    order.products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td data-label="Product" class="product"><b>${product.name}</b><p>${product.id}</p></td>
                         <td data-label="Unit Price" calss="unit-price"><b>${product.price}</b> ${product.currency}</td>
                         <td data-label="Quantity" class="quantity">${product.quantity}</td>
                         <td data-label="Total" class="total"><b>${product.totalPrice}</b> ${product.currency}</td>`;

        tableContent.appendChild(row);

        //render mobile version of line items

        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `<div>
                                    <p class="product"><b>${product.name}</b></p>
                                    <p>${product.id}</p>
                                 </div>
                                 <div>
                                    <p calss="unit-price">Unit Price:</p>
                                    <p><b>${product.price}</b> ${product.currency}</p>
                                 </div>
                                 <div>
                                    <p class="quantity">Quantity:</p>
                                    <p>${product.quantity}</p>
                                 </div>
                                 <div>
                                    <p class="total">Total:</p>
                                    <p><b>${product.totalPrice}</b> ${product.currency}</p>
                                 </div>`
        lineItemsMobile.appendChild(productItem);
    });




}

renderingOrder();
switchTabsInOrder();
chooseOrderItem();
renderInformation(Orders[0]);