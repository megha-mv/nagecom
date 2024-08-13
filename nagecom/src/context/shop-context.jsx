import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [searchProducts, setSearchProducts] = useState([]);

  // Fetch the product details from the API
  async function fetchProductDetails() {
    const response = await fetch('http://localhost:3001/api/product/getProducts');
    const data = await response.json(); 
    return data;
  }

  const getProductDetails = async () => {
    const productDetails = await fetchProductDetails();
    setAllProducts(productDetails);
  };

  // Fetch products on component mount
  useEffect(() => {
    getProductDetails(); 
  }, []);

  // Log the products once they are fetched
  useEffect(() => {
    console.log('All Products:', allProducts);  
  }, [allProducts]);

  // Set up the default cart based on the fetched products
  useEffect(() => {
    if (allProducts.length > 0) {
      setCartItems(getDefaultCart());
    }
  }, [allProducts]);

  // Calculate the total number of items in the cart whenever cartItems changes
  useEffect(() => {
    const sum = Object.values(cartItems).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setTotalItems(sum);
  }, [cartItems]);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 1; i < allProducts.length + 1; i++) {
      cart[i] = 0;
    }
    return cart;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // let itemInfo = allProducts.find((product) => product.id === Number(item));
        totalAmount += cartItems[item] * 1999;
      }
    }
    return totalAmount;
  };

  const addToCart = (id) => {
    setCartItems((prev) => ({
      ...prev, 
      [id]: prev[id] + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev, 
      [itemId]: prev[itemId] - 1
    }));
  };

  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({
      ...prev, 
      [itemId]: newAmount
    }));
  };

  const filterProducts = (searchVal) => {
    if (!searchVal) {
      return allProducts;
    }
    const filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchVal.toLowerCase())
    );
    return filteredProducts;
  };

  useEffect(() => {
    const res = filterProducts(searchVal);
    setSearchProducts(res);
  }, [searchVal, allProducts]);

  const contextValue = {
    cartItems,
    totalItems,
    searchVal,
    searchProducts,
    allProducts,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    getTotalCartAmount,
    setSearchVal,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
