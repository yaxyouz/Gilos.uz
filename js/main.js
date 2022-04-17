const createElement = function(elName, className, textContent) {
  const createdElement = document.createElement(elName);
  createdElement.className = className;

  if(textContent) {
    createdElement.textContent = textContent;
  }

  return createdElement;
}

const addZero = function(number) {
  return number < 10 ? "0" + number :number;
}

const showDate = function(datestring) {
  const date = new Date(datestring);

  return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${addZero(date.getFullYear())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const productTemplate = document.querySelector("#product-template")

const renderProduct = function(product) {

  const {id, title, img, price, model, addedDate, benefits} = product;

  const productRow = productTemplate.content.cloneNode(true);

  productRow.querySelector(".product-img").setAttribute("src", img);

  productRow.querySelector(".product-title").textContent = title;

  const productDiscount = price * 0.75;
  productRow.querySelector(".product-mark").textContent =`${productDiscount} so'm`;

  productRow.querySelector(".product-price").textContent = `${price} so'm`;
  productRow.querySelector(".product-model").textContent = model;

  productRow.querySelector(".product-date").textContent = showDate(addedDate);

  const productList = productRow.querySelector(".benefits-list");

  benefits.forEach(function(benefit) {
    const productItem = createElement("li", "badge bg-primary me-1 mb-1", benefit);
    productList.append(productItem);
  })

  const productEditBtn = productRow.querySelector(".product-edit");
  productEditBtn.setAttribute("data-id", id);

  const productDelBtn = productRow.querySelector(".product-del");
  productDelBtn.setAttribute("data-id", id);

  return productRow;
}

const onlineStore = document.querySelector("#onlinestore")
const elCount = document.querySelector(".count");

let showingProducts = products.slice();

const renderProducts = function() {

  onlineStore.innerHTML = "";

  elCount.textContent = `Count: ${showingProducts.length}`

  const productsFragment = document.createDocumentFragment();

  showingProducts.forEach(function(product) {
    const productRow = renderProduct(product);
    productsFragment.append(productRow);
  })
  onlineStore.append(productsFragment)
}

renderProducts();

// for(let i = 0; i < products.length; i++) {
//   const currentProduct = products[i];

//   const productRow = renderProduct(currentProduct);
//   onlineStore.append(productRow);
// }

const select = document.querySelector("#manufacturers");

manufacturers.forEach(function(manufacturer) {

  const optionSelect = createElement("option", "", manufacturer.name);

  select.append(optionSelect);
})

// for (let j = 0; j < manufacturers.length; j++) {
//   const currentSelect = manufacturers[j];

//   const optionSelect = createElement("option", "", currentSelect.name);

//   select.append(optionSelect);
// }

const benefitsInput = document.querySelector("#benefits");
const benefitsWrapper = document.querySelector("#benefits-wrapper");
let benefitsAdded = [];
let benefitsok = [];

benefitsInput.addEventListener("input", function() {

  const benefitsInputValue = benefitsInput.value;

  const splittedValue = benefitsInputValue.split(";");

  if(splittedValue.length == 2) {
    benefitsAdded.push(splittedValue[0]);
    benefitsInput.value = "";

    benefitsWrapper.innerHTML = "";

    benefitsAdded.forEach(function(benefitsItem) {
      const benefitWrapper = createElement("li", "me-1 mb-1");
      const benefitBtn = createElement("button", "btn btn-sm badge rounded-pill btn-danger", benefitsItem);
      benefitWrapper.append(benefitBtn);
      benefitsWrapper.append(benefitWrapper);
    })

    // for (let i = 0; i < benefitsAdded.length; i++) {
    //   const benefitWrapper = createElement("li", "me-1 mb-1");
    //   const benefitBtn = createElement("button", "btn btn-sm badge rounded-pill btn-danger", benefitsAdded[i]);
    //   benefitWrapper.append(benefitBtn);
    //   benefitsWrapper.append(benefitWrapper);
    // }
  }
});

const addForm = document.querySelector("#add-form");
const addStudentModalEl = document.querySelector("#add-student-modal");
const addStudentModal = new bootstrap.Modal(addStudentModalEl);

addForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const elements = evt.target.elements;

  const titleInput = elements.title;
  const priceInput = elements.price;
  const manufacturerInput = elements.manufacturers;
  

  const nameValue = titleInput.value;
  const priceValue = priceInput.value;
  const modelValue = manufacturerInput.value;

  if(nameValue.trim() && priceValue.trim()) {
    const product = {
      id: Math.floor(Math.random() * 1000),
      title: nameValue,
      img: "https://picsum.photos/300/200",
      price: priceValue,
      model: modelValue,
      addedDate: new Date().toISOString(),
      benefits: benefitsAdded
    }

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    showingProducts.push(product);

    addForm.reset();
    addStudentModal.hide();

    benefitsWrapper.innerHTML = "";
    benefitsAdded = [];

    const productRow = renderProduct(product);
    onlineStore.append(productRow);
  }
})


