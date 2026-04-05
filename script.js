const CONFIG = {
    whatsapp: "24107000000",
    facebook: "https://facebook.com/ProxitechGabon",
    instagram: "https://instagram.com/ProxitechGabon"
};

const database = [
    { 
        id: 1, 
        name: "HP Pavilion 15 Gamer", 
        price: 450000, 
        cat: "ordinateurs", 
        stock: true,
        img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500", 
        specs: { "Processeur": "Intel i5 11th Gen", "RAM": "16 Go DDR4", "Stockage": "512 Go SSD", "GPU": "GTX 1650" }
    },
    { 
        id: 2, 
        name: "iPhone 13 Pro", 
        price: 520000, 
        cat: "telephones", 
        stock: true,
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500", 
        specs: { "Écran": "6.1 pouces OLED", "Stockage": "128 Go", "Batterie": "95% État", "Réseau": "5G" }
    },
    { 
        id: 3, 
        name: "MacBook Air M1", 
        price: 550000, 
        cat: "ordinateurs", 
        stock: false,
        img: "https://images.unsplash.com/photo-1517336714460-450d90089531?w=500", 
        specs: { "Puce": "Apple M1", "RAM": "8 Go", "Stockage": "256 Go SSD", "Poids": "1.29 kg" }
    }
];

let cart = JSON.parse(localStorage.getItem('proxitech_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    setupSocialLinks();
    renderProducts(database);
    updateCartCount();
});

function setupSocialLinks() {
    document.getElementById('link-facebook').href = CONFIG.facebook;
    document.getElementById('link-instagram').href = CONFIG.instagram;
}

function renderProducts(data) {
    const list = document.getElementById('product-list');
    list.innerHTML = data.map(p => `
        <div class="product-card" onclick="openDetail(${p.id})">
            <div class="stock-tag ${p.stock ? 'stock-in' : 'stock-out'}">
                ${p.stock ? 'En Stock' : 'Rupture'}
            </div>
            <img src="${p.img}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price.toLocaleString()} FCFA</div>
            </div>
        </div>
    `).join('');
}

function openDetail(id) {
    const p = database.find(x => x.id === id);
    const body = document.getElementById('detail-body');
    
    let specHtml = '<ul class="tech-list" style="margin-top:20px; list-style:none; padding:0;">';
    for (let [key, value] of Object.entries(p.specs)) {
        specHtml += `<li style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
            <span style="color:#666;">${key}</span> 
            <b style="color:var(--blue);">${value}</b>
        </li>`;
    }
    specHtml += '</ul>';

    body.innerHTML = `
        <div class="detail-flex" style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
            <img src="${p.img}" style="width:100%; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
            <div>
                <h1 style="font-size:2rem; margin-bottom:10px;">${p.name}</h1>
                <p style="color:${p.stock ? '#28a745' : '#dc3545'}; font-weight:bold; font-size:1.1rem;">
                    <i class="fas ${p.stock ? 'fa-check-circle' : 'fa-times-circle'}"></i> 
                    ${p.stock ? 'Disponible à Oloumi' : 'Rupture de stock'}
                </p>
                ${specHtml}
                <div class="price" style="font-size:2.2rem; margin:20px 0;">${p.price.toLocaleString()} FCFA</div>
                <button class="btn-wa-final" onclick="addToCart(${p.id})" ${!p.stock ? 'disabled style="background:#ccc; cursor:not-allowed"' : ''}>
                    ${p.stock ? '<i class="fas fa-cart-plus"></i> Ajouter au Panier' : 'Indisponible'}
                </button>
            </div>
        </div>
    `;
    document.getElementById('modal-detail').style.display = 'block';
}

function addToCart(id) {
    cart.push(database.find(p => p.id === id));
    localStorage.setItem('proxitech_cart', JSON.stringify(cart));
    updateCartCount();
    closeModal('modal-detail');
    alert("Article ajouté au panier !");
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

// AFFICHAGE DU PANIER CORRIGÉ (DROIT)
function openCart() {
    const display = document.getElementById('cart-items-display');
    let total = 0;
    
    if(cart.length === 0) {
        display.innerHTML = "<p style='text-align:center; color:#888; padding:20px;'>Votre panier est vide.</p>";
    } else {
        display.innerHTML = cart.map((item, i) => {
            total += item.price;
            return `<div class="cart-item-row">
                <span style="font-weight:600;">${item.name}</span>
                <span class="item-price-align">${item.price.toLocaleString()} FCFA</span>
                <span class="item-remove" onclick="removeFromCart(${i})"><i class="fas fa-trash-alt"></i></span>
            </div>`;
        }).join('');
    }
    
    document.getElementById('cart-total').innerText = total.toLocaleString();
    document.getElementById('modal-cart').style.display = 'block';
}

function removeFromCart(i) {
    cart.splice(i, 1);
    localStorage.setItem('proxitech_cart', JSON.stringify(cart));
    updateCartCount();
    openCart();
}

function sendToWhatsApp() {
    const name = document.getElementById('client-name').value;
    const location = document.getElementById('client-location').value;
    const pay = document.querySelector('input[name="pay"]:checked').value;
    
    if(!name || !location) return alert("Veuillez renseigner votre nom et votre quartier (ex: Akanda).");
    if(cart.length === 0) return alert("Votre panier est vide.");

    const orderId = "PX-" + Math.floor(1000 + Math.random() * 9000);
    const total = document.getElementById('cart-total').innerText;
    const items = cart.map(item => `- ${item.name}`).join('%0A');

    const msg = `*NOUVELLE COMMANDE ${orderId}*%0A%0A` +
                `*Client:* ${name}%0A` +
                `*Quartier:* ${location}%0A%0A` +
                `*Articles:*%0A${items}%0A%0A` +
                `*Total:* ${total} FCFA%0A` +
                `*Paiement:* ${pay}%0A%0A` +
                `_Généré via Proxitech Gabon Shop_`;

    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function showSection(id) {
    document.getElementById('home-section').classList.toggle('hidden', id !== 'home');
    document.getElementById('account-section').classList.toggle('hidden', id !== 'account');
}

function filterCat(cat, btn) {
    document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'tous' ? database : database.filter(p => p.cat === cat);
    renderProducts(filtered);
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = database.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}
