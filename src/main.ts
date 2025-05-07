import './style.css'
import products from './data.json'

type Product = {
  image: {
    thumbnail: string 
    mobile: string
    tablet: string
    desktop: string
  }
  name: string
  category: string
  price: number
}

type CartItem = {
  product: Product
  quantity: number
}

let cart: CartItem[] = []

// Função para renderizar os produtos
function renderProducts() {
  const dessertsContainer = document.getElementById('desserts')!

  dessertsContainer.innerHTML = `
    <div class="products-grid">
      ${(products as Product[]).map(product => {
        const itemInCart = cart.find(item => item.product.name === product.name)
        return `
          <article class="product-card">
            <div class="product-image-container" data-id="${product.name}">
              <img src="${product.image.desktop}" alt="${product.name}" class="product-image">
              ${
                itemInCart
                  ? `
                    <div class="cart-item-quantity">
                      <button class="quantity-btn" data-id="${product.name}" data-action="decrease">-</button>
                      <span>${itemInCart.quantity}</span>
                      <button class="quantity-btn" data-id="${product.name}" data-action="increase">+</button>
                    </div>
                  `
                  : `<button class="add-to-cart" data-id="${product.name}">Add to Cart</button>`
              }
            </div>
            <div class="product-info">
              <p class="product-category">${product.category}</p>
              <h3 class="product-name">${product.name}</h3>
              <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
          </article>
        `
      }).join('')}
    </div>
  `

  // Eventos para botões "Add to Cart"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = (e.target as HTMLElement).getAttribute('data-id')!
      const product = products.find(p => p.name === productName)!
      addToCart(product)
    })
  })

  // Eventos para botões + e -
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const productName = target.getAttribute('data-id')!
      const action = target.getAttribute('data-action')!

      if (action === 'increase') {
        addToCart(products.find(p => p.name === productName)!)
      } else {
        removeFromCart(productName)
      }
    })
  })
}

// Adiciona produto ao carrinho
function addToCart(product: Product) {
  const existingItem = cart.find(item => item.product.name === product.name)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ product, quantity: 1 })
  }

  renderProducts()
  renderCart()
}

// Remove produto do carrinho
function removeFromCart(productName: string) {
  const itemIndex = cart.findIndex(item => item.product.name === productName)

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1
    } else {
      cart.splice(itemIndex, 1)
    }
  }

  renderProducts()
  renderCart()
}

// Renderiza o carrinho
function renderCart() {
  const cartContainer = document.getElementById('cart')!

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <h2 class="cart-title">Your Cart</h2>
      <p class="empty-cart">Your cart is empty</p>
    `
    return
  }

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const exclude = '🗑️'

  cartContainer.innerHTML = `
    <h2 class="cart-title">Your Cart</h2>
    ${cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.product.name}</p>
          <p class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-total">
          <span>${item.quantity}</span>
          <button class="remove-all-btn" data-id="${item.product.name}">${exclude}</button>
        </div>
      </div>
    `).join('')}
    <div class="cart-total">
      Total: $${total.toFixed(2)}
    </div>
  `
  

  // Eventos + e - do carrinho
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const productName = target.getAttribute('data-id')!
      const action = target.getAttribute('data-action')!

      if (action === 'increase') {
        addToCart(products.find(p => p.name === productName)!)
      } else {
        removeFromCart(productName)
      }
    })
  })

  // Evento para remover todos os itens de um produto
  document.querySelectorAll('.remove-all-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productName = (e.target as HTMLElement).getAttribute('data-id')!
      cart = cart.filter(item => item.product.name !== productName)
      renderProducts()
      renderCart()
    })
  })

}

// Inicializa o app
function initApp() {
  renderProducts()
  renderCart()
}

initApp()
