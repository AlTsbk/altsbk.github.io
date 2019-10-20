//switching Shipping Addres and Processor Information

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