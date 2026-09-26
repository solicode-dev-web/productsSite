/* js/admin.js - BeautyHub Admin CRUD Controller (100% Static GitHub Pages) */

let adminProducts = [];
let adminCategories = [];
let adminBrands = [];
let currentAdminTab = 'products';

document.addEventListener('DOMContentLoaded', () => {
  fetchAdminData();
  initFormListeners();
});

function getImageUrl(imgPath) {
  if (!imgPath) return 'images/dior.jpg';
  if (imgPath.startsWith('http') || imgPath.startsWith('data:') || imgPath.startsWith('images/')) {
    return imgPath;
  }
  return `images/${imgPath}`;
}

// 1. FETCH ALL DATA (localStorage + static JSON fallback)
async function fetchAdminData() {
  await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchBrands()
  ]);
  updateDashboardStats();
  renderProductsTable();
  renderCategoriesTable();
  populateDropdowns();
}

async function fetchProducts() {
  const local = localStorage.getItem('beautyhub_products');
  if (local) {
    try {
      adminProducts = JSON.parse(local);
      return;
    } catch (e) {}
  }

  try {
    const res = await fetch('data/products.json');
    if (res.ok) {
      adminProducts = await res.json();
      localStorage.setItem('beautyhub_products', JSON.stringify(adminProducts));
    }
  } catch (err) {
    console.error('Erreur chargement data/products.json:', err);
  }
}

async function fetchCategories() {
  const local = localStorage.getItem('beautyhub_categories');
  if (local) {
    try {
      adminCategories = JSON.parse(local);
      return;
    } catch (e) {}
  }

  try {
    const res = await fetch('data/categories.json');
    if (res.ok) {
      adminCategories = await res.json();
      localStorage.setItem('beautyhub_categories', JSON.stringify(adminCategories));
    }
  } catch (err) {
    adminCategories = [
      { id: 1, name: 'Makeup', slug: 'makeup', description: 'Maquillage haut de gamme', product_count: 14 },
      { id: 2, name: 'Skincare', slug: 'skincare', description: 'Soins de la peau avancés', product_count: 6 },
      { id: 3, name: 'Parfum', slug: 'parfum', description: 'Fragrances d\'exception', product_count: 4 }
    ];
  }
}

async function fetchBrands() {
  const local = localStorage.getItem('beautyhub_brands');
  if (local) {
    try {
      adminBrands = JSON.parse(local);
      return;
    } catch (e) {}
  }

  try {
    const res = await fetch('data/brands.json');
    if (res.ok) {
      adminBrands = await res.json();
      localStorage.setItem('beautyhub_brands', JSON.stringify(adminBrands));
    }
  } catch (err) {
    adminBrands = [
      { id: 1, name: 'Dior', country: 'France' },
      { id: 2, name: 'SKIN1004 Centella', country: 'Corée du Sud' },
      { id: 3, name: 'Yves Saint Laurent', country: 'France' },
      { id: 4, name: 'Huda Beauty', country: 'France' },
      { id: 5, name: 'Anua', country: 'Corée du Sud' },
      { id: 6, name: 'NARS', country: 'France' },
      { id: 7, name: 'Rhode', country: 'Corée du Sud' }
    ];
  }
}

function saveProductsState() {
  localStorage.setItem('beautyhub_products', JSON.stringify(adminProducts));
}

function saveCategoriesState() {
  localStorage.setItem('beautyhub_categories', JSON.stringify(adminCategories));
}

// 2. DASHBOARD STATS OVERVIEW
function updateDashboardStats() {
  const totalProds = adminProducts.length;
  const totalCats = adminCategories.length;
  const franceCount = adminProducts.filter(p => (p.origin || '').includes('France')).length;
  const koreaCount = adminProducts.filter(p => (p.origin || '').includes('Corée')).length;

  document.getElementById('statTotalProducts').innerText = totalProds;
  document.getElementById('statTotalCategories').innerText = totalCats;
  document.getElementById('statFranceProducts').innerText = franceCount;
  document.getElementById('statKoreaProducts').innerText = koreaCount;
}

