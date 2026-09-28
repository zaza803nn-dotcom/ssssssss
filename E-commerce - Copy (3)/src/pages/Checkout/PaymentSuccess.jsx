import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {setCart} from "../../Redux/CartSlice";
export default function PaymentSuccess() {

  const dispatch = useDispatch();


setTimeout(()=>{
dispatch(setCart(0));
},1500)


  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-10">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">

        {/* ==================================
            SUCCESS ICON
        ================================== */}

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">

          <CheckCircle2
            size={58}
            strokeWidth={2}
            className="text-emerald-500"
          />

        </div>

        {/* ==================================
            TITLE
        ================================== */}

        <h1 className="mt-7 text-3xl font-black text-slate-900 sm:text-4xl">
          Order Placed Successfully!
        </h1>

        {/* ==================================
            MESSAGE
        ================================== */}

        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500">
          Thank you for your purchase. Your order has been successfully
          submitted and is now being processed.
        </p>

        {/* ==================================
            ACTIONS
        ================================== */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          {/* CONTINUE SHOPPING */}

          <Link
            to="/Products"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-500
              px-6
              py-3
              font-bold
              text-white
              transition
              hover:bg-emerald-400
            "
          >
            <ShoppingBag size={19} />

            Continue Shopping

            <ArrowRight size={17} />
          </Link>

          {/* HOME */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              px-6
              py-3
              font-bold
              text-slate-700
              transition
              hover:bg-gray-50
            "
          >
            Back Home
          </Link>

        </div>

      </div>

    </div>
  );
}