import React from "react";
import { Link } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi";
import "./navbar.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/"> HOme </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/cart">
          <GiShoppingCart size={32} />
        </Link>
      </div>
    </div>
  );
};