// 3. RENDER PRODUCTS TABLE
function renderProductsTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  if (!adminProducts || adminProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem;">Aucun produit dans la base.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminProducts.map(p => {
    const isKorea = (p.origin || '').includes('Corée');
    const flag = isKorea ? '🇰🇷' : '🇫🇷';
    const badgeClass = isKorea ? 'korea' : 'france';
    const imgSrc = getImageUrl(p.image);

    return `
      <tr>
        <td>
          <img src="${imgSrc}" class="table-img" alt="${p.title}" onerror="this.src='images/dior.jpg'" />
        </td>
        <td>
          <strong>${p.title}</strong>
          ${p.is_featured ? ' ⭐' : ''}
        </td>
        <td>${p.brand_name || 'Autre'}</td>
        <td><span class="category-pill">${p.category_name || 'Général'}</span></td>
        <td><span class="origin-badge ${badgeClass}">${flag} ${p.origin || 'France'}</span></td>
        <td><strong>${parseFloat(p.price).toFixed(2)} DH</strong></td>
        <td>${p.stock || 50} u.</td>
        <td>
          <div class="table-actions">
            <button class="btn-edit-sm" onclick="editProduct(${p.id})">
              <i class="fa-solid fa-pen"></i> Modifier
            </button>
            <button class="btn-delete-sm" onclick="deleteProduct(${p.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. RENDER CATEGORIES TABLE
function renderCategoriesTable() {
  const tbody = document.getElementById('adminCategoriesTableBody');
  if (!tbody) return;

  tbody.innerHTML = adminCategories.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td><code>${c.slug}</code></td>
      <td style="color: var(--text-rose); opacity:0.8;">${c.description || '-'}</td>
      <td>${c.product_count || 0} produits</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit-sm" onclick="editCategory(${c.id})">
            <i class="fa-solid fa-pen"></i> Modifier
          </button>
          <button class="btn-delete-sm" onclick="deleteCategory(${c.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Populate select dropdowns in Product Modal
function populateDropdowns() {
  const catSelect = document.getElementById('prodCategory');
  const brandSelect = document.getElementById('prodBrand');

  if (catSelect) {
    catSelect.innerHTML = adminCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (brandSelect) {
    brandSelect.innerHTML = adminBrands.map(b => `<option value="${b.id}">${b.name} (${b.country})</option>`).join('');
  }
}

// TAB SWITCHING
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const prodSec = document.getElementById('productsTabSection');
  const catSec = document.getElementById('categoriesTabSection');
  const btnProd = document.getElementById('tabProductsBtn');
  const btnCat = document.getElementById('tabCategoriesBtn');
  const addBtn = document.getElementById('addNewItemBtn');

  if (tab === 'products') {
    prodSec.style.display = 'block';
    catSec.style.display = 'none';
    btnProd.classList.add('active');
    btnCat.classList.remove('active');
    addBtn.innerHTML = `<i class="fa-solid fa-plus-circle"></i> + Ajouter un Produit`;
  } else {
    prodSec.style.display = 'none';
    catSec.style.display = 'block';
    btnProd.classList.remove('active');
    btnCat.classList.add('active');
    addBtn.innerHTML = `<i class="fa-solid fa-plus-circle"></i> + Ajouter une Catégorie`;
  }
}

function openAddModal() {
  if (currentAdminTab === 'products') {
    openProductModal();
  } else {
    openCategoryModal();
  }
}

// 5. PRODUCT CRUD MODAL LOGIC
function openProductModal(prod = null) {
  const modal = document.getElementById('productModalOverlay');
  const titleEl = document.getElementById('productModalTitle');
  const previewImg = document.getElementById('prodImagePreviewImg');

  if (prod) {
    titleEl.innerText = 'Modifier le Produit';
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodTitle').value = prod.title;
    const brandEl = document.getElementById('prodBrand');
    if (brandEl) brandEl.value = prod.brand_id || (adminCategories[0] ? adminCategories[0].id : 1);
    document.getElementById('prodPrice').value = prod.price;
    const originEl = document.getElementById('prodOrigin');
    if (originEl) originEl.value = prod.origin || 'France';
    document.getElementById('prodImage').value = prod.image;
    document.getElementById('prodStock').value = prod.stock || 50;
    document.getElementById('prodDescription').value = prod.description || '';
    document.getElementById('prodFeatured').checked = !!prod.is_featured;

    if (previewImg) previewImg.src = getImageUrl(prod.image);
  } else {
    titleEl.innerText = 'Ajouter un Nouveau Produit';
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    if (previewImg) previewImg.src = 'images/dior.jpg';
  }

  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModalOverlay').classList.remove('active');
}

function editProduct(id) {
  const prod = adminProducts.find(p => p.id === id);
  if (prod) openProductModal(prod);
}

function deleteProduct(id) {
  if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

  adminProducts = adminProducts.filter(p => p.id !== id);
  saveProductsState();
  updateDashboardStats();
  renderProductsTable();
  if (typeof showToast === 'function') {
    showToast('Produit supprimé avec succès !', 'gold');
  }
}

// 6. CATEGORY CRUD MODAL LOGIC
function openCategoryModal(cat = null) {
  const modal = document.getElementById('categoryModalOverlay');
  const titleEl = document.getElementById('categoryModalTitle');

  if (cat) {
    titleEl.innerText = 'Modifier la Catégorie';
    document.getElementById('catId').value = cat.id;
    document.getElementById('catName').value = cat.name;
    document.getElementById('catSlug').value = cat.slug;
    document.getElementById('catDescription').value = cat.description || '';
  } else {
    titleEl.innerText = 'Ajouter une Nouvelle Catégorie';
    document.getElementById('categoryForm').reset();
    document.getElementById('catId').value = '';
  }

  modal.classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('categoryModalOverlay').classList.remove('active');
}

function editCategory(id) {
  const cat = adminCategories.find(c => c.id === id);
  if (cat) openCategoryModal(cat);
}

function deleteCategory(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;

  adminCategories = adminCategories.filter(c => c.id !== id);
  saveCategoriesState();
  updateDashboardStats();
  renderCategoriesTable();
  populateDropdowns();
  if (typeof showToast === 'function') {
    showToast('Catégorie supprimée !', 'gold');
  }
}

// 7. FORM SUBMISSIONS & IMAGE HANDLING
function initFormListeners() {
  // Image Input Listener (URL, filename or DataURL preview)
  const fileInput = document.getElementById('prodImageFileInput');
  const imageTextInput = document.getElementById('prodImage');
  const previewImg = document.getElementById('prodImagePreviewImg');

  if (imageTextInput && previewImg) {
    imageTextInput.addEventListener('input', (e) => {
      previewImg.src = getImageUrl(e.target.value.trim());
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        const dataUrl = event.target.result;
        if (imageTextInput) imageTextInput.value = dataUrl;
        if (previewImg) previewImg.src = dataUrl;
        if (typeof showToast === 'function') {
          showToast('📸 Photo chargée pour l\'aperçu !', 'gold');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Product Form Submit
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('prodId').value;
      const catId = parseInt(document.getElementById('prodCategory').value);
      const brandIdEl = document.getElementById('prodBrand');
      const brandId = brandIdEl ? parseInt(brandIdEl.value) : 1;
      const cat = adminCategories.find(c => c.id === catId) || adminCategories[0];
      const brand = adminBrands.find(b => b.id === brandId) || adminBrands[0];
      const originEl = document.getElementById('prodOrigin');
      const originVal = originEl ? originEl.value : 'France';

      const productObj = {
        id: id ? parseInt(id) : Date.now(),
        category_id: catId,
        brand_id: brandId,
        title: document.getElementById('prodTitle').value.trim(),
        price: parseFloat(document.getElementById('prodPrice').value),
        origin: originVal,
        image: document.getElementById('prodImage').value.trim() || 'dior.jpg',
        stock: parseInt(document.getElementById('prodStock').value) || 50,
        description: document.getElementById('prodDescription').value.trim(),
        is_featured: document.getElementById('prodFeatured').checked ? 1 : 0,
        rating: 4.8,
        category_name: cat ? cat.name : 'Makeup',
        category_slug: cat ? cat.slug : 'makeup',
        brand_name: brand ? brand.name : 'BeautyHub',
        brand_country: originVal
      };

      if (id) {
        const index = adminProducts.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          adminProducts[index] = productObj;
        }
      } else {
        adminProducts.unshift(productObj);
      }

      saveProductsState();
      updateDashboardStats();
      renderProductsTable();
      closeProductModal();

      if (typeof showToast === 'function') {
        showToast(id ? 'Produit mis à jour en direct !' : 'Nouveau produit ajouté !', 'gold');
      }
    });
  }

  // Category Form Submit
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('catId').value;
      const name = document.getElementById('catName').value.trim();
      const categoryObj = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        slug: document.getElementById('catSlug').value.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        description: document.getElementById('catDescription').value.trim(),
        product_count: 0
      };

      if (id) {
        const index = adminCategories.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          adminCategories[index] = categoryObj;
        }
      } else {
        adminCategories.push(categoryObj);
      }

      saveCategoriesState();
      updateDashboardStats();
      renderCategoriesTable();
      populateDropdowns();
      closeCategoryModal();

      if (typeof showToast === 'function') {
        showToast('Catégorie enregistrée avec succès !', 'gold');
      }
    });
  }
}
