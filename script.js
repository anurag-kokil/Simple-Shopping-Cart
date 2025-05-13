const cart = [];
let total = 0 ;

window.addEventListener('load', async()=>{
    await fetchData();
    await loadCart();
});

async function fetchData(){
    try{
        const res = await fetch("products.json");
        const products = await res.json();
        displayProducts(products);
    }catch (error){
        console.error("Error fetching data:", error);
    }
}

async function loadCart() {
    try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
            const p_cart = JSON.parse(cartData);
            p_cart.forEach(product => cart.push(product));
            displayCartData(cart);
        }
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

function displayProducts(products){
    const productList = document.getElementById('product-list');
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('col', 'filter-item', 'all', 'new');
      productDiv.innerHTML = `
                <div class="card h-100">
                    <div class="d-flex align-items-center" style="height:80% ;">
                    <img src="${product.thumbnail}" class="card-img-top shop-item-image" alt="${product.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title shop-item-title">${product.title}</h5>
                        <p class="card-text shop-item-price">Price: $ ${product.price}</p>
                        <button type="button" id="add-to-cart"style="width: 100%;" onclick="addToCart(${product.id},'${product.thumbnail}','${product.title}',${product.price})" class="btn btn-warning mt-auto shop-item-button"><i class="fa-solid fa-cart-shopping " style="margin-right: 4%;"></i>Add To Cart</button>
                    </div>
                </div>`
       productList.appendChild(productDiv);
    });

}

function addToCart(i_d,imgsrc, titl_e, pric_e){
    const item = {
        id : i_d,
        img : imgsrc,
        title : titl_e,
        price : pric_e
    }

    if(cart.find(x=>x.id==i_d)){
        cart.find(x=>x.id==i_d).qty++;
    }else{
        item.qty = 1;
        cart.push(item);
    }

    updateCart();

}

function displayCartData(cart){

    var cartItems = document.getElementsByClassName('cart-items')[0];
    cartItems.innerHTML="";
    total=0;
    cart.forEach(product=>{
        total += product.price * product.qty ;
        var cartRow = document.createElement('tr');
        cartRow.classList.add('cart-row');

        cartRow.innerHTML = `

        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${product.img}" width="50" height="50">
            <span class="cart-item-title">${product.title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">$${product.price}</span>
        </td>
        <td class="cart-item cart-column">
            <img src="./svg's/plus-lg.svg" alt=""style="padding:5px" onclick="updateQuantity(${product.id},1)">
            <span class="cart-price cart-column">${product.qty}</span>
            <img src="./svg's/minus.svg" alt="" style="padding:5px"  onclick="updateQuantity(${product.id},0)">
        </td> 
        <td class="cart-item cart-column">
            <img src="./svg's/trash-fill.svg" alt="" onclick="deleteItem(${product.id})">
        </td> 

    `;

    cartItems.append(cartRow);
        
    });

    document.getElementById("total").innerHTML = `$ ${total}`;

}

function updateQuantity(i_d,k){
    if(k===1){
        cart.find(x=>x.id==i_d).qty++;
    }else if(k===0 && cart.find(x=>x.id==i_d).qty >1){
        cart.find(x=>x.id==i_d).qty--;
    }else if(k===0 && cart.find(x=>x.id==i_d).qty ==1){
        deleteItem(i_d);
    }
    updateCart();

}

function deleteItem(i_d){
    let d_item = cart.find(x=>x.id == i_d);
    cart.splice(cart.findIndex(x => x.id === d_item.id) , 1);
    updateCart();
}

async function updateCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartData(cart);
    } catch (error) {
        console.error("Error updating cart:", error);
    }
}

function emptyCart(){
    cart.splice(0, cart.length);
    total=0;
    updateCart();
}

function checkOut(){
    if(cart.length){
        window.alert("Payment Successfull.");
        cart.splice(0, cart.length);
        total=0;
        updateCart();
    }else{
        window.alert("Cart is Empty.\nPlease add products to cart.");
    }
    
}
