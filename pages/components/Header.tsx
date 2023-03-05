import { useState } from "react";

export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand">
        <div className="container-fluid">
          <ul className="navbar-nav navbar-expand">
            <li className="nav-item me-3">
              <a className="nav-link">Sign-In</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link">Register</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link">Logout</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link">Save</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
