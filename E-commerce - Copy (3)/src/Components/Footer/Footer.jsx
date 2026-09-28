import { Link } from "react-router-dom";
import ImgeLogo from "../../assets/freshcart-logo.svg";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-10 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center">
              <img
                src={ImgeLogo}
                className="h-8"
                alt="FreshCart"
              />
            </Link>

            <p className="max-w-xs text-sm leading-6 text-gray-500">
              Discover quality products, great deals, and a seamless
              shopping experience with FreshCart.
            </p>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  ✓
                </span>
                <span>Quality Products</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  ✓
                </span>
                <span>Fast & Reliable Delivery</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  ✓
                </span>
                <span>Secure Shopping</span>
              </div>

            </div>
          </div>

          {/* Shop */}
          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Shop
            </h2>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-green-600"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/Products"
                  className="transition-colors hover:text-green-600"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/Categories"
                  className="transition-colors hover:text-green-600"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/Brands"
                  className="transition-colors hover:text-green-600"
                >
                  Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
              My Account
            </h2>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/Wishlist"
                  className="transition-colors hover:text-green-600"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/Cart"
                  className="transition-colors hover:text-green-600"
                >
                  Shopping Cart
                </Link>
              </li>

            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Customer Service
            </h2>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/Login"
                  className="transition-colors hover:text-green-600"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/Register"
                  className="transition-colors hover:text-green-600"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/ForgotPassword"
                  className="transition-colors hover:text-green-600"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-700">
              FreshCart
            </span>
            . All Rights Reserved.
          </span>

          {/* Social Media */}
          <div className="flex items-center gap-3">

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:-translate-y-1 hover:border-green-600 hover:text-green-600"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9h3v-9h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:-translate-y-1 hover:border-green-600 hover:text-green-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="5"
                />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r=".5"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:-translate-y-1 hover:border-green-600 hover:text-green-600"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26L22.827 21.75h-6.532l-5.115-6.693-5.856 6.693H2.016l7.73-8.835L1.5 2.25h6.699l4.623 6.105L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="#"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:-translate-y-1 hover:border-green-600 hover:text-green-600"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-1.024-.014-1.859-2.782.605-3.369-1.347-3.369-1.347-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.092.39-1.984 1.03-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.545 1.377.202 2.394.1 2.647.64.699 1.028 1.591 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.416-.012 2.744 0 .268.18.58.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}

