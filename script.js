 // Toggle sub-menu visibility
document.querySelectorAll('.parent-link').forEach((link) => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const subMenu = this.nextElementSibling;
        const icon = this.querySelector('.toggle-icon');

        // Đóng tất cả submenu khác
        document.querySelectorAll('.sub-menu').forEach((menu) => {
            if (menu !== subMenu) {
                menu.classList.remove('open');
                menu.previousElementSibling.querySelector('.toggle-icon').classList.remove('open');
            }
        });

        // Toggle submenu hiện tại
        subMenu.classList.toggle('open');
        icon.classList.toggle('open');
    });
});

document.querySelectorAll('.parent-link').forEach(link => {
    link.addEventListener('click', event => {
        const subMenu = link.nextElementSibling;
        if (subMenu && subMenu.classList.contains('sub-menu')) {
            subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
            event.preventDefault();
        }
    });
});

// Highlight active section
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.category');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    let activeSection = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            activeSection = `#${section.id}`;
        }
    });

    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activeSection);
    });
});

// Search by barcode
function searchByBarcode() {
    const searchValue = document.getElementById('barcode-search').value.trim();
    const products = document.querySelectorAll('.product');
    let found = false;

    products.forEach(product => {
        const barcode = product.getAttribute('data-barcode');
        if (barcode === searchValue) {
            product.classList.remove('hidden');
            product.scrollIntoView({ behavior: 'smooth' });
            found = true;
        } else {
            product.classList.add('hidden');
        }
    });

    if (!found) {
        alert('Không tìm thấy sản phẩm với mã barcode đã nhập.');
    }
}

// Scroll to search bar
function scrollToSearch() {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Search name product
function searchProduct() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(input)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function clearSearchInput() {
    document.getElementById('searchInput').value = '';
    searchProduct(); // To reset the product display
}

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchProduct();
    }
});

// Khởi tạo giỏ hàng
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productElement) {
    const name = productElement.querySelector('h3').innerText;
    const price = productElement.querySelector('p').innerText;
    const barcode = productElement.querySelector('.barcode').innerText.split(': ')[1];
    const imgSrc = productElement.querySelector('img').src;

    // Tạo đối tượng sản phẩm
    const product = { name, price, barcode, imgSrc };

    // Thêm sản phẩm vào giỏ hàng
    cart.push(product);

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
}

// Hàm hiển thị giỏ hàng (cập nhật thêm nút Thanh toán)
function viewCart() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('Giỏ hàng hiện đang trống.');
        return;
    }

    // Tạo giao diện hiển thị giỏ hàng
    let cartHtml = `
        <div class="cart-overlay">
            <div class="cart-container">
                <h2>Giỏ hàng của bạn</h2>
                <div class="cart-items">
                    ${cartItems.map((item, index) => `
                        <div class="cart-item">
                            <img src="${item.imgSrc}" alt="${item.name}">
                            <div class="product-details">
                                <h3>${item.name}</h3>
                                <p>${item.price}</p>
                                <p>Mã barcode: ${item.barcode}</p>
                            </div>
                            <button onclick="removeFromCart(${index})">Xóa</button>
                        </div>
                    `).join('')}
                </div>
                <h3>Tổng tiền: ${calculateTotal(cartItems)} đ</h3>
                <button onclick="proceedToCheckout()">Thanh toán</button>
                <button onclick="closeCart()">Đóng</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cartHtml);
}


// Hàm tính tổng tiền
function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        let price = parseInt(item.price.replace(/\D/g, '')); // Chuyển giá từ chuỗi thành số
        return total + price;
    }, 0);
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1); // Xóa sản phẩm khỏi mảng giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart)); // Cập nhật lại localStorage
    document.querySelector('.cart-overlay').remove(); // Đóng giao diện giỏ hàng
    viewCart(); // Hiển thị lại giỏ hàng
}

// Hàm đóng giỏ hàng
function closeCart() {
    document.querySelector('.cart-overlay').remove();
}

// Hàm xử lý thanh toán
function proceedToCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const total = calculateTotal(cartItems);

    // Hiển thị form thanh toán
    const checkoutHtml = `
        <div class="checkout-overlay">
            <div class="checkout-container">
                <h2>Thanh toán</h2>
                <p>Tổng tiền: ${total} đ</p>
                <form id="checkout-form">
                    <label for="name">Họ và tên:</label>
                    <input type="text" id="name" name="name" required>
                    
                    <label for="phone">Số điện thoại:</label>
                    <input type="text" id="phone" name="phone" required>

                    <label for="address">Địa chỉ:</label>
                    <input type="text" id="address" name="address" required>
                    
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>

                    <button type="submit">Xác nhận thanh toán</button>
                </form>
                <button onclick="closeCheckout()">Hủy</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', checkoutHtml);

    // Gắn sự kiện "submit" cho form thanh toán
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Thu thập thông tin từ form
        const name = form.name.value;
        const phone = form.phone.value;
        const address = form.address.value;
        const email = form.email.value;

        // Thực hiện xác nhận thanh toán
        confirmOrder(name, phone, address, email, total);
    });
}

// Hàm xác nhận đơn hàng
function confirmOrder(name, phone, address, email, total) {
    alert(`Cảm ơn bạn, ${name}! Đơn hàng của bạn trị giá ${total} đ đã được xác nhận.`);

    // Xóa giỏ hàng sau khi thanh toán thành công
    cart = [];
    localStorage.removeItem('cart');

    // Đóng giao diện thanh toán
    document.querySelector('.checkout-overlay').remove();
}

// Hàm đóng giao diện thanh toán
function closeCheckout() {
    document.querySelector('.checkout-overlay').remove();
}

// Initialize favorites list
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to add product to favorites
function addToFavorites(productElement) {
    const name = productElement.querySelector('h3').innerText;
    const price = productElement.querySelector('p').innerText;
    const barcode = productElement.querySelector('.barcode').innerText.split(': ')[1];
    const imgSrc = productElement.querySelector('img').src;

    // Create product object
    const product = { name, price, barcode, imgSrc };

    // Check if the product is already in favorites
    const isFavorite = favorites.some(item => item.barcode === product.barcode);
    if (isFavorite) {
        alert('Sản phẩm đã có trong danh sách yêu thích!');
        return;
    }

    // Add product to favorites
    favorites.push(product);

    // Save favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    alert('Sản phẩm đã được thêm vào danh sách yêu thích!');
}

// Function to view favorites
function viewPrefer() {
    let preferItems = JSON.parse(localStorage.getItem('favorites')) || [];

    if (preferItems.length === 0) {
        alert('Danh sách yêu thích hiện đang trống.');
        return;
    }

    // Create favorites display
    let preferHtml = `
        <div class="prefer-overlay">
            <div class="prefer-container">
                <h2>Danh sách yêu thích</h2>
                <div class="prefer-items">
                    ${preferItems.map((item, index) => `
                        <div class="prefer-item">
                            <img src="${item.imgSrc}" alt="${item.name}">
                            <div class="product-details">
                                <h3>${item.name}</h3>
                                <p>${item.price}</p>
                                <p>Mã barcode: ${item.barcode}</p>
                            </div>
                            <button onclick="removeFromPrefer(${index})">Xóa</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="closePrefer()">Đóng</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', preferHtml);
}

// Function to remove product from favorites
function removeFromPrefer(index) {
    favorites.splice(index, 1); // Remove product from favorites array
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
    document.querySelector('.prefer-overlay').remove(); // Close favorites display
    viewPrefer(); // Refresh favorites display
}

// Function to close favorites display
function closePrefer() {
    document.querySelector('.prefer-overlay').remove();
}
