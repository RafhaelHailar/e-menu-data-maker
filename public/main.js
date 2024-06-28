let items;
let categories = [];
async function getProducts() {
   const request = await fetch("https://e-menu-be.onrender.com/api/products"); 
   const data = await request.json();
    

   items = data.items;
   categories = data.categories;
   displayCategory();
   displayProduct();
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
        <button onclick="displayProduct('')">ALL</button>
    `;
   for (let i = 0;i < categories.length;i++) {
      const category = categories[i];

      categoryHTML += `
         <button onclick="displayProduct('${category}')">${category}</button>
      `;
   }

   container.innerHTML = categoryHTML;
}

function openModal(itemIndex) {
    const product = items[itemIndex];
    const container = document.querySelector("#m3-o");
    
    container.innerHTML = `
        <div class="modal" style="--m-shadow: 0 0 10rem 0">
              <h1 class="modal__title">${product.name}</h1>
              <img src="${product.image}" />
              <p class="modal__text">${product.description}</p>
              ${categories.map(category => {
                 const isPartOfItem = product.categories.includes(category);
                  console.log(isPartOfItem);
                 return `<button class="${isPartOfItem ? `open-${category.toLowerCase()}`: ""} modal__btn">${category}</button>`
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

getProducts();