const editForm = document.querySelector("#edit-form");
const editStudentModalEl = document.querySelector("#edit-student-modal");
const editStudentModal = new bootstrap.Modal(editStudentModalEl);

const editTitle = document.querySelector("#edit-title");
const editPrice = document.querySelector("#edit-price");
const editManufacturers = document.querySelector("#edit-manufacturers");
const editBenefits = document.querySelector("#edit-benefits");

onlineStore.addEventListener("click", function(evt) {
  if(evt.target.matches(".btn-danger")) {
    const clickedItemId = +evt.target.dataset.id;

    const clickedItemIndex = products.findIndex(function(product) {
      return product.id === clickedItemId;
    })

    products.splice(clickedItemIndex, 1);
    localStorage.setItem("products", JSON.stringify(products));
    showingProducts.splice(clickedItemIndex, 1);

    renderProducts();
  } else {
    if(evt.target.matches(".btn-secondary")) {
      const clickedId = +evt.target.dataset.id;

      const clickedItem = products.find(function(product) {
        return product.id === clickedId;
      })
      
      editTitle.value = clickedItem.title;
      editPrice.value = clickedItem.price;
      
      editManufacturers.innerHTML = "";

      manufacturers.forEach(function(manufacturer) {
        const optionSelect = createElement("option", "yaxyo", manufacturer.name);

        if(clickedItem.model === manufacturer.name) {
          optionSelect.setAttribute("selected", "");
          editManufacturers.value = clickedItem.model;
        }
        editManufacturers.append(optionSelect);
      }) 

      editBenefits.value = clickedItem.benefits;

      editForm.setAttribute("data-editing-id", clickedItem.id);
    }
  }
})

editForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const editingId = +evt.target.dataset.editingId;


  const nameValue = editTitle.value;
  const priceValue = editPrice.value;
  const modelValue = editManufacturers.value;

  benefitsAdded = editBenefits.value.split(",");

  benefitsAdded.forEach(function(benefitsItem) {
    const benefitWrapper = createElement("li", "me-1 mb-1");
    const benefitBtn = createElement("button", "btn btn-sm badge rounded-pill btn-danger", benefitsItem);
    benefitWrapper.append(benefitBtn);
    benefitsWrapper.append(benefitWrapper);
  })

  if(nameValue.trim() && priceValue.trim()) {
    const product = {
      id: editingId,
      title: nameValue,
      img: "https://picsum.photos/300/200",
      price: priceValue,
      model: modelValue,
      addedDate: new Date().toISOString(),
      benefits: benefitsAdded
    }

    const editingItemIndex = products.findIndex(function(product) {
      return product.id === editingId;
    })

    const editingItemIndexs = showingProducts.findIndex(function(product) {
      return product.id === editingId;
    })

    products.splice(editingItemIndex, 1, product);
    localStorage.setItem("products", JSON.stringify(products));
    showingProducts.splice(editingItemIndexs, 1, product);

    editForm.reset();
    editStudentModal.hide();

    // benefitsWrapper.innerHTML = "";
    // benefitsAdded = [];

    // const productRow = renderProduct(product);
    // onlineStore.append(productRow);

    renderProducts();
  }
})

const selectAll = document.querySelector("#manufacturs");

  manufacturers.forEach(function(manufacturer) {

  const optionSelectAll = createElement("option", "", manufacturer.name);

  selectAll.append(optionSelectAll);
})

const filterForm = document.querySelector("#filter");

filterForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const elements = evt.target.elements;

  const searchValue = elements.search.value;
  const fromValue = elements.from.value;
  const toValue = elements.to.value;
  const manufacturerValue = elements.manufacturs.value;
  const sortValue = elements.sortby.value;

  // const filteredProducts = products.filter(function(product) {
  //   const markValue = product.price * 0.75;
  //   return markValue >= fromValue;
  // }).filter(function(product){
  //   const markValue = product.price * 0.75;
  //   return !toValue ? true : markValue <= toValue;
  // }).filter(function(product) {
  //   const searchRegExp = new RegExp(searchValue, "gi");
  //   return product.title.match(searchRegExp);
  // })

  showingProducts = products

  .sort(function(a, b) {
    switch (sortValue) {
      case "1":
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1
        } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1
        } else {
          return 0
        }
      case "2":
        return b.price - a.price
      case "3": 
        return a.price - b.price
      case "4": 
        return new Date (a.addedDate).getTime() - new Date (b.addedDate).getTime();
      default:
        break;
    }
  })

  // .sort(function(a, b) {
  //   return a.price - b.price;
  // })

  .filter(function(product) {
    const markValue = product.price * 0.75;

    const searchRegExp = new RegExp(searchValue, "gi");

    const toMarkCondition = !toValue ? true : markValue <= toValue;
    const allModelCondition = manufacturerValue === "0" ? true : product.model === manufacturerValue;

    return markValue >= fromValue && toMarkCondition && product.title.match(searchRegExp) && allModelCondition;
  })
  // .filter(function(product) {
  //   return manufacturerValue === "0" ? true : product.model === manufacturerValue;
  // })

  renderProducts();
})

