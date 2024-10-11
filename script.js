// ---------- index.html----------

document.addEventListener('DOMContentLoaded', function() {    
    const tables = document.querySelectorAll('.table');
    const modal = document.getElementById('menuModal');
    const closeModal = document.querySelector('.close');
    const menuList = document.getElementById("menuList");
    const orderList = document.getElementById("orderList");
    const totalPriceElement = document.getElementById("totalPrice");
    const orderSummary = document.getElementById("orderSummary");
    let currentTable =  null;
    let orders = {};

    fetch("http://localhost:3000/menu")
    .then(response => {

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(data => {
        console.log(data);
        const menu = data;

        if(!menu) {
            throw new Error('Menü bulunamadı');
        }

        menu.forEach(item => {
            const li  = document.createElement('li');
            const img = document.createElement("img");
            const h5 = document.createElement("h5");
            const spanMinus = document.createElement("span");
            const spanPrice = document.createElement("span");
            const spanPlus = document.createElement("span");

            spanPrice.classList = "price";
            spanMinus.classList = "minus";
            spanPlus.classList = "plus";

            img.src = `${item.img}`;
            h5.textContent = `${item.name}`;
            spanMinus.textContent = '-';
            spanPrice.textContent = `${item.price}`;
            spanPlus.textContent = '+';

            spanPrice.dataset.price = item.price;
            h5.dataset.name = item.name;

            spanMinus.addEventListener('click', function() {
                removeFromOrder(item);
            });

            spanPlus.addEventListener('click', function() {
                addToOrder(item);
            });

            menuList.appendChild(li);
            li.appendChild(img);
            li.appendChild(h5);
            li.appendChild(spanMinus);
            li.appendChild(spanPrice);
            li.appendChild(spanPlus);
            
        });
    });

    tables.forEach(table => {
        table.addEventListener('click', function() {
            modal.style.display = 'block';
            currentTable = this.id;
            if(!orders[currentTable]) {
                orders[currentTable] = {
                    items: [],
                    totalPrice: 0
                };
            }
            updateOrderList();
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if(e.target == modal) {
            modal.style.display = 'none';
        }
    });

    function addToOrder(item) {
        orders[currentTable].items.push(item);
        updateOrderList();
    }

    function removeFromOrder(item) {
        const index = orders[currentTable].items.findIndex(orderItem => orderItem === item);
        if(index > -1) {
            orders[currentTable].items.splice(index, 1);
            updateOrderList();
        }
    }

    function updateOrderList() {
        orderList.innerHTML = '';
        orders[currentTable].totalPrice = 0;

        orders[currentTable].items.forEach(item => {
            const orderItem = document.createElement('li');
            orderItem.textContent = `${item.name} - ${item.price}`;
            orderList.appendChild(orderItem);
            orders[currentTable].totalPrice += parseFloat(item.price);
        });

        totalPrice.textContent = orders[currentTable].totalPrice.toFixed(2);
    }

    function completeOrder() {
        if(currentTable) {
            const tableElement = document.getElementById(currentTable);
            tableElement.setAttribute('data-status', 'occupied');
            tableElement.style.background = 'red';
            let priceElement = tableElement.querySelector('.table-price');
            if(!priceElement) {
                priceElement = document.createElement('span');
                priceElement.classList.add('table-price');
                tableElement.appendChild(priceElement);
            } else {
                priceElement.textContent = "Toplam: " + orders[currentTable].totalPrice.toFixed(2) + " TL";
            }

            orderList.innerHTML = '';
            totalPriceElement.textContent = '0';

            modal.style.display = 'none';
            currentTable = null;
        }
    }

    const completeOrderButton = document.createElement('button');
    completeOrderButton.classList = 'orderBtn';
    completeOrderButton.textContent = 'Siparişi Tamamla';
    completeOrderButton.addEventListener('click', completeOrder);
    orderSummary.appendChild(completeOrderButton);
});

// ---------- menu.html----------

const fullMenu = document.getElementById("fullMenu");

fetch("http://localhost:3000/menu")
    .then(response => {

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(data => {
        const menu = data;

        menu.forEach(item => {
            const menuLi = document.createElement('li');
            const menuH5 = document.createElement('h5');
            const menuImg = document.createElement('img');
            const menuSpanPrice = document.createElement('span');

            menuSpanPrice.classList = 'price';

            menuImg.src = `${item.img}`;
            menuH5.textContent = `${item.name}`;
            menuSpanPrice.textContent = `${item.price}`;

            fullMenu.appendChild(menuLi);
            menuLi.appendChild(menuImg);
            menuLi.appendChild(menuH5);
            menuLi.appendChild(menuSpanPrice);
        });
    });

// ----------add-product.html----------

document.addEventListener("DOMContentLoaded", function() {
    const addProductForm = document.getElementById('addProductForm');

    addProductForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const productImg = document.getElementById('productImg').value;
            const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;

            const product = {
                id: Math.floor(Math.random() * 10000),
                img: productImg,
                name: productName,
                price: productPrice
            };

            fetch('http://localhost:3000/menu', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    addProductForm.reset();
                })
                .catch(error => {
                    console.error('ürün ekleme başarısız', error);
                });
        });
});