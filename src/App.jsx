import React, { useEffect, useState } from 'react';

function App() {
  
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  
  // NEW: Track selected size for each product ID
  // Example: { "gid://shopify/Product/123": "gid://shopify/ProductVariant/456" }
  const [selectedVariants, setSelectedVariants] = useState({});

  // 1. FETCH PRODUCTS (Gets up to 10 variants for sizes)
  const fetchProducts = async () => {
    const url = 'https://urbnwave-2.myshopify.com/api/2025-01/graphql.json';
    const query = `
      {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {  # Fetch up to 10 sizes
                edges {
                  node {
                    id
                    title  # e.g. "Small", "Medium"
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'e5795b685c274a45482a62a5f418dd49' 
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if(data.data && data.data.products) {
        setProducts(data.data.products.edges);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. ACTIONS

  // Helper: User clicks a size button (S, M, L)
  const handleSizeSelect = (productId, variantId) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const addToCart = (product) => {
    // Check which size is currently selected
    const selectedId = selectedVariants[product.id];
    
    // Default to first variant if user didn't pick one
    const variantToAdd = selectedId 
      ? product.variants.edges.find(v => v.node.id === selectedId).node 
      : product.variants.edges[0].node;

    // Create a cart item with the specific variant info
    const cartItem = {
      ...product,
      selectedVariant: variantToAdd 
    };

    setCart([...cart, cartItem]);
    console.log("Added:", product.title, variantToAdd.title);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // Calculate Total using the SELECTED variant's price
  const cartTotal = cart.reduce((total, item) => {
    return total + parseFloat(item.selectedVariant.price.amount);
  }, 0);

  // 3. CHECKOUT (Uses new 2025 cartCreate API)
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const lines = cart.map((item) => {
      return {
        merchandiseId: item.selectedVariant.id, // Use the specific variant ID
        quantity: 1
      };
    });

    const query = `
      mutation createCart($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const url = 'https://urbnwave-2.myshopify.com/api/2025-01/graphql.json';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'e5795b685c274a45482a62a5f418dd49'
        },
        body: JSON.stringify({ 
          query, 
          variables: { lines } 
        })
      });

      const data = await response.json();
      const checkoutUrl = data.data?.cartCreate?.cart?.checkoutUrl;
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("FULL ERROR:", JSON.stringify(data, null, 2));
        alert("Check the console (F12) for the specific error message.");
      }

    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // 4. STYLES
  const styles = {
    app: {
      backgroundColor: '#000000',
      minHeight: '100vh',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      color: 'white',
      position: 'relative',
      overflowX: 'hidden',
      cursor: 'default'
    },
    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: '#FF00FF', 
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    logo: {
      margin: 0,
      color: 'black',
      fontWeight: '900',
      fontSize: '1.5rem',
    },
    cartTrigger: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      background: 'none',
      border: 'none'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '40px'
    },
    card: {
      backgroundColor: '#050505',
      border: '1px solid #222', 
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative' 
    },
    image: {
      width: '100%',
      height: '320px', 
      objectFit: 'cover',
      filter: 'grayscale(100%)', 
      marginBottom: '15px'
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      margin: '0 0 5px 0',
      lineHeight: '1.2'
    },
    handle: {
      color: '#555',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      marginBottom: '10px' 
    },
    divider: {
      border: 'none',
      height: '1px',
      backgroundColor: '#333', 
      margin: '0 0 15px 0'
    },
    footerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto'
    },
    price: {
      color: '#FF00FF', 
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    addButton: {
      backgroundColor: '#222',
      color: '#888',
      border: 'none',
      width: '35px',
      height: '35px',
      fontSize: '1.2rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s'
    },
    // Cart Drawer
    cartOverlay: {
      position: 'fixed',
      top: 0,
      right: isCartOpen ? '0' : '-100%', 
      width: '100%',
      maxWidth: '400px',
      height: '100%',
      backgroundColor: '#111',
      borderLeft: '1px solid #333',
      zIndex: 200,
      transition: 'right 0.3s ease-in-out',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 150,
      display: isCartOpen ? 'block' : 'none'
    },
    cartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333',
      paddingBottom: '20px',
      marginBottom: '20px'
    },
    cartItem: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #222'
    },
    cartItemImage: {
      width: '60px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '4px',
      filter: 'grayscale(100%)'
    },
    checkoutBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#FF00FF',
      color: 'black',
      border: 'none',
      fontWeight: '900',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginTop: 'auto',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.app}>
      
      {/* CART BACKDROP */}
      <div style={styles.backdrop} onClick={() => setIsCartOpen(false)}></div>

      {/* CART DRAWER */}
      <div style={styles.cartOverlay}>
        <div style={styles.cartHeader}>
          <h2 style={{margin:0, textTransform:'uppercase'}}>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
        </div>

        {/* Cart Items List */}
        <div style={{flex: 1, overflowY: 'auto'}}>
          {cart.length === 0 ? (
            <p style={{color: '#555', textAlign: 'center'}}>Cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} style={styles.cartItem}>
                <img src={item.images.edges[0]?.node.url} style={styles.cartItemImage} alt="product" />
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.9rem', fontWeight:'bold', marginBottom:'5px'}}>
                    {item.title} 
                    <span style={{color: '#999', fontSize:'0.8rem', marginLeft: '5px'}}>
                      ({item.selectedVariant.title})
                    </span>
                  </div>
                  <div style={{color: '#FF00FF', fontSize:'0.9rem'}}>
                    US${parseFloat(item.selectedVariant.price.amount).toFixed(2)}
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  style={{background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:'1.2rem'}}
                >×</button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        <div style={{borderTop: '1px solid #333', paddingTop: '20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'bold'}}>
            <span>TOTAL</span>
            <span>US${cartTotal.toFixed(2)}</span>
          </div>
          <button style={styles.checkoutBtn} onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>


      {/* MAIN HEADER */}
      <nav style={styles.header}>
        <h2 style={styles.logo}>URBNWAVE</h2>
        <button style={styles.cartTrigger} onClick={() => setIsCartOpen(true)}>
          CART ({cart.length}) 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </button>
      </nav>

      {/* PRODUCT GRID */}
      <div style={styles.grid}>
        {products.map((item) => {
          const product = item.node;
          const image = product.images.edges[0]?.node;
          // We display the price of the *currently selected* variant, or default to the first one
          const selectedId = selectedVariants[product.id];
          const displayedVariant = selectedId 
            ? product.variants.edges.find(v => v.node.id === selectedId).node 
            : product.variants.edges[0].node;

          return (
            <div key={product.id} style={styles.card}>
              
              {/* PREMIUM HOVER EFFECT: Reveal & Zoom */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '320px', 
                  marginBottom: '15px',
                  overflow: 'hidden', // Keeps the zoom inside the box
                  borderRadius: '4px' // Optional: Softens corners
                }}
                onMouseEnter={(e) => {
                  // 1. Fade in the second image
                  const hoverImg = e.currentTarget.querySelector('.hover-img');
                  if (hoverImg) hoverImg.style.opacity = '1';
                  
                  // 2. Zoom in BOTH images
                  const images = e.currentTarget.querySelectorAll('img');
                  images.forEach(img => img.style.transform = 'scale(1.08)');
                }}
                onMouseLeave={(e) => {
                  // 1. Fade out the second image
                  const hoverImg = e.currentTarget.querySelector('.hover-img');
                  if (hoverImg) hoverImg.style.opacity = '0';
                  
                  // 2. Zoom out BOTH images
                  const images = e.currentTarget.querySelectorAll('img');
                  images.forEach(img => img.style.transform = 'scale(1)');
                }}
              >
                {/* Main Image */}
                {image ? (
                  <img 
                    src={image.url} 
                    alt={product.title} 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover', 
                      position: 'absolute', top: 0, left: 0,
                      transition: 'transform 0.7s ease' // Smooth Zoom
                    }}
                  />
                ) : null}

                {/* Secondary Image (Hidden by default) */}
                {product.images.edges[1] ? (
                  <img 
                    className="hover-img"
                    src={product.images.edges[1].node.url} 
                    alt={product.title} 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover', 
                      position: 'absolute', top: 0, left: 0,
                      opacity: 0, // Invisible start
                      transition: 'opacity 0.4s ease, transform 0.7s ease' // Smooth Fade & Zoom
                    }}
                  />
                ) : null}
              </div>
              
              <h3 style={styles.title}>{product.title}</h3>
              <div style={styles.handle}>// {product.handle.replace(/-/g, '_')}</div>

              {/* SIZE SELECTOR BUTTONS */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                {product.variants.edges.map((v) => {
                  const variant = v.node;
                  const isSelected = selectedVariants[product.id] === variant.id;
                  
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleSizeSelect(product.id, variant.id)}
                      style={{
                        padding: '6px 12px',
                        cursor: 'pointer',
                        border: '1px solid #333',
                        backgroundColor: isSelected ? '#FF00FF' : 'black', // Pink if selected
                        color: isSelected ? 'black' : 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {variant.title}
                    </button>
                  );
                })}
              </div>

              <hr style={styles.divider} />

              <div style={styles.footerRow}>
                <p style={styles.price}>
                   {displayedVariant ? `US$${parseFloat(displayedVariant.price.amount).toFixed(2)}` : 'SOLD OUT'}
                </p>

                <button 
                  onClick={() => addToCart(product)}
                  style={styles.addButton}
                  onMouseOver={(e) => {e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = '#444'}}
                  onMouseOut={(e) => {e.currentTarget.style.color = '#888'; e.currentTarget.style.backgroundColor = '#222'}}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;