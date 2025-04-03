document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.querySelector('.product-grid');
    const cartBadge = document.getElementById('cartBadge');
    const cartModal = document.getElementById('cartModal');
    let products = [];
    let cart = [];

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p class="text-danger">Error loading products. Please try again later.</p>';
        });

    // Create product cards with Add to Cart button
    function renderProducts(productsToShow) {
        productGrid.innerHTML = '';
        productsToShow.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col';
            
            const card = `
                <div class="card h-100 product-item" data-category="${product.category}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price">${product.price}</p>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            col.innerHTML = card;
            productGrid.appendChild(col);
        });
    }

    // Update cart UI
    function updateCartUI() {
        cartBadge.textContent = cart.length;
        const modalBody = document.querySelector('.cart-items-container');
        modalBody.innerHTML = '';
        
        if (cart.length === 0) {
            modalBody.innerHTML = '<p class="text-center">Your cart is empty</p>';
            return;
        }

        cart.forEach(item => {
            const itemHTML = `
                <div class="cart-item d-flex mb-3">
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    <div class="flex-grow-1 ms-3">
                        <h6>${item.name}</h6>
                        <p class="text-muted">${item.description}</p>
                        <span class="fw-bold">${item.price}</span>
                    </div>
                </div>
            `;
            modalBody.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Calculate and display total
        const total = cart.reduce((sum, item) => {
            return sum + parseFloat(item.price.replace('$', ''));
        }, 0);
        modalBody.insertAdjacentHTML('beforeend', `<h5 class="text-end mt-3">Total: $${total.toFixed(2)}</h5>`);
    }

    // Event delegation for Add to Cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = parseInt(button.dataset.id);
            const product = products.find(p => p.id === productId);
            cart.push(product);
            updateCartUI();
            
            // Show feedback animation
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 1000);
        }
    });

    // Clear cart
    document.getElementById('clearCart')?.addEventListener('click', () => {
        cart = [];
        updateCartUI();
    });

    // Submit order via WhatsApp
    document.getElementById('submitOrder')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const orderItems = cart.map(item => `- ${item.name} (${item.price})`).join('\n');
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
        const message = `New Order from Saucier:\n\n${orderItems}\n\nTotal: $${total.toFixed(2)}`;
        
        const whatsappUrl = `https://wa.me/96171751434?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Navigation functionality
    document.querySelector('.cart-link').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Cart link clicked'); // Debug log
        const modalElement = document.getElementById('cartModal');
        if (modalElement) {
            console.log('Modal element found'); // Debug log
            const cartModal = new bootstrap.Modal(modalElement);
            cartModal.show();
            console.log('Modal shown'); // Debug log
            updateCartUI(); // Ensure cart is updated when modal opens
        } else {
            console.error('Modal element not found');
        }
    });

    // Initialize modal on page load
    document.addEventListener('DOMContentLoaded', function() {
        const modalElement = document.getElementById('cartModal');
        if (modalElement) {
            window.cartModal = new bootstrap.Modal(modalElement);
            console.log('Modal initialized on page load');
        }
    });

    // Category filtering
    function filterProducts(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
        renderProducts(filteredProducts);
    }

    // Initialize with all products
    filterProducts('all');

    // Handle category button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-btn')) {
            filterProducts(e.target.dataset.category);
        }
    });

});