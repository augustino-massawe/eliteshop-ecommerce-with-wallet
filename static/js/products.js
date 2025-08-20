// Filter and sorting functionality
let allProducts = [];
let filteredProducts = [];

// Initialize products array from DOM
function initializeProducts() {
    const productCards = document.querySelectorAll('.product-card');
    allProducts = Array.from(productCards).map((card, index) => ({
        element: card,
        category: card.dataset.category,
        price: parseInt(card.dataset.price),
        size: card.dataset.size.split(','),
        color: card.dataset.color,
        brand: card.dataset.brand,
        name: card.querySelector('.product-name').textContent,
        index: index
    }));
    filteredProducts = [...allProducts];
    updateResultsCount();
}

// Update results count
function updateResultsCount() {
    const count = filteredProducts.length;
    document.getElementById('results-count').textContent = `${count} Product${count !== 1 ? 's' : ''}`;
}

// Filter products based on selected filters
function filterProducts() {
    const categoryFilters = getSelectedFilters('category');
    const sizeFilters = getSelectedFilters('size');
    const colorFilters = getSelectedFilters('color');
    const brandFilters = getSelectedFilters('brand');
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);

    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (categoryFilters.length > 0 && !categoryFilters.includes(product.category)) {
            return false;
        }

        // Size filter
        if (sizeFilters.length > 0 && !sizeFilters.some(size => product.size.includes(size))) {
            return false;
        }

        // Color filter
        if (colorFilters.length > 0 && !colorFilters.includes(product.color)) {
            return false;
        }

        // Brand filter
        if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) {
            return false;
        }

        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }

        return true;
    });

    displayProducts();
    updateResultsCount();
}

// Get selected filter values
function getSelectedFilters(filterType) {
    const checkboxes = document.querySelectorAll(`input[data-filter="${filterType}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Display filtered products
function displayProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');

    // Hide all products first
    allProducts.forEach(product => {
        product.element.style.display = 'none';
    });

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';

        // Show filtered products
        filteredProducts.forEach(product => {
            product.element.style.display = 'flex';
        });
    }
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.index - a.index);
            break;
        default: // featured
            filteredProducts.sort((a, b) => a.index - b.index);
    }

    // Reorder DOM elements
    const grid = document.getElementById('products-grid');
    filteredProducts.forEach(product => {
        grid.appendChild(product.element);
    });
}

// Clear all filters
function clearAllFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.checked = false;
    });

    // Reset price sliders
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 500;
    document.getElementById('minPriceValue').textContent = '0';
    document.getElementById('maxPriceValue').textContent = '500';

    // Reset sort dropdown
    document.getElementById('sort-select').value = 'featured';

    // Show all products
    filteredProducts = [...allProducts];
    displayProducts();
    updateResultsCount();
    sortProducts('featured');
}

// Update price display
function updatePriceDisplay() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    document.getElementById('minPriceValue').textContent = minPrice;
    document.getElementById('maxPriceValue').textContent = maxPrice;
}

// Toggle mobile filters
function toggleMobileFilters() {
    const sidebar = document.getElementById('mobile-sidebar');
    sidebar.classList.toggle('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    initializeProducts();

    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Price sliders
    document.getElementById('minPrice').addEventListener('input', function () {
        updatePriceDisplay();
        filterProducts();
    });

    document.getElementById('maxPrice').addEventListener('input', function () {
        updatePriceDisplay();
        filterProducts();
    });

    // Sort dropdown
    document.getElementById('sort-select').addEventListener('change', function () {
        sortProducts(this.value);
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();

            // Add visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.background = '#10b981';

            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            const currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;

            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '#2563eb';
            }, 2000);
        });
    });

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function (e) {
        const sidebar = document.getElementById('mobile-sidebar');
        const mobileToggle = document.querySelector('.mobile-filter-toggle');

        if (sidebar && sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
});