const input = document.getElementById("input");
const button = document.getElementById("button");
const allProducts = document.getElementById("allProducts");

let products = [];

fetch("product.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    afficherProducts(products);
  })
  .catch(err => console.log(err));

function afficherProducts(arr = products) {
  allProducts.innerHTML = "";
  arr.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p><span class="price">${p.price}DH</span></p>
      <img src="${p.image}">
    `;
    allProducts.appendChild(card);
  });
}

function chercherProduit() {
  const text = input.value.trim().toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(text));
  if(filtered.length==0){
    allProducts.innerHTML="aucun produit retrouver!"
    return;
  }
  afficherProducts(filtered);
}

button.addEventListener("click", chercherProduit);
