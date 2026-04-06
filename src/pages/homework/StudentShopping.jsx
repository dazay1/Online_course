import { useEffect, useState } from "react";
import AdminLayout from "../layout";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const StudentShopping = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const studentId = userInfo?.id;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const dataFetch = async () => {
      setLoading(true);
      try {
        const prodRes = await fetch(
          "https://sql-server-nb7m.onrender.com/api/products",
        );
        const prodData = await prodRes.json();
        setProducts(prodData);

        if (studentId) {
          const orderRes = await fetch(
            `https://sql-server-nb7m.onrender.com/api/orders`,
          );
          const orderItemsRes = await fetch(
            `https://sql-server-nb7m.onrender.com/api/orders/selected/items`,
          );

          const orderItems = await orderItemsRes.json();
          const orderData = await orderRes.json();

          const studentOrders = orderData.filter(
            (item) => item.student_id === studentId,
          );

          setOrders(
            studentOrders.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at),
            ),
          );
          setItems(orderItems);
        }
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    dataFetch();
  }, [studentId]);

  const displayedProducts = showAll ? products : products.slice(0, 6);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const submitOrder = async () => {
    try {
      const res = await fetch(
        `https://sql-server-nb7m.onrender.com/api/order/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId, items: cart }),
        },
      );
      const data = await res.json();

      if (data.message === "Insufficient funds") {
        toast.error(data.message);
        return;
      } else {
        toast.success("Order placed successfully");
        setCart([]);
        // Trigger a page refresh or re-fetch to update the order list
        window.location.reload();
      }
    } catch (error) {
      toast.error("Order failed");
    }
  };

  const totalCoins = cart.reduce(
    (sum, item) => sum + item.price_coins * item.quantity,
    0,
  );

  console.log(displayedProducts);
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-900">
        {/* --- STORE HEADER --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-indigo-900">
              Student Store
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Turn your hard work into rewards!
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
            <div className="bg-white px-6 py-3 rounded-[14px] flex items-center gap-4">
              <div className="bg-yellow-100 p-2 rounded-full text-2xl">🪙</div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Total Spend
                </p>
                <p className="text-2xl font-black text-orange-600">
                  {totalCoins}{" "}
                  <span className="text-sm font-medium">Coins</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {/* --- PRODUCT GRID --- */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={`https://sql-server-nb7m.onrender.com${p.image_url}`}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1 text-orange-500 font-black text-lg mb-4">
                          🪙 {p.price_coins}
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAll && products.length > 6 && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() => setShowAll(true)}
                      className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                    >
                      SEE ALL PRODUCTS ({products.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* --- SHOPPING BAG --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl sticky top-8">
              <h2 className="text-2xl font-black text-slate-800 mb-6">
                Your Bag{" "}
                <span className="bg-indigo-100 text-indigo-600 text-sm px-2 py-0.5 rounded-lg ml-2">
                  {cart.length}
                </span>
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-40">
                  <p className="text-4xl mb-2">🛒</p>
                  <p className="font-medium">Empty!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl mb-3 border border-transparent hover:border-indigo-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-sm font-bold text-indigo-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-slate-500 font-medium">
                        Total Cost
                      </span>
                      <span className="text-2xl font-black text-slate-900 underline decoration-yellow-400 decoration-4 underline-offset-4">
                        {totalCoins} Coins
                      </span>
                    </div>
                    <button
                      onClick={() => submitOrder()}
                      className="w-full rounded-2xl bg-indigo-600 p-4 text-white font-black text-lg hover:bg-indigo-700 active:scale-95 shadow-lg"
                    >
                      ORDER NOW
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentShopping;
