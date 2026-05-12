// DOM Elements
const navbar = document.querySelector('.navbar');
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const totalPrice = document.querySelector('.total-price');
const filterBtns = document.querySelectorAll('.filter-btn');
const templateCards = document.querySelectorAll('.template-card');
const previewBtns = document.querySelectorAll('.preview-btn');
const previewModal = document.querySelector('.preview-modal');
const closePreview = document.querySelector('.close-preview');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.querySelector('.contact-form');

// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFilterButtons();
    initCartFunctionality();
    initPreviewModal();
    initSmoothScroll();
    initParallaxEffect();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to sections
    const sections = document.querySelectorAll('.templates-section, .components-section, .contact-section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Filter Templates
function initFilterButtons() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter templates
            templateCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Cart Functionality
function initCartFunctionality() {
    // Open cart
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    // Close cart
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Close cart when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card-3d');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const image = card.querySelector('.card-preview').className;

            addToCart({ title, price, image });
            
            // Animation
            btn.textContent = '✓ Added';
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.style.background = '';
            }, 2000);
        });
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const total = calculateTotal();
        alert(`Thank you for your purchase! Total: ${total}\n\nThis is a demo - no actual payment will be processed.`);
        
        // Clear cart
        cart = [];
        updateCartDisplay();
        cartModal.classList.remove('active');
    });
}

function addToCart(item) {
    cart.push(item);
    updateCartDisplay();
    
    // Show notification
    showNotification(`${item.title} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart count
    cartCount.textContent = cart.length;

    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-gray); margin-top: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                margin-bottom: 1rem;
                background: rgba(99, 102, 241, 0.1);
                border-radius: 10px;
            `;
            itemElement.innerHTML = `
                <div>
                    <h4 style="margin-bottom: 0.5rem;">${item.title}</h4>
                    <span style="color: var(--success);">${item.price}</span>
                </div>
                <button class="remove-item" style="
                    background: var(--accent-color);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                ">Remove</button>
            `;
            
            itemElement.querySelector('.remove-item').addEventListener('click', () => {
                removeFromCart(index);
            });
            
            cartItems.appendChild(itemElement);
        });
    }

    // Update total
    totalPrice.textContent = calculateTotal();
}

function calculateTotal() {
    const total = cart.reduce((sum, item) => {
        return sum + parseFloat(item.price.replace('$', ''));
    }, 0);
    return `$${total.toFixed(2)}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Preview Modal
function initPreviewModal() {
    previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.card-3d');
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const previewClass = card.querySelector('.card-preview').className;
            
            // Create preview content
            const previewContent = document.querySelector('.preview-content');
            previewContent.innerHTML = `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div class="${previewClass}" style="flex: 1; display: flex; align-items: center; justify-content: center;">
                        <h2 style="font-size: 3rem; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${title}</h2>
                    </div>
                    <div style="padding: 2rem; background: var(--dark-bg); color: var(--text-light);">
                        <h3 style="margin-bottom: 1rem; color: var(--primary-color);">${title}</h3>
                        <p style="margin-bottom: 1.5rem; color: var(--text-gray);">${description}</p>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="background: var(--card-bg); padding: 1rem; border-radius: 10px;">
                                <strong>Responsive Design</strong>
                            </div>
                            <div style="background: var(--card-bg); padding: 1rem; border-radius: 10px;">
                                <strong>Modern UI/UX</strong>
                            </div>
                            <div style="background: var(--card-bg); padding: 1rem; border-radius: 10px;">
                                <strong>Clean Code</strong>
                            </div>
                            <div style="background: var(--card-bg); padding: 1rem; border-radius: 10px;">
                                <strong>Easy Customization</strong>
                            </div>
                        </div>
                        <button class="preview-purchase-btn" style="
                            width: 100%;
                            background: var(--gradient-1);
                            border: none;
                            padding: 1rem;
                            border-radius: 10px;
                            color: white;
                            font-size: 1.1rem;
                            cursor: pointer;
                            transition: transform 0.3s ease;
                        ">Purchase Now</button>
                    </div>
                </div>
            `;
            
            previewModal.classList.add('active');
            
            // Add purchase button event
            previewContent.querySelector('.preview-purchase-btn').addEventListener('click', () => {
                const price = card.querySelector('.price').textContent;
                addToCart({ title, price, image: previewClass });
                previewModal.classList.remove('active');
            });
        });
    });

    // Close preview
    closePreview.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effect on Mouse Move
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const cube = document.querySelector('.floating-cube');
    
    hero.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        cube.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    hero.addEventListener('mouseleave', () => {
        cube.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification(`Thank you ${name}! Your message has been sent.`);
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 2000);
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Interactive Card Tilt Effect
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Component Items Click Handler
document.querySelectorAll('.component-item').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('h4').textContent;
        const price = item.querySelector('.component-price').textContent;
        
        if (confirm(`Would you like to add "${title}" to your cart for ${price}?`)) {
            addToCart({ title, price, image: '' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(99, 102, 241, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    }
});

// CTA Button Scroll to Templates
document.querySelector('.cta-btn').addEventListener('click', () => {
    document.querySelector('#templates').scrollIntoView({
        behavior: 'smooth'
    });
});

console.log('🎨 WEBDev Template Store initialized successfully!');
