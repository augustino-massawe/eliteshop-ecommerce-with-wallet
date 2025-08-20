from django.shortcuts import render

def home(request):
    """
    Home page view for the online store
    """
    context = {
        'page_title': 'Home - EliteShop',
        'meta_description': 'Discover premium quality products at EliteShop. Shop the latest collection with fast delivery and exceptional customer service.',
    }
    return render(request, 'home.html', context)

def products(request):
    """
    Products page view for the online store
    """
    # Sample product data (in a real app, this would come from a database)
    products_data = [
        {
            'id': 1,
            'name': 'Elegant Blue Dress',
            'brand': 'EliteShop',
            'price': 299,
            'original_price': 399,
            'category': 'dresses',
            'sizes': ['S', 'M', 'L'],
            'color': 'blue',
            'image': 'product-1.jpg',
            'rating': 5,
            'rating_count': 24,
            'badge': 'New',
            'is_sale': False
        },
        {
            'id': 2,
            'name': 'Premium White Shirt',
            'brand': 'Premium',
            'price': 129,
            'original_price': None,
            'category': 'shirts',
            'sizes': ['M', 'L', 'XL'],
            'color': 'white',
            'image': 'product-2.jpg',
            'rating': 4,
            'rating_count': 18,
            'badge': None,
            'is_sale': False
        },
        {
            'id': 3,
            'name': 'Luxury Black Pants',
            'brand': 'Luxury',
            'price': 189,
            'original_price': 249,
            'category': 'pants',
            'sizes': ['S', 'M', 'L', 'XL'],
            'color': 'black',
            'image': 'product-3.jpg',
            'rating': 5,
            'rating_count': 32,
            'badge': 'Sale',
            'is_sale': True
        },
        {
            'id': 4,
            'name': 'Stylish Red Jacket',
            'brand': 'EliteShop',
            'price': 399,
            'original_price': None,
            'category': 'jackets',
            'sizes': ['M', 'L'],
            'color': 'red',
            'image': 'product-4.jpg',
            'rating': 5,
            'rating_count': 15,
            'badge': None,
            'is_sale': False
        }
    ]
    
    context = {
        'page_title': 'Products - EliteShop',
        'meta_description': 'Browse our premium collection of clothing and accessories. Find the perfect outfit for any occasion.',
        'products': products_data,
    }
    return render(request, 'products.html', context)