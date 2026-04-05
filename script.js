/**
 * CONFIGURATION DE L'ENTREPRISE
 * Modifiez ces valeurs pour mettre à jour tout le site d'un coup
 */
const CONFIG = {
    whatsapp: "24107000000", // Votre numéro sans le "+"
    facebook: "https://www.facebook.com/ProxitechGabonOfficiel",
    instagram: "https://www.instagram.com/proxitech_ga",
    email: "contact@proxitech-gabon.ga",
    address: "Libreville, Zone Oloumi"
};

/**
 * BASE DE DONNÉES PRODUITS
 */
const database = [
    { id: 1, name: "Laptop Gamer Acer Nitro", price: 450000, cat: "ordinateurs", img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500", desc: "Processeur i7, 16Go RAM, Carte graphique RTX. Parfait pour le gaming et le rendu 3D." },
    { id: 2, name: "iPhone 14 Pro Max", price: 650000, cat: "telephones", img: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500", desc: "Appareil photo Pro 48MP, Écran Super Retina. État neuf avec garantie." },
    { id: 3, name: "MacBook Air M1", price: 550000, cat: "ordinateurs", img: "https://images.unsplash.com/photo-1517336714460-450d90089531?w=500", desc: "Léger, silencieux et ultra-puissant. Batterie longue durée pour les pros." },
    { id: 4, name: "Samsung Galaxy A54", price: 215000, cat: "telephones", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500", desc: "Le meilleur rapport qualité-prix. Résistant à l'eau et superbe écran." }
];

let cart = JSON.parse(localStorage.getItem('proxitech_cart')) || [];

// INITIALISATION DU SITE
document.addEventListener('DOMContentLoaded', () => {
    setupSocialLinks();
    renderList(database);
    updateCartCount();
});

/**
 * GESTION DES RÉSEAUX SOCIAUX
 */
function setupSocialLinks() {
    document.getElementById('link-facebook').href = CONFIG.facebook;
    document.getElementById('link-instagram').href = CONFIG.instagram;
    document.getElementById('link-whatsapp-direct').href = `https://wa.me/${CONFIG.whatsapp}?text=Bonjour%20Proxitech%20Gabon,%20j'aimerais%20avoir%20plus%20d'informations.`;
}

/**
 * NAVIGATION ET AFFICHAGE
 */
function showSection(id) {
    document.getElementById('home-section').classList.toggle('hidden', id !== 'home');
    document.getElementById('account-section').classList.toggle('hidden', id !== 'account');
}

function renderList(products) {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="product-card" onclick="openDetail(${p.id})">
            <img src="${p.img}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price.toLocaleString()} FCFA</div>
                <p style="font-size:0.75rem; color:#666; margin-top:5px;">Voir les détails <i class="fas fa-arrow-right"></i></p>
            </div>
        </div>
    `).join('');
}

/**
 * RECHERCHE, FILTRE ET TRI
 */
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = database.filter(p => p.name.toLowerCase().includes(query));
    renderList(filtered);
}

function filterCat(cat, btn) {
    document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'tous' ? database : database.filter(p => p.cat === cat);
    renderList(filtered);
}

function handleSort() {
    const sort = document.getElementById('sortSelect').value;
    let data = [...database];
    if(sort === 'low') data.sort((a,b) => a.price - b.price);
    if(sort === 'high') data.sort((a,b) => b.price - a.price);
    renderList(data);
}

/**
 * GESTION DU PANIER ET MODALES
 */
function openDetail(id) {
    const p = database.find(x => x.id === id);
    const body = document.getElementById('detail-body');
    body.innerHTML = `
        <div class="detail-flex">
            <img src="${p.img}" style="border-radius:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <div>
                <h1 style="color:var(--blue);">${p.name}</h1>
                <span style="background:#eee; padding:5px 10px; border-radius:5px; font-size:0.8rem; text-transform:uppercase;">Catégorie: ${p.cat}</span>
                <p style="margin:20px 0; color:#444; line-height:1.7;">${p.desc}</p>
                <div class="price" style="font-size:2.2rem; margin-bottom:25px;">${p.price.toLocaleString()} FCFA</div>
                <button class="btn-wa-final" onclick="addToCart(${p.id})">
                    <i class="fas fa-cart-plus"></i> Ajouter au Panier
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
    // Notification visuelle
    alert("Article ajouté au panier !");
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

function openCart() {
    const display = document.getElementById('cart-items-display');
    let total = 0;
    if(cart.length === 0) {
        display.innerHTML = "<p style='text-align:center; padding:20px;'>Votre panier est vide.</p>";
    } else {
        display.innerHTML = cart.map((item, i) => {
            total += item.price;
            return `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #eee;">
                <div>
                    <div style="font-weight:bold;">${item.name}</div>
                    <div style="color:var(--blue); font-size:0.9rem;">${item.price.toLocaleString()} FCFA</div>
                </div>
                <i class="fas fa-trash-alt" style="color:#ff4d4d; cursor:pointer;" onclick="removeFromCart(${i})" title="Supprimer"></i>
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

/**
 * ENVOI COMMANDE WHATSAPP
 */
function sendToWhatsApp() {
    if(cart.length === 0) return alert("Votre panier est vide !");
    
    const pay = document.querySelector('input[name="pay"]:checked').value;
    const total = document.getElementById('cart-total').innerText;
    
    // Construction de la liste des produits pour le message
    const items = cart.map(item => `- *${item.name}* (${item.price.toLocaleString()} FCFA)`).join('%0A');
    
    const message = `Bonjour Proxitech Gabon,%0A%0AJe souhaite commander les articles suivants :%0A${items}%0A%0A*Total de la commande : ${total} FCFA*%0A*Mode de paiement : ${pay}*%0A%0AMerci de me confirmer la disponibilité pour la livraison.`;
    
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${message}`, '_blank');
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}