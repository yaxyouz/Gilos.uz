const products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) :[
  {
    id: 123,
    title: "Redmi Note 10 Pro",
    img: "https://picsum.photos/300/200",
    price: 4300000,
    model: "Xiaomi",
    addedDate: new Date("2020-11-12").toISOString(),
    benefits: ["8GB", "256GB", "White"]
  },
  {
    id: 127, 
    title: "iPhone 13 Pro Max",
    img: "https://picsum.photos/300/200",
    price: 13500000,
    model: "Apple",
    addedDate: new Date("2021-11-12").toISOString(),
    benefits: ["16GB", "1TB", "Green", "Waterproof"]
  },
  {
    id: 124,
    title: "Samsung S20 Ultra",
    img: "https://picsum.photos/300/200",
    price: 8300000,
    model: "Samsung",
    addedDate: new Date("2019-10-12").toISOString(),
    benefits: ["12GB", "500GB", "Black", "Waterproof"]
  }
]

const manufacturers = [
  {
    id: 1,
    name: "Xiaomi"
  },
  {
    id: 2,
    name: "Apple"
  },
  {
    id: 3,
    name: "Samsung"
  }
];