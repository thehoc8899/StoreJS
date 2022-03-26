var productList = [];

function Data(){
    let url = 'https://fakestoreapi.com/products';
    document.querySelector("#main").innerHTML= '<img src = "images/loading.gif" width = "50">'
    fetch(url)
    .then(response => {

        return response.json()
    }) 
    .then(data =>{
        productList = data;
        render(productList);
    })
    .catch((error) =>{
        document.querySelector("#main").innerHTML = "Lỗi tải dữ liệu"
    });
}

// Dùng String Template để đổ data
let render = (products) =>{
    let output = "";
    products.forEach(function(product){
        output +=
        `<div class="col-s-6 col-4 col-l-3">
            <div id = "${product.id}"class="product">
                <h2> ${product.title} </h2>
                <img src="${product.image}" alt="product">
                <div>${product.price} $</div>
                <button onclick="addCart(${product.id})">Mua</button>
            </div>
        </div>`;
    });
    document.querySelector("#main").innerHTML = output;
}


function sortProduct(products,sortBy)
{
    products.sort(function(a,b)
    {
        if(sortBy==1)
            return a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase());
        if(sortBy==2)
            return -a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase());
        if(sortBy==3)
            return a.price - b.price;
        if(sortBy==4)
            return b.price - a.price;   
    });
    return products;
}

function filterProduct(products, priceRange)
{
    let result = products.filter(function(element)
    {
        if(priceRange==1)
            return element.price <= 100;
        if(priceRange==2)
            return  (element.price > 100 && element.price <= 300);
        if(priceRange==3)
            return (element.price > 300 && element.price <= 900);
        if(priceRange==4)
            return element.price > 900;
        
        return true; // giữu lại hết 
    });
    return result;
}

//Xử lý sắp xếp sản phẩm
document.querySelector("#sort-by").addEventListener("change",function(e){
    // filter sản phẩm
    let result = filterProduct(productList, document.querySelector("#filter").value);
    //sắp xếp lại sản phẩm đã filter
    result = sortProduct(result, e.target.value);
    //chạy lại sản phẩm
    render(result);
});


// Lọc các sản phẩm theo giá 
document.querySelector("#filter").addEventListener("change",function(e){
    let result = filterProduct(productList, e.target.value);
    render(result);
});

function addCart(id){
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart== null) {
        cart = [];
    }
    // Thêm sản phẩm vào giỏ hàng
    let index  = cart.findIndex(function(inf){
        return inf.id == id;
    })
    if(index == -1) // chưa có sản phẩm trong giỏ hàng
    {
        product = productList.find(function(product){
            return product.id == id;
        })
        let inf = {
            id : id,
            title : product.title,
            image : product.image,
            qty: 1,
            price : product.price
        }
        cart.push(inf);
    }
    else{
        cart[index].qty++;
    }
    
    // Cất giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    showQty();
}

function showCart(){
    let cart = JSON.parse(localStorage.getItem('cart'));
        if( cart == null)
        cart = [];
        let stt = 1;
        let output = "";
        cart.forEach(item => {
             output += ` 
                <tr>
                    <td>${stt++}</td>
                    <td width="20%">${item.title} </td>
                    <td> <img src="${item.image}" height ="90"></td>
                    <td><input onchange="updateQty(${item.id})" id ="qty${item.id}" type = "number" min = "1" value="${item.qty}"></td>
                    <td>${item.price} $</td>
                    <td>${item.qty * item.price} $</td>
                    <td> <button onclick = "deleteItem(${item.id})"><i class = "fas fa-trash"></button></td>
                </tr>`;
        });
        document.querySelector("#main table.cart tbody").innerHTML = output;
        showSum();
}

function deleteCart(){
    let query = document.querySelector("#main table.cart");
    query.remove();
}

function showQty(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart== null){
        cart = [];
    }
    let SumQty = cart.reduce(function(s, item){
        return s + item.qty;
    }, 0);
    document.querySelector("#count").innerHTML= SumQty;
}

function showSum(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart== null){
        cart = [];
    }
    let sum = cart.reduce(function(s,item){
        return s + item.qty * item.price;
    },0)
    document.querySelector("#sum").innerHTML= "Tổng tiền : " + sum  +"$";
}

function updateQty(id){
    let input = document.querySelector("#qty"+id);
    let  cart = JSON.parse(localStorage.getItem("cart"));
    if( cart == null)
    cart = [];
    let index = cart.findIndex(function(item){
        return item.id == id;
    })
    if(parseInt(input.value) < 1){
        input.value = 1;
    }

    cart[index].qty = parseInt(input.value);

    localStorage.setItem("cart", JSON.stringify(cart));

    showQty();
    showSum();
}
 function deleteItem (id){
    let answer = confirm("Bạn muốn xóa sản phẩm?")
    if(answer == true){
        let cart = JSON.parse(localStorage.getItem("cart"));
        if(cart == null)
        cart = [];
        let index = cart.findIndex(function(item){
            return item.id == id;
        });
        cart.splice(index,1);
        localStorage.setItem("cart",JSON.stringify(cart));
        
        showCart();
        showQty();
    }
}

window.addEventListener("load", function(){
    showQty();
})
