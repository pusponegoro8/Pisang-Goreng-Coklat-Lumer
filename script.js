// Pisang Goreng Coklat Lumer Delivery System - JavaScript Logic
// Products data
const products = [
  {
    id: 1,
    name: 'Pisang Coklat Lumer',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1561933531-2e6245a099bd?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Pisang premium dengan coklat compound premium yang lumer di mulut'
  },
  {
    id: 2,
    name: 'Nutella Overload',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1573763475502-fcc7b779a427?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Nutella asli + meses coklat + keju + oreo crumble'
  },
  {
    id: 3,
    name: 'Pisang Matcha Cheese',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1623396177084-9d93344b7138?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Matcha green tea premium + keju edam + coklat putih'
  },
  {
    id: 4,
    name: 'Keju Lumer Special',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Keju parut special + saus keju lumer panas'
  },
  {
    id: 5,
    name: 'Paket Kombo 10 pcs',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: '10 pcs mix rasa + saus free + free ongkir area kota'
  },
  {
    id: 6,
    name: 'Pisang Coklat Susu',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1578984309576-b8c8ba86c451?ixlib=rb=4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Coklat compound + susu kental manis + keju'
  }
];

// Cart functions
let cart = JSON.parse(localStorage.getItem('pisangCart')) || [];

function saveCart() {
  localStorage.setItem('pisangCart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  saveCart();
  updateCartUI();
  showNotification(`${product.name} ditambahkan ke keranjang!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Order functions
let orders = JSON.parse(localStorage.getItem('pisangOrders')) || [];

function submitOrder(customerData) {
  const order = {
    id: Date.now(),
    date: new Date().toLocaleString('id-ID'),
    items: [...cart],
    total: getCartTotal(),
    customer: customerData,
    status: 'Menunggu Konfirmasi'
  };
  
  orders.unshift(order);
  localStorage.setItem('pisangOrders', JSON.stringify(orders));
  
  // Clear cart
  cart = [];
  saveCart();
  
  // Simulate email/WA
  const message = `Pesanan Baru Pisang Goreng Lumer!\n\nCustomer: ${customerData.name}\nPhone: ${customerData.phone}\nAlamat: ${customerData.address}\n\nItems:\n${cart.map(item => `${item.name} x${item.quantity} - Rp${item.price * item.quantity.toLocaleString()}`).join('\n')}\n\nTotal: Rp${order.total.toLocaleString()}`;
  
  // Open WA or mailto
  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
  
  updateCartUI();
  showNotification('Pesanan berhasil! Cek WA untuk konfirmasi.', 'success');
  
  return order;
}

// UI Functions
function updateCartUI() {
  const count = getCartCount();
  const cartElements = document.querySelectorAll('.cart-count');
  cartElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  
  const totalElements = document.querySelectorAll('.cart-total');
  totalElements.forEach(el => {
    el.textContent = `Rp ${getCartTotal().toLocaleString()}`;
  });
}

function renderProducts(container) {
  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in-up';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">Rp ${product.price.toLocaleString()}</div>
        <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
          Tambah ke Keranjang <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderCart(container) {
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><h2>Keranjang Kosong</h2><p>Tambahkan produk dari halaman utama</p></div>';
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
      <div style="flex: 1;">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString()}</p>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Hapus">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

function renderOrders(container) {
  if (orders.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-clipboard-list"></i><h2>Belum Ada Pesanan</h2><p>Buat pesanan pertama Anda!</p></div>';
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <strong>Pesanan #${order.id.toString().slice(-6)}</strong>
        <span style="color: var(--success-green);">${order.status}</span>
      </div>
      <p><strong>Tanggal:</strong> ${order.date}</p>
      <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
      <p><strong>Total:</strong> Rp ${order.total.toLocaleString()}</p>
      <details>
        <summary style="cursor: pointer; margin-top: 1rem; color: var(--primary-gold);">Lihat Detail (onclick expand)</summary>
        <ul style="margin-top: 0.5rem;">
          ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
        </ul>
      </details>
    </div>
  `).join('');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success-green)' : 'var(--primary-gold)'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  
  const page = document.body.getAttribute('data-page');
  if (page === 'products') {
    renderProducts(document.querySelector('.products-grid'));
  } else if (page === 'cart') {
    renderCart(document.querySelector('.cart-container'));
  } else if (page === 'orders') {
    renderOrders(document.querySelector('.orders-list'));
  }
  
  // Mobile menu
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});

// Checkout form handler (called from checkout.html)
function handleCheckout(form) {
  const customerData = {
    name: form.querySelector('[name="name"]').value,
    phone: form.querySelector('[name="phone"]').value,
    address: form.querySelector('[name="address"]').value,
    payment: form.querySelector('[name="payment"]').value,
    notes: form.querySelector('[name="notes"]').value
  };
  
  if (!customerData.name || !customerData.phone || !customerData.address) {
    showNotification('Lengkapi data wajib!', 'error');
    return false;
  }
  
  if (cart.length === 0) {
    showNotification('Keranjang kosong!');
    return false;
  }
  
  submitOrder(customerData);
  form.reset();
  // Redirect to orders or success page
  window.location.href = 'orders.html';
  return true;
}

