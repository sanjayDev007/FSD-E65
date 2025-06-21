import React from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/"
              className={
                ({ isActive }) =>
                "text-white hover:text-blue-200 transition-colors" +
                (isActive ? " font-bold underline" : "")
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
                className={({ isActive }) =>
                    "text-white hover:text-blue-200 transition-colors" +
                    (isActive ? " font-bold underline" : "")
                }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
                className={({ isActive }) =>
                    "text-white hover:text-blue-200 transition-colors" +
                    (isActive ? " font-bold underline" : "")
                }
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
                className={({ isActive }) =>
                    "text-white hover:text-blue-200 transition-colors" +
                    (isActive ? " font-bold underline" : "")
                }
                state={{ from: "navbar" }}
            >
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
