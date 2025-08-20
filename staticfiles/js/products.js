// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});

function initProductsPage() {
    initFilters();
    initPriceRange();
    initSorting();
    initProductInteractions();
    initMobileFilters();
}

// Filter System
let activeFilters = {
    category: [],
    size: [],
    color: [],
    brand: [],
    minPrice: 0,
    maxPrice: 500
};

function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleFilterChange(this);
        });
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function handleFilterChange(checkbox) {
    const filterType = checkbox.dataset.filter;
    const value = checkbox.value;

    if (checkbox.checked) {
        if (!activeFilters[filterType].includes(value)) {
            activeFilters[filterType].push(value);
        }
    } else {
        activeFilters[filterType] = activeFilters[filterType].filter(item => item !== value);
    }

    applyFilters();
}

function clearAllFilters() {
    // Reset active filters
    activeFilters = {
        category: [],
        size: [],
        color: [],
        brand: [],
        minPrice: 0,
        maxPrice: 500
    };

    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset price sliders
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');
    if (minPriceSlider) minPriceSlider.value = 0;
    if (maxPriceSlider) maxPriceSlider.value = 500;
    updatePriceDisplay();

    // Apply filters (show all products)
    applyFilters();
}

// Price Range Functionality
function initPriceRange() {
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');

    if (minPriceSlider && maxPriceSlider) {
        minPriceSlider.addEventListener('input', function() {
            activeFilters.minPrice = parseInt(this.value);
            if (activeFilters.minPrice > activeFilters.maxPrice) {
                activeFilters.minPrice = activeFilters.maxPrice;
                this.value = activeFilters.maxPrice;
            }
            updatePriceDisplay();
            applyFilters();
        });

        maxPriceSlider.addEventListener('input', function() {
            activeFilters.maxPrice = parseInt(this.value);
            if (activeFilters.maxPrice < activeFilters.minPrice) {
                activeFilters.maxPrice = activeFilters.minPrice;
                this.value = activeFilters.minPrice;
            }
            updatePriceDisplay();
            applyFilters();
        });

        updatePriceDisplay();
    }
}

function updatePriceDisplay() {
    const minPriceDisplay = document.getElementById('minPriceValue');
    const maxPriceDisplay = document.getElementById('maxPriceValue');
    
    if (minPriceDisplay) minPriceDisplay.textContent = activeFilters.minPrice;
    if (maxPriceDisplay) maxPriceDisplay.textContent = activeFilters.maxPrice;
}

// Apply Filters to Products
function applyFilters() {
    const productCards = document.querySelectorAll('.product-card');
    const noResultsMsg = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    let visibleCount = 0;

    productCards.forEach(card => {
        const isVisible = shouldShowProduct(card);
        
        if (isVisible) {
            card.style.display = 'block';
            card.classList.add('filtered-in');
            card.classList.remove('filtered-out');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('filtered-out');
            card.classList.remove('filtered-in');
        }
    });

    // Update results count
    if (resultsCount) {
        const productText = visibleCount === 1 ? 'Product' : 'Products';
        resultsCount.textContent = `${visibleCount} ${productText}`;
    }

    // Show/hide no results message
    if (noResultsMsg) {
        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function shouldShowProduct(card) {
    const price = parseInt(card.dataset.price);
    const category = card.dataset.category;
    const sizes = card.dataset.size ? card.dataset.size.split(',') : [];
    const color = card.dataset.color;
    const brand = card.dataset.brand;

    // Price filter
    if (price < activeFilters.minPrice || price > activeFilters.maxPrice) {
        return false;
    }

    // Category filter
    if (activeFilters.category.length > 0 && !activeFilters.category.includes(category)) {
        return false;
    }

    // Size filter
    if (activeFilters.size.length > 0) {
        const hasMatchingSize = activeFilters.size.some(size => sizes.includes(size));
        if (!hasMatchingSize) return false;
    }

    // Color filter
    if (activeFilters.color.length > 0 && !activeFilters.color.includes(color)) {
        return false;
    }

    // Brand filter
    if (activeFilters.brand.length > 0 && !activeFilters.brand.includes(brand)) {
        return false;
    }

    return true;
}

// Sorting Functionality
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortType) {
    const productsGrid = document.getElementById('products-grid');
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));

    productCards.sort((a, b) => {
        switch (sortType) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            
            case 'name':
                const nameA = a.querySelector('.product-name').textContent;
                const nameB = b.querySelector('.product-name').textContent;
                return nameA.localeCompare(nameB);
            
            case 'newest':
                // For demo purposes, assume products with "New" badge are newest
                const hasNewBadgeA = a.querySelector('.product-badge:not(.sale)') ? 1 : 0;
                const hasNewBadgeB = b.querySelector('.product-badge:not(.sale)') ? 1 : 0;
                return hasNewBadgeB - hasNewBadgeA;
            
            default: // featured
                return 0;
        }
    });

    // Re-append sorted products
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });

    // Add animation effect
    productCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    });
}

// Product Card Interactions
function initProductInteractions() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleQuickView(this);
        });
    });

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleAddToCart(this);
        });
    });

    // Product card click handling
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            handleProductClick(this);
        });
    });
}

function handleQuickView(btn) {
    const productCard = btn.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    
    // Add visual feedback
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);

    // Here you would typically open a modal with product details
    console.log(`Quick view for: ${productName}`);
    
    // Simulate modal opening
    alert(`Quick View: ${productName}\n\nThis would open a detailed product modal in a real application.`);
}

function handleAddToCart(btn) {
    const productCard = btn.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const cartCount = document.querySelector('.cart-count');
    
    // Add visual feedback
    btn.textContent = 'Added!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
    }, 2000);

    // Update cart count
    if (cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        count++;
        cartCount.textContent = count;
        
        // Add bounce animation
        cartCount.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 500);
    }

    console.log(`Added to cart: ${productName}`);
}

function handleProductClick(card) {
    const productName = card.querySelector('.product-name').textContent;
    console.log(`Clicked on product: ${productName}`);
    // Here you would typically navigate to the product detail page
}

// Mobile Filters
function initMobileFilters() {
    const mobileToggle = document.querySelector('.mobile-filter-toggle');
    const sidebar = document.querySelector('.products-sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Search Functionality (if search is implemented)
function initProductSearch() {
    const searchInput = document.getElementById('product-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(this.value);
            }, 300);
        });
    }
}

function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchQuery = query.toLowerCase().trim();

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
        
        const matchesSearch = searchQuery === '' || 
                            productName.includes(searchQuery) || 
                            productBrand.includes(searchQuery);

        if (matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Utility function for animations
function addFadeInAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addFadeInAnimation();

// Export functions for use in other scripts
window.clearAllFilters = clearAllFilters;