let items;
let categories = [];

const BACKEND_URL = "http://localhost:8080";

async function addCategory(event) {
    event.preventDefault();

    const request = await fetch(`${BACKEND_URL}/api/products/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: event.target.name.value})
    }); 

    const response = await request.json();

    if (request.ok) {
        alert("Category Added!");
        event.target.reset();
    } else console.log("Error: " + response.message);
}

async function getProducts() {
   const request = await fetch(`${BACKEND_URL}/api/products`); 

   const data = await request.json();
    

   if (request.ok) {
       items = data.items;
       displayProduct();
   } console.log("Error: " + data.message);
}

async function getCategories() {
   const request = await fetch(`${BACKEND_URL}/api/categories`); 
   const response = await request.json();
    
   if (request.ok) {
       categories = response;
       displayCategory();
   } console.log("Error: " + response.message);
}

async function categorizeProduct(productId, categoryId) {
   const request = await fetch(`${BACKEND_URL}/api/product/${productId}/categorize`,{
      method: "POST",
      headers: {
         "Content-Type": "application/json"         
      },
      body: JSON.stringify({categoryId})
   }); 

   const response = await request.json();

   if (response.ok) {
     alert("Product is Categorized");
   } else console.log("Error: " + response.message);
}

function displayProduct(category) {
   const container = document.querySelector("#products");
    
   let productHTML = ``;
   for (let i =0;i < items.length;i++) {
      if (category && !items[i].categories.includes(category)) continue;

      const product = items[i]; 

      productHTML += `
        <div class="productCard" onclick="openModal('${i}')">
            <div class="name">
                ${product.name}
            </div>
            <div class="category">
                ${
                    product.categories.map(category => {
                        return `<div class="${category.toLowerCase()}">
                           ${category} 
                        </div>`
                    }).join("")
                 }
            </div>
        </div>
      `;
   }

   container.innerHTML = productHTML;
}


function displayCategory() {
   const container = document.querySelector("#categories"); 

   let categoryHTML = `
    `;
   for (let i = 0;i < categories.length;i++) {
      const category = categories[i];

      categoryHTML += `
         <button onclick="displayProduct('${category.name}')">${category.name}</button>
      `;
   }

   container.innerHTML = categoryHTML;
}

function openModal(itemIndex) {
    const product = items[itemIndex];
    const container = document.querySelector("#m3-o");
    
    container.innerHTML = `
        <div class="modal" style="--m-shadow: 0 0 10rem 0">
              <p>${product.id}</p>
              <h1 class="modal__title">${product.name}</h1>
              <img src="${product.image}" />
              <p class="modal__text">${product.description}</p>
              ${categories.map(category => {
                 const isPartOfItem = product.categories.includes(category);
                 return `<button onclick="categorizeProduct('${product.id}','${category.id}')"  class="${isPartOfItem ? `open-${category.name.toLowerCase()}`: ""} modal__btn">${category.name}</button>`
              }).join("")}
              <a class="link-2" onclick="closeModal()"></a>
            </div>
          </div>
    `
   container.style.display = "flex"; 
}

function closeModal() {
   const container = document.querySelector("#m3-o");
   container.style.display = "none";
}


window.addEventListener("load", async function() {
    await getCategories();    
    await getProducts();
});
