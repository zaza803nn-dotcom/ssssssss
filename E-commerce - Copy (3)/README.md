# 🛒 FreshCart — E-commerce (React)

> **دليل تعليمي ومعماري** مبني سطرًا سطرًا على الكود الفعلي الموجود في المشروع — وليس README تسويقي. الهدف: أن تقرأه وتفهم الـ Architecture والـ Data Flow وتقدر تعدّل بنفسك.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Routing](#3-routing)
4. [API Architecture](#4-api-architecture)
5. [TanStack React Query](#5-tanstack-react-query)
6. [Products](#6-products)
7. [Categories](#7-categories)
8. [Cart](#8-cart)
9. [Checkout](#9-checkout)
10. [Redux](#10-redux)
11. [Wishlist](#11-wishlist)
12. [Authentication](#12-authentication)
13. [Navbar](#13-navbar)
14. [Components](#14-components)
15. [Hooks](#15-hooks)
16. [Performance](#16-performance)
17. [UI / UX Libraries](#17-ui--ux-libraries)
18. [Forms + Validation](#18-forms--validation)
19. [Error Handling](#19-error-handling)
20. [Data Flow](#20-data-flow)
21. [Full User Journey](#21-full-user-journey)
22. [File-by-File Explanation](#22-file-by-file-explanation)
23. [Why These Technologies?](#23-why-these-technologies)
24. [Problems / Potential Improvements](#24-problems--potential-improvements)
25. [Security](#25-security)
26. [Installation & Running](#26-installation--running)
27. [How To Understand This Project](#27-how-to-understand-this-project)

---

## ⚠️ تنبيه مهم قبل أي شيء

المشروع حاليًا **لا يبني (build يفشل)**:

`src/App.jsx` يستورد 3 صفحات:

```jsx
import ChangePassword from "./pages/Profile/ChangePassword";
import Profile from "./pages/Profile/Profile";
import UpdateProfile from "./pages/Profile/UpdateProfile";
```

**لكن فولدر `src/pages/Profile/` غير موجود على القرص أصلًا.** الراوتات `Profile` / `UpdateProfile` / `ChangePassword` معرّفة في الـ children المحمية، لكن الملفات مفقودة. أول خطوة إصلاح: إمّا إنشاء هذه الصفحات أو حذف الاستيرادات والراوتات. هذا خطأ اكتُشف بقراءة الكود الفعلي وليس تخمينًا.

أيضًا `src/pages/Orders/Orders.jsx`, `OrderDetails.jsx`, `BrandDetails.jsx`, `Addresses.jsx` هي **placeholders** حرفية (`<div>Orders</div>`) — لا API ولا منطق.

---

# 1. Project Overview

## الفكرة

متجر إلكتروني (Grocery/E-commerce) اسمه **FreshCart**، مبني بـ React 19 كـ SPA، يعتمد على الـ API العام `https://ecommerce.routemisr.com/api/v1` (Routemisr API — نفس الـ API المستخدم في كورسات Route). المستخدم يتصفح المنتجات والكاتيجوري والبراندات، يضيف للسلة (server-side cart)، يدير Wishlist (server-side)، ثم يدفع كاش أو أونلاين (Stripe session عبر الـ API).

## أهم الـ Features الموجودة فعليًا في الكود

| Feature                                            | أين                                                            | ملاحظة                                             |
| -------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| تصفح منتجات مع بحث + فلترة كاتيجوري/ساب-كاتيجوري   | `Products.jsx` + `CategoryTree.jsx`                            | الفلترة client-side على 100 منتج مطلوبة مرة واحدة  |
| صفحة تفاصيل منتج + SEO tags                        | `ProductDetails.jsx`                                           | Dynamic route `:id`                                |
| Categories slider                                  | `Categories.jsx`                                               | Swiper autoplay                                    |
| Cart كامل (server-side)                            | `CartPage.jsx`, `Cart.jsx`, `Navbar.jsx`                       | GET/POST/PUT/DELETE على `/cart`                    |
| Wishlist كامل (server-side)                        | `Wishlist.jsx`, `WishlistHeartButton.jsx`, `WishlistSlide.jsx` | زرار قلب + drawer + صفحة                           |
| Checkout: كاش أو Stripe                            | `Checkout.jsx`                                                 | لا React Hook Form هنا — validation يدوي           |
| Login / Register / Forgot-Reset password flow كامل | `pages/Auth/*`                                                 | Zod + RHF في Login/Register فقط                    |
| Protected routes                                   | `ProtectedRoute.jsx`                                           | جاهز بس على `/Cart`, `/Checkout`, `/Wishlist`, ... |
| عدّاد سلة في Navbar                                | `Navbar.jsx` + `CartSlice`                                     | مزامنة Redux ↔ React Query                         |
| شريط إعلانات متحرك                                 | `AnnouncementBar/TextLoop.jsx`                                 | CSS marquee يدوي                                   |
| Slider رئيسي                                       | `Slider.jsx`                                                   | Swiper fade + autoplay                             |

## التقنيات (مستخرجة من package.json حرفيًا)

| Library                                                | لماذا هنا؟                                               | أين تُستخدم؟                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **React 19 + ReactDOM**                                | مكتبة الـ UI الأساسية                                    | كل شيء                                                                                      |
| **Vite 8 + @vitejs/plugin-react**                      | dev server + bundler، أسرع من webpack، HMR فوري          | `vite.config.js`                                                                            |
| **Tailwind CSS 4 (@tailwindcss/vite)**                 | كل التنسيق utility-first في الـ JSX نفسه                 | كل الملفات؛ import في `index.css`                                                           |
| **react-router-dom 7**                                 | routing SPA: pages, layout, protected routes, params     | `App.jsx`, `Layout`, `ProtectedRoute`, `Navbar`, صفحات                                      |
| **@reduxjs/toolkit + react-redux**                     | حالة عالمية صغيرة: عدّاد السلة + بيانات المستخدم/التوكن  | `Redux/`, `Navbar`, `Cart`, `CartPage`, `Checkout`, `Login`, `PaymentSuccess`               |
| **@tanstack/react-query 5**                            | إدارة الـ Server State: منتجات، كاتيجوري، سلة، wishlist  | كل الصفحات تقريبًا                                                                          |
| **axios**                                              | HTTP client                                              | `src/api/api.js` (instance) + ملفات قديمة لسه بتستورد axios مباشر                           |
| **react-hook-form + @hookform/resolvers + zod**        | forms مع validation declarative                          | `Login.jsx`, `Register.jsx` (Zod) + `ForgotPassword/ResetPassword` (RHF built-in rules فقط) |
| **react-hot-toast**                                    | إشعارات نجاح/خطأ                                         | `App.jsx` (Toaster) + كل الـ mutations                                                      |
| **lucide-react**                                       | أيقونات SVG                                              | كل الملفات                                                                                  |
| **motion** (`motion/react` — اسم Framer Motion الجديد) | animations: entrance, spring badge, AnimatePresence      | `Navbar`, `Cart`, `ProductDetails`, `Wishlist*`, `Auth pages`                               |
| **swiper**                                             | sliders (hero fade + categories autoplay)                | `Slider.jsx`, `Categories.jsx`                                                              |
| **vaul**                                               | drawer (wishlist side panel)                             | `WishlistSlide.jsx`                                                                         |
| **react-helmet-async**                                 | تحديث `<title>`/meta لكل صفحة                            | `App.jsx` (Provider) + `ProductDetails.jsx`                                                 |
| **react-loader-spinner**                               | spinner (Oval)                                           | `Products.jsx`, `Brands.jsx`                                                                |
| **flowbite-react**                                     | مُثبّتة في dependencies لكن **غير مستخدمة في أي import** | ❌ dead dependency (مثال: Footer منسوخ من Flowbite HTML مباشر بدون استخدام المكتبة)         |
| **gsap**                                               | مُثبّتة لكن **غير مستخدمة في أي ملف**                    | ❌ dead dependency                                                                          |

> ملاحظة أمانة: `flowbite-react` و `gsap` في package.json لكن grep على كل ملفات src لم يجد أي استيراد لهما. لا تفترض أنهما يعملان في أي مكان.

## الـ Architecture العامة

```
main.jsx → App.jsx (Providers: Helmet → React Query → Redux → Router)
                                │
                     RouterProvider (createBrowserRouter)
                                │
                    Layout (Navbar + Outlet + Footer)
                                │
          ┌─────────────────────┼─────────────────────┐
      Pages (React Query     Components (Cart btn,   Redux (cart count,
      لجلب Server State)      Wishlist btn, ...)       auth user/token)
                                │
                     src/api/api.js (axios instance
                     + interceptor يضيف token)
                                │
              https://ecommerce.routemisr.com/api/v1
```

**القاعدة الذهبية في المشروع:**

- **Server State** (سلة، wishlist، منتجات، كاتيجوري...) → **React Query cache** بمفتاح موحد.
- **Client/UI State** (عدّاد السلة للعرض، بيانات المستخدم الظاهرة في الـ Navbar) → **Redux**.
- Redux في هذا المشروع **ليست مصدر الحقيقة** — هي طبقة عرض مشتقة من الـ React Query cache، تتحدث عبر `dispatch(setCart(...))` بعد كل response.

---

# 2. Project Structure

```
src/
├── api/
│   └── api.js                  # axios instance + interceptor للتوكن (الطبقة الوحيدة الموحدة للـ API)
├── assets/                     # صور: slider, banners, logo, error.svg
├── Components/
│   ├── AnnouncementBar/        # شريط إعلاني متحرك (TextLoop = CSS marquee يدوي)
│   ├── Footer/                 # فوتر (HTML منسوخ من Flowbite docs — ثابت)
│   ├── Layout/                 # Navbar + <Outlet/> + Footer
│   ├── Navbar/                 # لينكات + عدّاد السلة + زرار wishlist + logout
│   ├── NotFound/               # صورة 404
│   └── ProtectedRoute/         # guard: بدون توكن → Navigate لـ /Login
├── pages/
│   ├── Addresses/              # placeholder فقط
│   ├── Auth/                   # Login, Register, ForgotPassword, VerifyResetCode, ResetPassword
│   ├── Brands/                 # Brands (كامل) + BrandDetails (placeholder)
│   ├── Cart/
│   │   ├── Cart.jsx            # زرار "Add To Cart" (useMutation) — مش صفحة!
│   │   └── CartPage.jsx        # صفحة السلة الفعلية (query + 3 mutations)
│   ├── Categories/             # Categories (swiper) + CategoryDetails + SubCategory
│   ├── Checkout/               # Checkout (كاش/أونلاين) + PaymentSuccess
│   ├── Home/                   # Slider + Categories + Products
│   ├── Orders/                 # placeholders (2 ملفات)
│   ├── Products/               # Products + ProductDetails + CategoryTree (فلترة)
│   ├── Profile/                # ⚠️ غير موجود على القرض رغم import في App.jsx
│   ├── Slider/                 # Swiper hero
│   └── Wishlist/               # Wishlist (صفحة) + WishlistHeartButton (زرار) + WishlistSlide (drawer)
├── Redux/
│   ├── CartSlice.js            # { count } فقط
│   ├── AuthenticationSlice.js  # { user, token } + storage helpers
│   └── store.js                # configureStore
├── App.jsx                     # Providers + كل الـ routes
├── App.css / index.css         # Tailwind import + استيرادات swiper css
└── main.jsx                    # createRoot + StrictMode
```

**ليه التقسيمة ده؟**

- `pages/` = ملف مرتبط براوت (lazy not used — كل شيء static import حاليًا).
- `Components/` = قطع تُستخدم داخل صفحات أو في الـ Layout (Navbar/Footer تظهر في كل الصفحات).
- `Redux/` = store وسلايحات صغيرة. مقصود أن تبقى صغيرة — see [Problems](#24-problems--potential-improvements).
- `api/` = الطبقة الوحيدة التي تعرف الـ BASE_URL والـ token — نقطة تعديل واحدة لو تغيّر الـ API.
- ملاحظة: **لا يوجد فولدر hooks/ أو services/ منفصل** — الـ API functions معرّفة داخل نفس ملف الصفحة، والتخصيص في `src/api/api.js` فقط.

---

# 3. Routing

## أين يُنشأ الراوتر؟

في `src/App.jsx` — **خارج** الـ component (تعليق الكود نفسه يشرح أن نقله خارج `App()` كان إصلاحًا لـ anti-pattern كان `createBrowserRouter` يُعاد إنشاؤه مع كل render):

```jsx
const Routes = createBrowserRouter([...]);
// App() يعيد استخدام نفس الـ router object
<RouterProvider router={Routes} />
```

مثلًا `queryClient = new QueryClient()` أيضًا خارج المكون — لأنه لو اتعمل جواه لكل render كانت هتعمل cache جديد وتضيع كل البيانات.

## شكل الشجرة

```jsx
{
  path: "/",           // path string
  element: <Layout />, // component اللي هيترندر
  children: [          // الصفحات اللي هتترندر جوه <Outlet/> بتاع Layout
    { index: true, element: <Home /> },        // "/" بالظبط
    { path: "Products", element: <Products /> },
    { path: "ProductDetails/:id", element: <ProductDetails /> },
    ...
    { element: <ProtectedRoute />, children: [ ... محمية ... ] },
    { path: "*", element: <NotFound /> },
  ],
}
```

- **`path`** = نص الرابط (قد يحتوي `:param`).
- **`element`** = أي JSX يُرندر عند مطابقة الـ path.
- **`children`** = nesting؛ الـ Layout يرندر `<Outlet/>` فيتحدث الجزء الداخلي فقط، والـ Navbar/Footer يبقيان ثابتين (بدون re-mount مع التنقل).
- **`index: true`** = الراوت الافتراضي للمسار الأب (`/` → Home).
- **`path: "*"`** = أي مسار غير معروف → `NotFound` (صورة 404 من `assets/error.svg`).

## Dynamic Route — `ProductDetails/:id`

1. الـ `ProductCard` في `Products.jsx` فيه `Link to={`/ProductDetails/${Product.\_id}`}` — الرابط نفسه يحمل الـ id.
2. الراوت `ProductDetails/:id` يلتقط القيمة.
3. داخل `ProductDetails.jsx`:

```jsx
const { id } = useParams();
const {
  data: product,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["product", id], // كاش لكل منتج منفصل
  queryFn: () => GetProductDetails(id),
  enabled: !!id,
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60, // يبقى في الذاكرة ساعة
});
```

4. `queryFn` يطلب `GET /products/{id}` ويعيد `response.data.data` (المنتج نفسه).
5. نفس النمط مع `BrandDetails/:id` (لكن الـ page placeholder) و `CategoryDetails/:id` و `SubCategory/:id` و `OrderDetails/:id`.

## ماذا يحدث عند التنقل؟

`<Link>`/`<NavLink>` يغيّر الرابط بدون reload → الـ Router يقارن المسار بالشجرة → يرندر الـ element المناسب داخل `<Outlet/>` → الـ component الجديد يتركب و `useQuery` تشتغل. إذا كان الـ data موجود في الكاش وغير stale، **لا يُرسل request** ويظهر المحتوى فورًا (ده جوهر React Query).

## Protected Routes

`src/Components/ProtectedRoute/ProtectedRoute.jsx` راوت "بدون element" يجمع الأبناء المحميين:

```jsx
if (!token) {
  toast.error("You are not logged in. Please login to get access", {
    duration: 2500,
  });
  return <Navigate to="/Login" replace />;
}
return <Outlet />;
```

- `replace` = لا يضيف الرابط المحمي في history (زرار Back مش هيضيف صفحة مرفوضة).
- المصدر: `localStorage.getItem("token")` — نفس مصدر الـ interceptor والـ Redux initial state.
- محمي فعليًا: `Addresses, Profile, UpdateProfile, Wishlist, Cart, ChangePassword, Checkout, PaymentSuccess, Orders, OrderDetails/:id`.

---

# 4. API Architecture

## الـ Instance الموحد — `src/api/api.js`

```js
export const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = token; // الـ API يتوقع header باسم "token"
  return config;
});
```

- **Base URL:** ثابت مرة واحدة.
- **Headers:** الـ API الخاص بـ Routemisr يستخدم header مخصص اسمه `token` (مش `Authorization: Bearer`). الـ interceptor يضيفه تلقائيًا على **كل** request لو فيه توكن.
- **`withCredentials`:** غير مستخدم — الـ auth بالتوكن في localStorage، مش cookies.
- **Response interceptor:** لا يوجد — لا يوجد معالجة مركزية للأخطاء/401 (see Problems).

## قائمة الـ Endpoints المستخدمة فعلًا

| Function (الملف)                                       | Method + Endpoint                                | Body/Params                                    | يُستدعى من                                                                       |
| ------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `GetAllProdact` (Products.jsx)                         | `GET /products?limit=100`                        | —                                              | useQuery `["Prodact"]`                                                           |
| `GetProductDetails` (ProductDetails.jsx)               | `GET /products/{id}`                             | —                                              | useQuery `["product", id]`                                                       |
| `GetAllCategories` (Categories.jsx + CategoryTree.jsx) | `GET /categories`                                | —                                              | useQuery `["categories"]` / `["Categorie"]` ⚠️ مفتاحان مختلفان لنفس الـ endpoint |
| `GetAllSubCategories` (CategoryTree.jsx)               | `GET /subcategories?limit=100`                   | —                                              | useQuery `["AllSubCategories"]`                                                  |
| `GetSubCategories` (CategoryDetails.jsx)               | `GET /categories/{id}/subcategories`             | —                                              | useQuery `["subCategories", id]`                                                 |
| `GetAllProducts` (SubCategory.jsx)                     | `GET /products?limit=100`                        | —                                              | ثم فلترة client-side على `subcategory`                                           |
| `GetAllBrands` (Brands.jsx)                            | `GET /brands`                                    | —                                              | useQuery `["Brands"]`                                                            |
| `AddProductToCart` (Cart.jsx)                          | `POST /cart`                                     | `{ productId }`                                | useMutation                                                                      |
| `GetLoggedUserCart` (CartPage/Navbar/Checkout)         | `GET /cart`                                      | header: token                                  | useQuery `["cart"]`                                                              |
| `UpdateCartProduct` (CartPage.jsx)                     | `PUT /cart/{productId}`                          | `{ count }`                                    | useMutation                                                                      |
| `RemoveCartItem` (CartPage.jsx)                        | `DELETE /cart/{productId}`                       | —                                              | useMutation                                                                      |
| `ClearUserCart` (CartPage.jsx)                         | `DELETE /cart`                                   | —                                              | useMutation                                                                      |
| `GetWishlist` (Wishlist/HeartButton/Slide)             | `GET /wishlist`                                  | header: token                                  | useQuery `["wishlist"]`                                                          |
| `AddToWishlist` (HeartButton)                          | `POST /wishlist`                                 | `{ productId }`                                | useMutation                                                                      |
| `RemoveFromWishlist` (×3 ملفات)                        | `DELETE /wishlist/{productId}`                   | —                                              | useMutation                                                                      |
| `CreateCashOrder` (Checkout.jsx)                       | `POST /orders/{cartId}`                          | `{ shippingAddress }`                          | useMutation                                                                      |
| `CreateCheckoutSession` (Checkout.jsx)                 | `POST /orders/checkout-session/{cartId}?url=...` | `{ shippingAddress }` + query `url`            | useMutation → redirect خارجي                                                     |
| signin (Login.jsx)                                     | `POST /auth/signin`                              | `{ email, password }`                          | useMutation                                                                      |
| signup (Register.jsx)                                  | `POST /auth/signup`                              | `{ name, email, password, rePassword, phone }` | useMutation                                                                      |
| forgotPasswords                                        | `POST /auth/forgotPasswords`                     | `{ email }`                                    | useMutation                                                                      |
| verifyResetCode                                        | `POST /auth/verifyResetCode`                     | `{ resetCode }`                                | useMutation                                                                      |
| resetPassword                                          | `PUT /auth/resetPassword`                        | `{ email, newPassword }`                       | useMutation                                                                      |

## ماذا يحدث عند النجاح/الخطأ؟

- **نجاح Query:** الـ data تُخزّن في الكاش تحت الـ queryKey → الـ component يعيد الـ render.
- **نجاح Mutation:** `onSuccess` يُحدّث Redux أو `invalidateQueries` أو يعرض `toast.success` ثم أحيانًا `navigate`.
- **خطأ:** الـ mutations تستخدم `error.response?.data?.message || "رسالة افتراضية"` في `toast.error`. الـ queries تُدار بـ `isError` + UI مخصص، **لكن بعض الصفحات (Categories, CategoryDetails, SubCategory, CategoryTree) لا تعرض أي error UI** — فقط `isLoading`.

## ⚠️ نقطة تنظيمية مهمة

هناك **طبقتان للـ API حاليًا**: الـ instance الموحد (`api.js`) يستخدمه Cart/Wishlist/Checkout/Navbar، بينما Products/Categories/Brands/Auth/CategoryTree لسه بتعمل `axios.get("https://ecommerce.routemisr.com/api/v1/...")` **بعنوان كامل مباشر**. يعني تغيير الـ BASE_URL لازم يتعدل في ~8 ملفات. الحل الأفضل: توحيد الكل على الـ instance (see Problems).

---

# 12. Authentication

## Flow الحقي

**Login:**

```jsx
const { mutate, isPending } = useMutation({
  mutationFn: (values) => axios.post(SIGNIN_URL, values),   // POST /auth/signin
  onSuccess: ({ data }) => {
    saveAuthToStorage({ user: data.user, token: data.token });  // localStorage
    dispatch(setCredentials({ user: data.user, token: data.token })); // Redux
    toast.success("Welcome back!");
    navigate("/");
  },
  onError: (error) => toast.error(error.response?.data?.message || "Something went wrong..."),
});
```

- **Token:** يُخزن في `localStorage` كنص خام.
- **User:** يُخزن JSON string في `localStorage` — مشفر غير موجود.
- **لا cookies ولا HttpOnly ولا withCredentials** — لو الـ API أعطى توكن صالح طويل المدى، الـ XSS في أي سكربت خارجي يستطيع قراءته. see [Security](#25-security).

**Register:** POST `/auth/signup` → toast → `navigate("/Home")` ⚠️ (الراوت الفعلي في App.jsx هو `/` ولا يوجد `/Home` — المستخدم سيصل 404! لكن لا: `/Home` ليست في الشجرة → `path: "*"` → NotFound. **Bug حقي.**)

> تصحيح: انتظر — `navigate("/Home")` في Register. في الشجرة المسجل هو `/` فقط. إذن Register الناجح يودي لـ 404. **مشكلة مؤكدة** (see Problems).

**Forgot/Verify/Reset flow (3 صفحات متسلسلة):**

```
/ForgotPassword  → POST /auth/forgotPasswords { email }
                   → sessionStorage.setItem("resetEmail", email) → navigate /VerifyResetCode
/VerifyResetCode → 6-digit OTP inputs (useRef + paste support + timer 60s)
                   → POST /auth/verifyResetCode { resetCode } → navigate /ResetPassword
/ResetPassword   → PUT /auth/resetPassword { email, newPassword }
                   → sessionStorage.removeItem("resetEmail") → navigate /Login بعد 1.8 ثانية
```

- الـ `email` ينتقل بين الصفحات عبر **sessionStorage** — لا query params ولا route state.
- `VerifyResetCode` يحمي نفسه: `useEffect` لو لا email → navigate back.
- `ResetPassword` كذلك يتحقق من الـ email عند submit.

## كيف يعرف التطبيق أن المستخدم Logged In؟

ثلاث قراءات **مستقلة** لنفس الحقيقة (source of truth = localStorage):
1. `Navbar`: `useSelector(s => s.authentication.token)` — Redux (initialized من localStorage).
2. `ProtectedRoute`: `localStorage.getItem("token")` مباشر.
3. `WishlistSlide`/`CartPage`/queries: `!!localStorage.getItem("token")` مباشر.

منطقيًا متسقة، لكن **3 مصادر للقراءة** = 3 أماكن للتحديث عند أي تغيير مستقبلي (مثلًا token انتهت صلاحيته في الـ server لكنه لا يزال في localStorage → ProtectedRoute يسمح والـ API يرفض 401 ولا يوجد response interceptor يلتقطها — see Problems).

## Authentication vs Authorization

- **Authentication:** "من أنت؟" — signin/signout، تخزين الـ token.
- **Authorization:** "ماذا مسموح لك؟" — في هذا المشروع **غير موجود كطبقة UI**: لا أدوار (admin/user)، لا قيود على ما يراه المستخدم مسجّل الدخول. الـ ProtectedRoute هو guard للـ routes فقط (authentication gate).

---

# 13. Navbar

`src/Components/Navbar/Navbar.jsx` (465 سطر) — أهم الـ منطق:

## الـ Query والـ sync

```jsx
const { data: CartData } = useQuery({
  queryKey: ["cart"],              // مفتاح موحد (كان ["cart", token] — FIX موثّق)
  queryFn: () => GetLoggedUserCart(),
  enabled: !!token,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
});

useEffect(() => {
  if (CartData) dispatch(setCart(CartData.numOfCartItems || 0));
}, [CartData, dispatch]);
```

**ليه الـ useEffect ده؟** لأن الـ query في Navbar تشتغل أول ما المستخدم يدخل (لو logged in)، فيملأ Redux فورًا — بدونه العدّاد يظل 0 حتى تزور صفحة السلة. (تعليق FIX يشرح أن المشكلة التاريخية كانت العدّاد يظهر بعد refresh فقط.)

## الـ logout

```jsx
const handleLogout = () => {
  clearAuthFromStorage();     // localStorage (token + user)
  dispatch(logout());         // Redux → user/token = null
  dispatch(setCart(0));       // العدّاد يصفّر
  queryClient.clear();        // ⭐ يمسح كاش React Query بالكامل — بدونها السلة/الـ wishlist القديمة تظل ظاهرة
  toast.success("Logged out successfully");
  navigate("/Login");
};
```

**النقطة التعليمية:** `queryClient.clear()` هنا مهمة جدًا — الكاش مفاتيحه لا تشمل الـ user، فلو بقيت data المستخدم الأول بعد خروجه وسجل دخول مستخدم آخر، سيظهر cart/wishlist الخطأ قبل الـ refetch.

## الـ links

```js
const Links = [
  { name: "Home",     path: "/" },
  { name: "Brands",   path: "/Brands" },
  { name: "Products", path: "/Products" },
  { name: "Cart",     path: "/Cart" },
];
```

- يُرندرون بـ `NavLink` مع `className={({isActive}) => ...}` — الزر النشط يظهر بـ bg أزرق.
- كارت link معالجة خاصة: أيقونة سلة + badge أحمر يظهر فقط إذا `cartCount > 0` + animation scale spring عند التغيير.
- **لا responsive menu للأجهزة الصغيرة:** الـ links داخل `hidden md:flex` — على الموبايل الـ links تختفي تمامًا ولا يوجد hamburger/قائمة منسدلة. **مشكلة حقيقية** (see Problems).
- **Wishlist:** زرار قلب يفتح `WishlistSlide` drawer (`useState(wishlistOpen)`) — لا عدد ظاهر.
- **Auth area:** بدون user → زرار Login فقط (زرار Register نُقل لصفحة Login — تعليق FIX). مع user → "Hello {name}" + زرار Logout أحمر.
- **AnnouncementBar** يُرندر أسفل الـ nav — شريط أخضر متحرك (TextLoop: CSS `@keyframes marquee` + `content.repeat(8)` مرتين للحلقة اللانهائية).
- **A11y جيد نسبيًا:** `aria-label` على أزرار Wishlist/Close.

---

# 14. Components

### `Layout` (Components/Layout.jsx)
- **Purpose:** هيكل الصفحات: Navbar فوق + `<main>` يحوي `<Outlet/>` + Footer.
- **Why:** دون layout، كل صفحة كان لازم تكرر Navbar/Footer. الـ Outlet يجعل التنقل يبدل الجزء الأوسط فقط.
- **Data flow:** لا يملك state — مرور فقط.

### `Navbar`
- **State:** `wishlistOpen` (drawer). **Hooks:** useSelector/dispatch/useQuery/useEffect/useNavigate/useQueryClient.
- **API:** `GET /cart` (enabled: token).
- **Redux:** يقرأ `authentication.token/user` و `cart.count`، ويكتب `setCart`.
- **Events:** logout, open wishlist drawer, links.
- **Conditional rendering:** `!reduxUser ? (Login button) : (Hello + Logout)`; badge فقط عند `cartCount > 0`; links `hidden md:flex`.

### `AnnouncementBar` + `TextLoop`
- **Purpose:** شريط عروض متحرك أفقياً.
- **How:** CSS `@keyframes marquee` (translateX 0 → -50%) مع تكرار النص 8 مرات × 2 span = دورة لا نهائية. `pauseOnHover` عبر `hover:[animation-play-state:paused]`.
- **Why يدويًا؟** بسيط بلا dependency — بدائل: مكتبة marquee أو GSAP (غير مستخدم هنا رغم تثبيته).

### `Footer`
- HTML منسوخ من Flowbite docs — لينكات خارجية إلى flowbite.com و social فارغة (`href="#"`). **ليس مخصصًا للمشروع** — placeholder جاهز للتبديل.

### `NotFound`
- صورة `assets/error.svg` وسط الشاشة. يُرندر للراوت `*` فقط.

### `ProtectedRoute`
- يوضح أعلاه. **الحكم:** تنفيذ سليم، لكن يستخدم `toast` أثناء render (side effect في render phase — React 18 StrictMode قد يطلقه مرتين في dev). الأنظف: `useEffect` للـ toast + render الـ Navigate فورًا.

### `Cart` (زرار)
- `src/pages/Cart/Cart.jsx` — رغم اسمه ومكانه، **هو زرار Add To Cart مش صفحة** (الصفحة `CartPage.jsx`). تُستخدم في Products + ProductDetails + Wishlist + WishlistSlide.
- **State:** `isAdded`, `isAnimating` (2 setTimeout يدوي للـ UI).
- **Mutation:** POST `/cart`; onSuccess يحدّث Redux + invalidate `["cart"]` + toast.
- **UI:** AnimatePresence يبدّل بين "Add To Cart" (أيقونة بتتحرك) و"Added Successfully" (✓). `disabled` أثناء pending.
- **Error handling:** أي فشل يظهر رسالة "You are not logged in..." — حتى لو الخطأ 500 أو network. **ضعيف** (see Problems).

### `WishlistHeartButton`
- زرار قلب مع animation معقدة (ripple + 3 particles + scale/rotate spring). Toggle بين Add/Remove mutation. يُستخدم في Products + ProductDetails.

### `WishlistSlide`
- drawer جانبي (vaul `Drawer.Root direction="right"`) — 420px، portal فوق كل شيء. يعرض نفس محتوى صفحة Wishlist. Loading/Empty/Login-required/error states كاملة.

### `CategoryTree`
- sidebar فلترة داخل صفحة Products. يستقبل props: `selectedCategory/selectedSubCategory/onCategoryChange/onSubCategoryChange` (lifting state up — الصفحة الأم تملك الفلترة).
- **Queries:** `["Categorie"]` للـ categories + `["AllSubCategories"]` (GET /subcategories?limit=100) ثم فلترة local على `subCategory.category === category._id` لبناء الشجرة.
- **نقطة تسمية:** `["Categorie"]` (بدقّة إملائية ناقصة) مفتاح مختلف عن `["categories"]` في Categories.jsx — **نفس الـ endpoint مطلوب مرتين في كاشين مختلفين** (see Problems).

### `StatCard` / `InfoCard` / `Field`
- مكونات داخلية (نفس الملف) في ProductDetails وصفحات Auth — لا تُصدّر، مقبولة لأنها presentation-only.

---

# 15. Hooks

## المخصص: **لا يوجد أي custom hook في المشروع** (لا فولدر hooks/، ولا ملف useXxx). كل المنطق inline في الصفحات. هذه نقطة تحسين أساسية — see Problems.

## الـ Hooks المضمنة المستخدمة فعليًا

| Hook | أين | لماذا | التأثير على render |
|---|---|---|---|
| `useState` | كل صفحة | حالة محلية (search, form, drawer open, isAdded...) | أي تغيير يعيد render المكون |
| `useEffect` | Navbar, CartPage (sync Redux), VerifyResetCode (timer + email guard), PaymentSuccess (setTimeout غلط — مباشر في المكون) | side effects بعد render | لا يعيد render إلا إذا غيّر state |
| `useMemo` | Products (2), CartPage (2), Checkout, Wishlist ×2, Brands | caching حسابات مشتقة | يمنع إعادة الحساب إذا deps لم تتغير |
| `useCallback` | **غير مستخدم في أي مكان** | — | — |
| `useParams` | ProductDetails, BrandDetails, CategoryDetails, SubCategory, OrderDetails | قراءة `:id` من الرابط | قيمة نصية؛ تغيير الـ id يعيد تشغيل الـ query بسبب queryKey |
| `useNavigate` | Login/Register/Checkout/CartPage/Auth pages/Navbar | تنقل برمجي | — |
| `useRef` | VerifyResetCode (OTP inputs) | refs للعناصر للـ focus | لا render |
| `useSelector` | Navbar, Cart button, CartPage, Checkout?, PaymentSuccess | قراءة Redux | يترندر عند تغير القيمة المحددة فقط |
| `useDispatch` | Navbar, Cart, CartPage, Login, PaymentSuccess | إرسال actions | — |
| `useQuery` | 10+ مواضع | server state | يتغير مع حالة الكاش |
| `useMutation` | Cart, CartPage ×3, Wishlist ×3, Checkout ×2, Auth ×5 | عمليات الكتابة | isPending/isSuccess للـ UI |
| `useQueryClient` | Navbar, Cart, CartPage, Wishlist, Checkout | invalidate/refetch/clear | — |
| `useForm` (RHF) | Login, Register, ForgotPassword, ResetPassword | forms + validation | يعيد render عند تغيّر formState |

---

# 16. Performance

## ما هو مستخدم فعلًا

| التقنية | أين | تقييمي الصريح |
|---|---|---|
| `staleTime: Infinity` | Products, Categories, CategoryTree, Brands, SubCategory, Checkout cart | **مناسب للـ static-ish data** (كاتيجوري/براندات). **خطر للـ cart** في Checkout: لو المستخدم عدّل السلة في تاب آخر وعاد، الـ Checkout يعرض السلة القديمة إلى الأبد (لا refetch). CartPage أصلحها لـ 30s. **غير متسق.** |
| `refetchOnWindowFocus: false` | كل الـ queries | يمنع refetch عند العودة للتاب — مفيد للشبكة، ضار لو data server-side تتغير كثيرًا |
| `gcTime: 1000*60*60` | ProductDetails فقط | يحفظ تفاصيل منتج أغلى كثيرًا (ساعة) — جيد للتنقل ذهاب/عودة |
| `useMemo` | Products/CartPage/Checkout/Wishlist/Brands | على 100 عنصر **غير ضروري أداءً** لكنه يمنع إعادة إنشاء الـ arrays المرتبطة بالـ dependencies — مقبول كـ hygiene |
| `React.lazy` / code splitting | **غير مستخدم** | الـ bundle ملف واحد — كل الصفحات (placeholders مضمنة) في chunk واحد |
| `React.memo` | **غير مستخدم** | مع 100 كارت منتج + كتابة في search، كل حرف يعيد render الـ grid كامل. الحل الحقي: استخراج ProductCard + `memo` عليه |
| lazy images (`loading="lazy"`) | **غير مستخدم** | 100 صورة تُطلب فورًا في Home/Products |

## ملاحظة موازنة

أكبر مشكلة أداء فعلية في المشروع ليست الـ useMemo — بل:
1. `GET /products?limit=100` يطلب كل شيء مرة واحدة (بدل pagination/limit=20 مع infinite scroll).
2. كل كارت يركّب `WishlistHeartButton` بـ useQuery كاملة — React Query dedup يمنع طلبات الشبكة لكن الـ components تُركب 100 مرة.
3. لا `loading="lazy"` على الصور.

---

# 17. UI / UX Libraries

| المكتبة | الدور الفعلي | لماذا بدل البديل؟ | مثال |
|---|---|---|---|
| **Tailwind CSS 4** | كل الـ styling (utility classes في الـ JSX) | لا ملفات CSS منفصلة؛ تصميم responsive inline (`grid-cols-1 lg:grid-cols-[280px_1fr]`). البديل: CSS modules أبطأ للتكرار، styled-components غير مطلوب | `Products.jsx` grid |
| **lucide-react** | أيقونات SVG (Star, Heart, ShoppingCart, ...) | tree-shakeable: import واحد لكل أيقونة، حجم صغير | `Navbar`, `Products` |
| **motion** (`motion/react`) | entrance animations, AnimatePresence, spring badge, whileHover/Tap | البديل CSS keyframes لا يدعم AnimatePresence بسهولة (exit animations) | Navbar badge, Cart button |
| **Swiper** | Slider (fade+pagination) + Categories (autoplay marquee) | يدعم breakpoints/loop/autoplay جاهزة — بدائل (keen-slider, embla) أصغر لكن Swiper ناضج | `Slider.jsx`, `Categories.jsx` |
| **react-hot-toast** | إشعارات (موضع top-center، استايل موحد في App.jsx) | API بسيط `toast.success/error`، لا يحتاج context | كل الـ mutations |
| **vaul** | drawer wishlist | drawer جاهز بـ drag-to-dismiss + a11y (Drawer.Title) | `WishlistSlide.jsx` |
| **react-loader-spinner** | Oval loader | loader جاهز (كان ممكن CSS border spinner — CartPage فعلاً استخدم CSS يدوي!) | `Products.jsx` vs `CartPage.jsx` |
| **react-helmet-async** | `<title>` + og: meta لكل صفحة | SPA يغيّر الـ head ديناميكيًا للـ SEO/مشاركة | `ProductDetails.jsx` |
| **flowbite-react** | ❌ غير مستخدم | — | — |
| **gsap** | ❌ غير مستخدم | — | — |

---

# 18. Forms + Validation

## Login (`pages/Auth/Login.jsx`)

```js
const Schema = Zod.object({
  email: Zod.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  password: Zod.string().min(1, "Password is required"),
});

const { register, handleSubmit, formState: { errors } = useForm({
  resolver: zodResolver(Schema),
  mode: "onTouched",      // validation بعد أول blur ثم مع كل تغيير
  defaultValues: { email: "", password: "" },
});
```

- **register("email")** يربط الـ input بـ uncontrolled state داخلي في RHF (بدون useState لكل حقل).
- **handleSubmit((values) => mutate(values))** لا يشغّل الـ mutate إلا إذا الـ Zod schema نجح.
- **errors.email.message** تُعرض في `<p role="alert">` (a11y جيد).
- **noValidate** على الـ form لتعطيل HTML5 validation المزدوج.

## Register

Schema أغنى: `name` (3–20)، `email`، `password` (min 6)، `rePassword`، `phone` بـ regex مصري `^01[0125][0-9]{8}$` + `.refine((d) => d.password === d.rePassword, { path: ["rePassword"] })` — cross-field validation.

## Forgot/Reset Password — RHF بدون Zod

يستخدم `register("email", { required, pattern })` و `register("newPassword", { required, minLength })` و `validate: (v) => v === password` — **قواعد RHF المضمنة** بدل Zod. لا مشكلة، لكن **غير متسق** مع Login/Register (see Problems: توحيد النمط).

## Checkout — بدون RHF إطلاقًا

manual useState + onChange + validation يدوي عند submit. see [Checkout](#9-checkout).

## ملخص RHF concepts

| Concept | ماذا يفعل | أين استُخدم |
|---|---|---|
| `register` | ربط input بـ RHF (name, ref, onBlur, onChange) | كل الفورمات |
| `handleSubmit` | يمنع default + يتحقق + يمرر values | كل الفورمات |
| `formState.errors` | رسائل الأخطاء per-field | كل الفورمات |
| `watch` | قراءة قيمة live (password strength indicator) | `ResetPassword` فقط |
| `mode: "onTouched"` | validation بعد أول blur | Login/Register |
| `resolver: zodResolver` | ربط Zod بـ RHF | Login/Register فقط |
| `setValue` / `reset` | **غير مستخدمين في المشروع** | — |

---

# 19. Error Handling

| الحالة | ماذا يراه المستخدم | أين تُكتشف | كيف تنتقل |
|---|---|---|---|
| API error (mutation) | toast.error برسالة الـ API أو fallback | `onError` في useMutation | لا state — toast فقط |
| API error (query) | صفحة/مكان مخصص للأخطاء | `isError` في useQuery | render branch |
| **Query error غير مُدار** | **لا شيء — تظهر UI فارغة** | — | Products/Categories/CategoryTree/SubCategory لا تدير isError |
| 401 unauthorized (منتهي الصلاحية) | رسالة "You are not logged in..." في toast | mutation onError فقط | **لا redirect لـ Login ولا response interceptor** — توكن منتهي يبقى في localStorage |
| Validation error | نص أحمر تحت الحقل | RHF/Zod أو manual check | local state |
| Network error | toast عام ("Something went wrong") | onError | — |
| Empty state | Empty UI مخصص (Cart, Wishlist, Products, Brands) | `.length === 0` | — |
| Loading | Spinner/shimmer/skeleton (Oval, CSS spinner, skeleton في ProductDetails) | `isLoading` | — |

**أكبر ثغرة خطأ:** لا يوجد `response interceptor` لالتقاط 401 عالميًا (تنظيف التوكن + redirect). كل mutation يدير الخطأ بعزل، والـ queries تستخدم `error?.response?.data?.message || fallback` دون تمييز 401 عن 500.

---

# 20. Data Flow (ASCII)

## إضافة منتج للسلة

```
ProductCard (Products.jsx)
   ↓ click
Cart component: AddMutation.mutate(productId)
   ↓ POST /cart { productId }   (token تلقائي من interceptor)
   ↓ response { numOfCartItems }
onSuccess:
   ├─ dispatch(setCart(num))  → Redux { cart: { count: num } }
   ├─ invalidateQueries(["cart"]) → refetch GET /cart → تحديث الـ items في CartPage
   └─ toast + UI "Added Successfully"
   ↓
Navbar: useSelector(s => s.cart.count) → badge re-render
```

## Wishlist toggle

```
Heart click
   ↓ toggleWishlist() → (token check)
   ↓ Add/RemoveMutation.mutate(productId)
   ↓ POST/DELETE /wishlist
onSuccess → invalidateQueries(["wishlist"])
   ↓ refetch GET /wishlist → cache تحدّث
   ↓ كل HeartButtons + Wishlist page + Slide drawer re-render
   ↓ isWishlisted يُحسب من جديد → القلب يتحول أحمر/أبيض
```

## Checkout (كاش)

```
Checkout form (formData state)
   ↓ handleSubmit
   ↓ manual validation (trim checks)
   ↓ CashOrderMutation.mutate({ cartId, shippingAddress })
   ↓ POST /orders/{cartId}
onSuccess:
   ├─ invalidateQueries(["cart"])     → refetch السلة (المفروض فاضية)
   ├─ toast.success("Order placed successfully")
   └─ navigate("/PaymentSuccess")
        ↓ (بعد 1.5s setTimeout)
        dispatch(setCart(0))          → Navbar badge يختفي
```

## Register → Home (Bug مسار)

```
Register success → navigate("/Home") → لا راوت "/Home" → path "*" → NotFound ❌
```

---

# 21. Full User Journey

1. **يدخل الموقع** → `main.jsx` → Providers → Router → `/` → Home: Slider (Swiper static images) + Categories (useQuery ["categories"]) + Products (useQuery ["Prodact"] — نفس instance query في الصفحة داخل Home أيضًا!).
2. **يشاهد المنتجات** → كروت مع خصم اصطناعي 10–30%. كل كارت يركّب HeartButton (query مشتركة ["wishlist"] إن كان logged in).
3. **يدخل Product Details** → `Link` → `ProductDetails/:id` → useParams → useQuery(["product", id]) → GET /products/{id} → عرض تفاصيل + صور (thumbnails تغيّر `selectedImage` state) + SEO helmet.
4. **يضيف للسلة** → زرار Cart → POST /cart → Redux setCart + invalidate ["cart"] → Navbar badge +1 + toast.
5. **يزيد Quantity** → في CartPage → PUT /cart/{id} { count } → refetch → UI يتحدث (السعر/الإجمالي يعاد حسابهم بـ useMemo).
6. **يذهب إلى Cart** → NavLink → CartPage (محمية) → GET /cart (كاش أو طلب جديد لو >30s).
7. **يذهب إلى Checkout** → زرار Proceed → navigate("/Checkout") → query ["cart"] (كاش).
8. **يملأ البيانات** → details/phone/city manual state → اختيار cash/online.
9. **يرسل Order** → POST /orders/{cartId} أو checkout-session.
10. **API request** → token تلقائي، shippingAddress body.
11. **تأكيد** → invalidate cart + toast + navigate.
12. **مسح Cart** → الـ refetch يعيد سلة فارغة + `PaymentSuccess` يصفّر Redux بعد 1.5s.
13. **Success page** → زراران: Continue Shopping / Home.

**داخل React في كل خطوة:** كل navigate يفكّ الصفحة السابقة ويركّب الجديدة (الـ Layout يبقى). الـ queries نشطة فقط أثناء تركيب مكوناتها. Redux يبقى حيًا طوال عمر الصفحة. الكاش يبقى حتى gcTime أو logout (`queryClient.clear()`).

---

# 22. File-by-File Explanation

### `src/main.jsx`
- **Purpose:** entry point — `createRoot` + `<StrictMode><App/></StrictMode>`.
- **Note:** StrictMode يعمل double-invoke لـ effects في dev — الـ queries قد تُشغل مرتين (React Query يتعامل معها بـ dedup).

### `src/App.jsx`
- **Purpose:** كل الـ Providers + كل الـ routes.
- **Important logic:** `queryClient` و `createBrowserRouter` خارج المكون (مرة واحدة).
- **Dependencies:** كل الصفحات (static imports — لا code splitting).
- **Issue:** imports صفحات Profile غير الموجودة → build يفشل (انظر التنبيه أعلاه).

### `src/api.js`
- **Purpose:** axios instance + interceptor للـ token.
- **Used by:** Navbar, Cart, CartPage, Wishlist ×3, Checkout.
- **Data flow:** أي request → interceptor يقرأ localStorage → header `token`.

### `src/Redux/store.js`
- **Purpose:** configureStore بـ cart + authentication.
- **Why:** نقطة تجميع واحدة؛ DevTools مجانية.

### `src/Redux/CartSlice.js`
- **Purpose:** عدّاد عرض فقط. **Data flow:** setCart/clearCart من onSuccess/effect/Logout/PaymentSuccess.
- **Why صغير:** الـ items الفعلية في React Query cache — Redux لا يكررها.

### `src/Redux/AuthenticationSlice.js`
- **Purpose:** user + token + storage helpers.
- **Important logic:** initial state يقرأ localStorage مرة واحدة عند تحميل الـ store — بعد الـ login، الـ dispatch هو ما يحدّث الـ UI (localStorage لا يُشغّل re-render بذاته — لذلك الـ dispatch ضروري).

### `src/pages/Products/Products.jsx`
- **Purpose:** جلب 100 منتج + بحث + فلترة + grid.
- **Important logic:** getDiscount اصطناعي، useMemo ×2، لا isError UI.
- **Used by:** Home (embed) + route /Products.

### `src/pages/Products/ProductDetails.jsx`
- **Purpose:** تفاصيل منتج + SEO + صور + stats.
- **Data flow:** useParams → useQuery(["product", id]) → destructuring fields → UI + StatCard/InfoCard.
- **Why staleTime Infinity:** تفاصيل المنتج نادرًا تتغير في session واحدة.

### `src/pages/Products/CategoryTree.jsx`
- **Purpose:** sidebar شجرة كاتيجوري→ساب.
- **Data flow:** props up (onChange) → Products.jsx state → FilteredProducts.

### `src/pages/Cart/Cart.jsx`
- **Purpose:** زرار Add To Cart (مش صفحة!). **Used by:** Products, ProductDetails, Wishlist, WishlistSlide.

### `src/pages/Cart/CartPage.jsx`
- **Purpose:** صفحة السلة: عرض + تعديل كمية + حذف + مسح + ملخص + زرار Checkout.
- **Data flow:** query ["cart"] → Products memo → CartSummary memo → UI؛ mutations → dispatch + refetch.

### `src/pages/Checkout/Checkout.jsx`
- **Purpose:** شحن + اختيار دفع + إنشاء order.
- **Important logic:** مفتاحا mutation منفصلان (cash/online)؛ isSubmitting يجمعهما.

### `src/pages/Checkout/PaymentSuccess.jsx`
- **Purpose:** تأكيد بصري + `setTimeout → dispatch(setCart(0))` (مشكلة موثقة أعلاه).

### `src/pages/Wishlist/*`
- 3 ملفات (زرار/صفحة/drawer) تشارك queryKey ["wishlist"] — انظر قسم Wishlist.

### `src/pages/Auth/*`
- Login/Register (RHF+Zod)، Forgot/Verify/Reset (RHF built-in + sessionStorage بين الصفحات + OTP UX كامل).

### `src/pages/Categories/*`
- Categories (Swiper) + CategoryDetails (subcategories) + SubCategory (فلترة منتجات client-side).

### `src/pages/Brands/Brands.jsx`
- جلب براندات + بحث + grid. isError مُدار هنا (عكس Products!).

### `src/pages/Home.jsx`
- تركيب Slider + Categories + Products فقط (29 سطر) — بعد تنظيف dead code (تعليقات FIX).

### `src/Components/*`
- Layout, Navbar (الأثقل — 465 سطر بسبب animation markup), Footer (قالب Flowbite), NotFound, ProtectedRoute, AnnouncementBar/TextLoop.

---

# 23. Why These Technologies?

| المقارنة | الاختيار في المشروع | متى يكون منطقيًا | متى لا يكون |
|---|---|---|---|
| **Redux vs Context API** | Redux Toolkit | يسهّل DevTools/time-travel، لا مشكلة re-render بالمقارنة مع Context الكبير. في هذا المشروع الحالة الصغيرة (عداد + auth) كان Context يكفيها أيضًا — Redux هنا "تثقيل" بسيط لكن مقبول كتعلم | لو الحالة العالمية 2-3 قيم فقط بدون تحديثات معقدة |
| **Redux vs useState** | Redux للـ cart count + auth | العدّاد يُعرض في Navbar ويكتب من 4 مكونات مختلفة — useState يعني props drilling من كل صفحة للـ Layout | للـ UI المحلي (isAdded, search) — useState صحيح ويُستخدم صحيحًا |
| **React Query vs Redux** | فصل واضح: server state في RQ، UI state في Redux | الـ cart items تحتاج caching/invalidation/refetch — إعادة بنائها يدويًا في Redux = تكرار ألم الـ loading/error | لو أردت Redux فقط: ستحتاج thunks + loading/error flags لكل request |
| **Axios vs fetch** | axios (instance + interceptor) | interceptor للـ token مركزيًا؛ JSON parsing تلقائي؛ timeouts أسهل | fetch أصغر حجمًا (native) لكن كل الـ boilerplate يدوي |
| **RHF vs controlled forms** | RHF في Auth، manual في Checkout | uncontrolled = renders أقل + validation declarative | لفورم 3 حقول بسيطة manual مقبول — لكنه غير متسق مع باقي المشروع |
| **Zod vs manual validation** | Zod في Login/Register فقط | schema واحد قابل لإعادة الاستخدام + type inference مستقبليًا (TS) | له صفحات بسيطة overhead بسيط زائد — المشروع استخدمه جزئيًا (غير متسق) |
| **Tailwind vs CSS عادي** | Tailwind 4 | سرعة، consistency، لا naming fatigue | الكلاسات الطويلة جدًا (Navbar/Checkout) تصبح صعبة القراءة — مكونات مشتركة أو @apply كان يخف |
| **Swiper vs custom slider** | Swiper | autoplay + loop + breakpoints + a11y جاهزة | custom = وقت + أخطاء touch events |
| **useMemo vs عادي** | مستخدم بكثافة | على حسابات معقدة أو lists ضخمة | على 100 عنصر = حماية بلا تكلفة فعلية (لا يضر، لكن لا تحسبه optimization حقيقية هنا) |

---

# 24. Problems / Potential Improvements

قائمة صريحة، بترتيب الخطورة:

### 🔴 P0 — Build breaker
1. **`App.jsx` يستورد `pages/Profile/{Profile,UpdateProfile,ChangePassword}` والفولدر غير موجود.** المشروع لن يعمل `npm run dev` أو `build` إطلاقًا. **الحل:** إنشاء الصفحات (استخدم نمط Orders placeholder مؤقتًا) أو حذف imports + الراوتات الثلاثة.

### 🔴 P0 — Functional bugs
2. **`Register` الناجح يودّي لـ 404:** `navigate("/Home")` والراوت الفعلي هو `/`. **الحل:** `navigate("/")`.
3. **الـ Navbar بلا قائمة موبايل:** `hidden md:flex` يخفي links تحت 768px بلا بديل. **الحل:** hamburger + drawer (نفس نمط WishlistSlide بـ vaul).
4. **`PaymentSuccess` يصفّر السلة بلا تحقق:** `setTimeout(dispatch(setCart(0)), 1500)` خارج useEffect، وبدون تحقق من الـ payment فعليًا (أونلاين: الـ Stripe يعيد للمستخدم للـ url بغض النظر عن النجاح). **الحل:** useEffect + تحقق session عبر endpoint أو على الأقل قراءة query params من Stripe.
5. **Products لا يعرض أخطاء:** فشل الـ API يظهر "No Products Found". **الحل:** `const { isError } = useQuery(...)` + error UI.

### 🟠 P1 — Architectural
6. **دوال API مكررة ومتفرقة:** `GetWishlist` معرّفة 3 مرات، `RemoveFromWishlist` 3 مرات، `GetLoggedUserCart` 3 مرات، `GetAllCategories` مرتين. **الحل:** `src/api/productsApi.js / cartApi.js / wishlistApi.js / authApi.js` — ملف واحد يصدّر كل الـ functions.
7. **صفحات لسه تستخدم axios مباشر بعنوان كامل** (Products, Categories, CategoryTree, CategoryDetails, SubCategory, Brands, Auth pages) بينما البقية على الـ instance. **الحل:** توحيد كامل — تغيير BASE_URL مستقبليًا يصبح سطرًا واحدًا.
8. **queryKey غير متسق:** `["Prodact"]` (خطأ إملائي)، `["Categorie"]` مقابل `["categories"]` — نفس الـ endpoint في كاشين مختلفين = طلب مزدوج. **الحل:** ثوابت: `export const KEYS = { products: ["products"], categories: ["categories"], ... }`.
9. **`WishlistSlide` يقرأ token في render** (`let user = localStorage.getItem(...)`) — غير reactive. **الحل:** `useSelector(s => s.authentication.token)`.
10. **لا response interceptor للأخطاء:** 401 لا يُلتقط عالميًا (توكن منتهي = UI يظل "logged in" وكل mutation يفشل بصمت toast). **الحل:**
```js
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Login";
  }
  return Promise.reject(error);
});
```

### 🟡 P2 — Code quality
11. **لا custom hooks:** منطق useQuery/useMutation معرّف inline 15+ مرة. **الحل:** `useCart()`, `useWishlist()`, `useProducts()` hooks — إزالة التكرار فورًا.
12. **`CartPage` يعرّف `getToken()` محليًا** — منطق مصدر التوكن موزع. **الحل:** مصدر واحد (Redux token أو helper في api.js).
13. **Products.jsx 630 سطر** والـ card inline. **الحل:** استخراج `ProductCard.jsx` + `memo` عليه (يفيد فعليًا مع كتابة في search).
14. **تسميات مضللة:** ملف `Cart.jsx` هو زرار (يجب `AddToCartButton.jsx`)؛ `queryKey: "Prodact"`؛ `const { data } = await axios.get` مع `return data` — تسمية `data.data` في Products غير واضحة. **الحل:** تسميات واضحة + مستوى واحد فقط للـ unwrap في الـ API layer.
15. **`useCallback` صفر استخدام** — handlers تُعاد كل render. غير حرج (لا components مُحفظة تستقبلها)، لكن مع استخراج ProductCard + memo ستصبح ضرورية أو استخدم للـ ref stability.
16. **toast.error عام لكل خطأ** في زرار Cart (`onError: () => toast.error("You are not logged in...")`) — حتى لو الخطأ 500. **الحل:** `error.response?.status === 401 ? "login message" : (error.response?.data?.message || "Try again")`.
17. **Footer قالب Flowbite غير مخصص** + لينكات `href="#"` — UX مضل.

### 🟢 P3 — UX/A11y/Perf
18. **كل المنتجات بـ limit=100** — لا pagination. الـ API يدعم `limit`/`page` — استخدم infinite query أو pagination.
19. **لا `loading="lazy"` على صور المنتجات** — 100 طلب صورة فوريًا.
20. **بعض الأزرار بلا `type="button"` داخل الفورمات** (أزرار +/- في CartPage خارج فورم — آمن حاليًا، انتبه عند نقلها).
21. **`setTimeout` في `PaymentSuccess` و `Cart.jsx` onSuccess** (isAdded/isAnimating) — بلا cleanup؛ لو فُك المكون قبل انتهاء المهلة → setState على مكون مفكوك (React 18 لا يحذر لكنه anti-pattern). **الحل:** useEffect cleanup أو ref.
22. **flowbite-react + gsap dead dependencies** — أزلهما من package.json (تقليل install/bundle).
23. **`swal`-like تأكيدات مفقودة:** "Clear Cart" يحذف فورًا بلا confirm — خطوة destructive بدون حماية.
24. **A11y:** جيد نسبيًا (aria-label, role="alert", sr-only) — لكن `onClick` على `div` في Categories/CategoryDetails بلا `role="button"` ولا keyboard support.

---

# 25. Security

| النقطة | الوضع الحالي | الخطر | التحسين |
|---|---|---|---|
| Token storage | `localStorage` نص خام | أي XSS يسرق التوكن (لا HttpOnly) | HttpOnly cookie من الـ backend + CSRF protection، أو至少 صفّر التوكن عند 401 |
| User data in localStorage | JSON نصي | قابل للتعديل من الـ console (المستخدم يمكن يزوّر اسمه في الـ UI — غير مؤثر server-side) | لا تثق به؛ البيانات الحساسة من الـ API كل مرة |
| Header `token` | custom header مش Authorization | غير قياسي لكن مقبول لأن الـ API كذلك | ثبّت الـ contract في وثيقة |
| 401 handling | لا شيء عالمي | جلسة "زومبي" | response interceptor (كود أعلاه) |
| Validation client-side فقط | phone/email regex في الـ UI | الـ backend هو الخط الدفاعي — لا افترض أن الـ Zod يحمي | تحقق server-side (مسؤولية الـ backend) |
| Secrets | لا يوجد .env ولا secrets في الكود ✅ | — | لو أضفت مفاتيح، استخدم `VITE_` env vars وكن واعيًا أنها تظهر للمتصفح anyway |

---

# 26. Installation & Running

```bash
npm install
npm run dev        # vite dev server
npm run build      # production build (⚠️ سيفشل حاليًا — مشكلة Profile أعلاه)
npm run preview
npm run lint       # eslint
```

- **Environment Variables:** لا يوجد `.env` ولا استخدام لـ `import.meta.env` في المشروع — الـ BASE_URL hardcoded في `src/api.js` وفي ~8 ملفات أخرى. **التحسين:** `VITE_API_URL` + توحيد الاستخدام على الـ instance.
- **Backend:** API عام جاهز على `ecommerce.routemisr.com` — لا backend محلي مطلوب. أنشئ حسابًا من صفحة Register للاستخدام.

---

# 27. How To Understand This Project

Roadmap مقترح للفهم بالترتيب:

1. **ابدأ من `src/App.jsx`** — ارسم في رأسك شجرة الـ routes وافهم Providers order (Helmet → QueryClient → Redux → Router).
2. **`src/main.jsx`** — 11 سطر فقط، تؤكد نقطة الدخول.
3. **`src/api.js`** — 29 سطر؛ افهم الـ instance والـ interceptor. هذا يفسر كيف تعمل كل protected request.
4. **`src/Redux/store.js` ثم `CartSlice.js` ثم `AuthenticationSlice.js`** — كلهم قصار؛ افهم أن Redux هنا display layer فوق الـ server state.
5. **`src/Components/Layout.jsx` ثم `ProtectedRoute.jsx`** — الهيكل والحماية.
6. **`src/pages/Home.jsx`** — يوضح التركيب: Slider + Categories + Products.
7. **Cart من هنا:** `pages/Cart/Cart.jsx` (زرار) → `pages/Cart/CartPage.jsx` (الصفحة) → `Navbar.jsx` (العدّاد). تتبّع `setCart` في الثلاثة — هذه هي رحلة الـ count.
8. **Wishlist:** `WishlistHeartButton.jsx` → `Wishlist.jsx` → `WishlistSlide.jsx` — نفس queryKey يربطهم.
9. **Checkout:** `Checkout.jsx` → `PaymentSuccess.jsx`.
10. **Categories:** `Categories.jsx` (Swiper) → `CategoryTree.jsx` (فلترة داخل Products) → `CategoryDetails.jsx` → `SubCategory.jsx`.
11. **Auth flow:** `Login.jsx` → `Register.jsx` → الثلاثية Forgot/Verify/Reset.
12. **أخيرًا** الملفات المؤرشفة/المكررة: Brands, Slider, Footer, AnnouncementBar, NotFound.

**قاعدة أثناء القراءة:** كل `// FIX:` comment في الكود يوثّق مشكلة تاريخية وحلها — اقرأها كدراسات حالة حقيقية (أشهرها: توحيد queryKey السلة، نقل queryClient خارج المكون، تنظيف reducers من side effects).
