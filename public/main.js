let items;
let categories = [];

const BACKEND_URL = "https://e-menu-be.onrender.com";

async function addProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = {};

    for (let [key,value] of formData.entries()) {
        body[key] = value;
    }

    const request = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }); 

       
    if (request.status >= 200 && request.status < 300) {
        alert("Product Added!");
        event.target.reset();
        location.reload();
    } else console.log("Error: " + response.message);
}

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

    if (request.status >= 200 && request.status < 300) {
        alert("Category Added!");
        event.target.reset();
        location.reload();
    } else console.log("Error: " + response.message);
}

async function getProducts() {
   const request = await fetch(`${BACKEND_URL}/api/products`); 

   const data = await request.json();
    

   if (request.status >= 200 && request.status < 300) {
       items = data.items;
       displayProduct();
   } console.log("Error: " + data.message);
}

async function getCategories() {
   const request = await fetch(`${BACKEND_URL}/api/categories`); 
   const response = await request.json();
    
   if (request.status >= 200 && request.status < 300) {
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

   if (request.status >= 200 && request.status < 300) {
     alert("Product is Categorized");
     location.reload();
   } else console.log("Error: " + response.message);
}

async function deCategorizeProduct(productId, categoryId) {
  const request = await fetch(`${BACKEND_URL}/api/category/${categoryId}/decategorize/${productId}`,{
      method: "DELETE",
   }); 

   const response = await request.json();

   if (request.status >= 200 && request.status < 300) {
     alert("Product is DeCategorized");
     location.reload();
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
                        return `<div class="${category.toLowerCase().replace(/ /g,'_')}">
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
   const styleTag = document.querySelector("#category-coloring-style");
    
   let categoryColoring = ``;
   let categoryHTML = `
        <button onclick="displayProduct('')">All</button>
    `;
   for (let i = 0;i < categories.length;i++) {
      const category = categories[i];

      categoryHTML += `
         <button onclick="displayProduct('${category.name}')">${category.name}</button>
      `;

      const randColor = `hsl(${Math.floor(Math.random() * 256)},50%,50%)`;
      const lowName = category.name.toLowerCase().replace(/ /g,'_');
      categoryColoring += `
        .modal__btn.open-${lowName} {
          background: ${randColor};
          color: white;
        }

        .productCard .category .${lowName} {
             color: ${randColor}; 
         }
      `;
   }


   
   styleTag.innerHTML = categoryColoring;
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
                 const isPartOfItem = product.categories.includes(category.name);
                 return `<button onclick="${isPartOfItem ? "deC": "c"}ategorizeProduct('${product.id}','${category.id}')"  class="${isPartOfItem ? `open-${category.name.toLowerCase().replace(/ /g,"_")}`: ""} modal__btn">${category.name}</button>`
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
