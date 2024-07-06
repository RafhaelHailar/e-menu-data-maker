let items;
let categories = [];
const STATE = {
    editingMode: false,
    editedId: null,
};

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
       items = data;
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

async function updateProduct(product) {
    const request = await fetch(`${BACKEND_URL}/api/product/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    const response = await request.json();

    if (request.status >= 200 && request.status < 300) {
        alert(response.message);
        location.reload();
    } else {
        alert(response.message);
    }
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
              <div class="edit-group">
                <input class="modal__title hide edit-name" type="text" value="${product.name}" disabled/>
                <h1 class="modal__title">${product.name}</h1>
              </div>
              <div class="edit-group">
                <input class="modal__title hide edit-image" type="text" value="${product.image}" disabled/>
                <img src="${product.image}" />
              </div>
              <div class="edit-group" style="margin: 0; padding: 0;font-weight:bold; display: flex; align-items: center">
                <span style="position: absolute">&#8369</span>  
                <input class="modal__text hide edit-price" type="text" style=" padding: 0 1rem;" value="${product.price}" disabled/>
                <p class="modal__text" style="margin: 0; padding: 0 1rem;">${product.price}</p>
              </div>
              <div class="edit-group">
                 <input class="modal__text hide edit-description" type="text" style="width: 100%" value="${product.description}" disabled/>
                 <p class="modal__text">${product.description}</p>
              </div>
              ${categories.map(category => {
                 const isPartOfItem = product.categories.includes(category.name);
                 return `<button onclick="${isPartOfItem ? "deC": "c"}ategorizeProduct('${product.id}','${category.id}')"  class="${isPartOfItem ? `open-${category.name.toLowerCase().replace(/ /g,"_")}`: ""} modal__btn">${category.name}</button>`
              }).join("")}
              <div class="link-wrapper">
                <div style="display: flex">
                    <a class="link-3 modal-edit" onclick="toggleEditMode()"><i class="fa-solid fa-pen-to-square"></i></a>
                    <a class="link-3 modal-save vanish" onclick="toggleEditMode('${product.id}')"> <i class="fa-solid fa-floppy-disk"></i></a>
                </div>
                <a class="link-2" onclick="closeModal()"></a>
              </div>
            </div>
          </div>
    `
   container.style.display = "flex"; 
}

function toggleEditMode(id) {
    STATE.editedId = id;

    if (!STATE.editingMode) {
        STATE.editingMode = true;
        document.querySelector(".modal-edit").classList.add("vanish");
        document.querySelector(".modal-save").classList.remove("vanish");
        return editMode();
    } 

    STATE.editingMode = false;
    document.querySelector(".modal-edit").classList.remove("vanish");
    document.querySelector(".modal-save").classList.add("vanish");
    saveEdit();
}

function editMode() {
    const editInputs = document.querySelectorAll(".edit-group input");
    const editingHTML = document.querySelectorAll(".edit-group input ~ *");

    for (let i = 0;i < editInputs.length;i++) {
        editInputs[i].classList.add("show-border");
        editInputs[i].removeAttribute("disabled");
        editInputs[i].classList.remove("hide");
    }
    
    for (let i = 0;i < editingHTML.length;i++) {
        editingHTML[i].classList.add("hide");
    }
}

function saveEdit() {
    const editInputs = document.querySelectorAll(".edit-group input");
    const editingHTML = document.querySelectorAll(".edit-group input ~ *");

    for (let i = 0;i < editInputs.length;i++) {
        editInputs[i].classList.remove("show-border");
        editInputs[i].setAttribute("disabled","true");
        editInputs[i].classList.add("hide");
    }
    
    for (let i = 0;i < editingHTML.length;i++) {
        editingHTML[i].classList.remove("hide");
    }

    const id = STATE.editedId;  
    if (!id) return;

    const name = document.querySelector(".edit-group .edit-name").value;
    const description = document.querySelector(".edit-group .edit-description").value;
    const image = document.querySelector(".edit-group .edit-image").value;
    const price = document.querySelector(".edit-group .edit-price").value;

    updateProduct({
        id,
        name,
        description,
        image,
        price
    });
}

function closeModal() {
   const container = document.querySelector("#m3-o");
   container.style.display = "none";
}


window.addEventListener("load", async function() {
    await getCategories();    
    await getProducts();
});
