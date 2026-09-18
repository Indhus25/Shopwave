import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://shopwave-backend-ou9y.onrender.com', {
  transports: ['websocket', 'polling']
});
function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState('📱 Mobiles & Electronics');
  const [roomId, setRoomId] = useState('');

  // 5 Categories with 10 products each
  const categories = [
    {
      title: '📱 Mobiles & Electronics',
      items: [
        { id: 1, name: 'Wireless Gaming Mouse', price: 1299, image: '🖱️' },
        { id: 2, name: 'Mechanical Keyboard', price: 2999, image: '⌨️' },
        { id: 3, name: 'Type-C Fast Charger', price: 799, image: '🔌' },
        { id: 4, name: 'Noise-Cancelling Headphones', price: 4499, image: '🎧' },
        { id: 5, name: 'Smart Fitness Band', price: 1999, image: '⌚' },
        { id: 6, name: 'Bluetooth Portable Speaker', price: 1499, image: '🔊' },
        { id: 7, name: '10000mAh Power Bank', price: 1199, image: '🔋' },
        { id: 8, name: 'HD Webcam for Streaming', price: 2499, image: '📷' },
        { id: 9, name: 'RGB Laptop Cooling Pad', price: 899, image: '💻' },
        { id: 10, name: 'True Wireless Earbuds', price: 1799, image: '🎵' }
      ]
    },
    {
      title: '👕 Fashion & Apparel',
      items: [
        { id: 11, name: 'Classic Cotton T-Shirt', price: 499, image: '👕' },
        { id: 12, name: 'Slim Fit Denim Jeans', price: 1199, image: '👖' },
        { id: 13, name: 'Casual Running Sneakers', price: 2199, image: '👟' },
        { id: 14, name: 'Hooded Winter Sweatshirt', price: 1499, image: '🧥' },
        { id: 15, name: 'Formal Office Shirt', price: 899, image: '👔' },
        { id: 16, name: 'Sports Athletic Shorts', price: 599, image: '🩳' },
        { id: 17, name: 'Leather Formal Shoes', price: 2499, image: '👞' },
        { id: 18, name: 'UV Protection Sunglasses', price: 799, image: '🕶️' },
        { id: 19, name: 'Waterproof Casual Backpack', price: 1299, image: '🎒' },
        { id: 20, name: 'Cotton Baseball Cap', price: 349, image: '🧢' }
      ]
    },
    {
      title: '🏠 Home & Kitchen',
      items: [
        { id: 21, name: 'Stainless Steel Water Bottle', price: 699, image: '🍼' },
        { id: 22, name: 'LED Desk Study Lamp', price: 899, image: '💡' },
        { id: 23, name: 'Non-Stick Cookware Pan', price: 1499, image: '🍳' },
        { id: 24, name: 'Electric Kettle (1.5L)', price: 1199, image: '☕' },
        { id: 25, name: 'Insulated Lunch Box Set', price: 799, image: '🍱' },
        { id: 26, name: 'Microfiber Cleaning Cloths', price: 299, image: '🧽' },
        { id: 27, name: 'Air Tight Storage Containers', price: 999, image: '🏺' },
        { id: 28, name: 'Silicon Kitchen Spatula Set', price: 449, image: '🥄' },
        { id: 29, name: 'Automatic Spice Grinder', price: 1299, image: '🧂' },
        { id: 30, name: 'Bedside Night Light', price: 549, image: '🌙' }
      ]
    },
    {
      title: '📚 Books & Stationery',
      items: [
        { id: 31, name: 'Atomic Habits (Book)', price: 499, image: '📖' },
        { id: 32, name: 'Rich Dad Poor Dad (Book)', price: 399, image: '📚' },
        { id: 33, name: 'A5 Ruled Notebook Journal', price: 199, image: '📓' },
        { id: 34, name: 'Gel Pen Set (Pack of 10)', price: 150, image: '🖊️' },
        { id: 35, name: 'Professional Sketch Pad', price: 349, image: '🎨' },
        { id: 36, name: 'Sticky Notes Memo Pads', price: 120, image: '📑' },
        { id: 37, name: 'Desktop File Organizer', price: 699, image: '🗂️' },
        { id: 38, name: 'Highlighters Pastel Set', price: 250, image: '🖍️' },
        { id: 39, name: 'Scientific Calculator', price: 899, image: '🔢' },
        { id: 40, name: 'Ergonomic Book Stand', price: 749, image: '📐' }
      ]
    },
    {
      title: '⚽ Sports & Fitness',
      items: [
        { id: 41, name: 'Rubber Basketball', price: 799, image: '🏀' },
        { id: 42, name: 'Professional Cricket Bat', price: 1899, image: '🏏' },
        { id: 43, name: 'Skipping Jump Rope', price: 299, image: '⚡' },
        { id: 44, name: 'Yoga Exercise Mat', price: 699, image: '🧘' },
        { id: 45, name: 'Adjustable Hand Gripper', price: 349, image: '✊' },
        { id: 46, name: 'Badminton Racket Set', price: 1299, image: '🏸' },
        { id: 47, name: 'Football Soccer Ball', price: 849, image: '⚽' },
        { id: 48, name: 'Push-Up Bars Stand', price: 599, image: '💪' },
        { id: 49, name: 'Resistance Workout Bands', price: 499, image: '📈' },
        { id: 50, name: 'Rubik Cube Puzzle Game', price: 199, image: '🧩' }
      ]
    }
  ];

  // Extract or generate Room ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let currentRoom = params.get('room');

    if (!currentRoom) {
      currentRoom = 'room-' + Math.floor(1000 + Math.random() * 9000);
      window.history.replaceState({}, '', `?room=${currentRoom}`);
    }

    setRoomId(currentRoom);

    // Join socket room
    socket.emit('join-room', currentRoom);

    socket.on('update-cart', (updatedCart) => {
      setCart(updatedCart);
    });

    return () => {
      socket.off('update-cart');
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIsLoggedIn(true);
  };

  const addToSharedCart = (product) => {
    const newItem = {
      name: product.name,
      price: product.price,
      addedBy: userName
    };
    socket.emit('add-item', { roomId, item: newItem });
    setIsCartOpen(true);
  };

  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const userBreakdown = cart.reduce((acc, item) => {
    const person = item.addedBy || 'Anonymous';
    if (!acc[person]) {
      acc[person] = { items: [], total: 0 };
    }
    acc[person].items.push(item);
    acc[person].total += Number(item.price);
    return acc;
  }, {});

  const currentCategoryData = categories.find((cat) => cat.title === activeCategory);
  const shareableUrl = window.location.href.replace('localhost', '192.168.29.172');

  if (!isLoggedIn) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#131921', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '8px', width: '350px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#131921', marginBottom: '10px' }}>🛒 ShopWave</h2>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>Joining Session: <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{roomId}</code></p>
          <input
            type="text"
            placeholder="Your Name (e.g. Indhu)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ padding: '12px', width: '100%', boxSizing: 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <button type="submit" style={{ background: '#ffa41c', border: 'none', padding: '12px', width: '100%', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            Join Room & Shop
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f3f3f3', minHeight: '100vh', margin: 0, padding: 0 }}>
      
      {/* Top Navbar */}
      <header style={{ background: '#131921', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 999 }}>
        <div>
          <h2 style={{ margin: 0, color: '#febd69' }}>🛒 ShopWave</h2>
          <small style={{ color: '#aaa' }}>User: <strong style={{ color: '#fff' }}>{userName}</strong> | Room: <code style={{ color: '#febd69' }}>{roomId}</code></small>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsInviteOpen(true)}
            style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
          >
            🔗 Invite Friends (Link & QR)
          </button>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            style={{ background: '#febd69', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
          >
            🛍️ Cart ({cart.length})
          </button>
        </div>
      </header>

      {/* Category Menu Bar */}
      <nav style={{ background: '#232f3e', padding: '10px 30px', display: 'flex', gap: '15px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat.title)}
            style={{
              background: activeCategory === cat.title ? '#febd69' : 'transparent',
              color: activeCategory === cat.title ? '#000' : '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {cat.title}
          </button>
        ))}
      </nav>

      {/* Main Container */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: 'auto' }}>
        <h2 style={{ borderBottom: '2px solid #febd69', paddingBottom: '10px', color: '#333', marginBottom: '20px' }}>
          {activeCategory}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {currentCategoryData.items.map((p) => (
            <div key={p.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '45px', marginBottom: '10px' }}>{p.image}</div>
              <h4 style={{ margin: '10px 0', fontSize: '15px', height: '40px' }}>{p.name}</h4>
              <p style={{ color: '#B12704', fontWeight: 'bold', fontSize: '18px' }}>₹{p.price}</p>
              <button 
                onClick={() => addToSharedCart(p)}
                style={{ background: '#ffd814', border: '1px solid #fcd200', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
              >
                Add to Shared Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Friends Modal (Link & QR Code) */}
      {isInviteOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '400px', textAlign: 'center', boxSizing: 'border-box' }}>
            <h3>🔗 Invite Friends to Room</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Share this link or scan the QR code to let friends join this exact shopping session:</p>

            <input 
              type="text" 
              readOnly 
              value={shareableUrl} 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: '#f1f3f5', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '12px' }}
            />

            {/* Free QR Code generator image API */}
            <div style={{ margin: '15px 0' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareableUrl)}`} 
                alt="Room QR Code" 
                style={{ border: '4px solid #f1f3f5', borderRadius: '8px' }}
              />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(shareableUrl);
                alert('Invite link copied to clipboard!');
              }}
              style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '10px' }}
            >
              Copy Shareable Link
            </button>
            <button 
              onClick={() => setIsInviteOpen(false)}
              style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100%', background: '#fff', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>🤝 Room: {roomId}</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginTop: '15px' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>Your shared cart is empty. Add items!</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={{ background: '#f8f9fa', padding: '10px', marginBottom: '10px', borderRadius: '5px', borderLeft: '4px solid #ff9900' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                  <small style={{ color: '#666' }}>Added by: <strong>{item.addedBy}</strong></small>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}>
            <h4>Total Bill: ₹{totalPrice}</h4>
            <button 
              onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
              style={{ background: '#ffa41c', border: 'none', padding: '12px', width: '100%', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
            >
              Proceed to Split & Checkout
            </button>
          </div>
        </div>
      )}

      {/* Bill Split Modal */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '550px', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2>📊 Smart Bill Split Breakdown ({roomId})</h2>
            <p style={{ color: '#555', fontSize: '14px' }}>Here is the breakdown showing what each member bought and their total share:</p>

            {Object.keys(userBreakdown).map((user) => (
              <div key={user} style={{ background: '#f1f3f5', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>👤 {user} bought these items:</h4>
                <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                  {userBreakdown[user].items.map((it, idx) => (
                    <li key={idx} style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {it.name} — ₹{it.price}
                    </li>
                  ))}
                </ul>
                <div style={{ fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '6px', color: '#333' }}>
                  {user}'s Total Bill: ₹{userBreakdown[user].total}
                </div>
              </div>
            ))}

            <h3 style={{ borderTop: '2px solid #333', paddingTop: '12px', textAlign: 'right' }}>Grand Total: ₹{totalPrice}</h3>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => alert('Order placed successfully! Payment split links sent to all members.')}
                style={{ background: '#28a745', color: '#fff', border: 'none', padding: '12px', flex: 1, fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
              >
                Confirm & Pay Share
              </button>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '12px', flex: 1, fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;