"use client";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCoins,
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaHistory,
  FaClipboardList,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Performance = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const studentId = userInfo?.id;

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allHomework, setAllHomework] = useState([]);
  const [submittedList, setSubmittedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("homework");

  console.log(userInfo);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hwRes, subRes, prodRes, orderRes, orderItemsRes] =
          await Promise.all([
            fetch(
              `https://sql-server-nb7m.onrender.com/api/homework/group/${userInfo?.classId}`,
            ),
            fetch(
              `https://sql-server-nb7m.onrender.com/api/homework/submitted/${studentId}`,
            ),
            fetch("https://sql-server-nb7m.onrender.com/api/products"),
            fetch(`https://sql-server-nb7m.onrender.com/api/orders`),
            fetch(
              `https://sql-server-nb7m.onrender.com/api/orders/selected/items`,
            ),
          ]);

        const hwData = await hwRes.json();
        const subData = await subRes.json();
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        const orderItems = await orderItemsRes.json();

        const studentOrders = orderData.filter(
          (item) => item.student_id === studentId,
        );

        setOrders(
          studentOrders.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          ),
        );
        setItems(orderItems);
        setProducts(prodData);
        setAllHomework(Array.isArray(hwData) ? hwData : []);
        setSubmittedList(Array.isArray(subData) ? subData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  const getSubmission = (hwId) =>
    submittedList.find((s) => s.homework_id === hwId);

  return (
    <div className="bg-white h-full flex flex-col min-h-[650px]">
      {/* --- BIGGER TAB NAVIGATION --- */}
      <div className="flex p-2.5 bg-slate-100/80 m-5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab("homework")}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-black transition-all ${
            activeTab === "homework"
              ? "bg-white text-indigo-700 shadow-md border border-slate-200"
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <FaClipboardList size={18} />
          TASKS
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-black transition-all ${
            activeTab === "orders"
              ? "bg-white text-indigo-700 shadow-md border border-slate-200"
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <FaHistory size={18} />
          ORDERS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 custom-scrollbar">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-base font-bold italic animate-pulse">
            Yuklanmoqda...
          </div>
        ) : activeTab === "homework" ? (
          /* --- HOMEWORK LIST --- */
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Natijalar
              </span>
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {submittedList.length} / {allHomework.length}
              </span>
            </div>
            {allHomework.length > 0 ? (
              allHomework.map((hw) => {
                const submission = getSubmission(hw.id);
                const isDone = !!submission;
                return (
                  <div
                    key={hw.id}
                    className={`p-5 rounded-[1.5rem] border-2 transition-all ${isDone ? "bg-slate-50 border-slate-100 opacity-80" : "bg-white border-slate-100 shadow-lg hover:border-indigo-300"}`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3
                        className={`font-black text-sm leading-snug ${isDone ? "text-slate-400 line-through" : "text-slate-900"}`}
                      >
                        {hw.title}
                      </h3>
                      {isDone ? (
                        <FaCheckCircle
                          className="text-emerald-500 shrink-0"
                          size={18}
                        />
                      ) : (
                        <FaHourglassHalf
                          className="text-amber-500 shrink-0"
                          size={16}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FaCalendarAlt size={12} />
                        {isDone
                          ? `Score: ${submission.score}`
                          : new Date(hw.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                        <FaCoins
                          size={12}
                          className={
                            isDone ? "text-emerald-500" : "text-amber-500"
                          }
                        />
                        <span className="text-sm font-black text-indigo-900">
                          {isDone
                            ? `+${submission.coins_earned}`
                            : hw.coins_reward}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState message="Topshiriqlar yo'q" />
            )}
          </div>
        ) : (
          /* --- ORDERS LIST --- */
          <div className="space-y-5">
            {orders.length > 0 ? (
              orders.map((o) => {
                const relatedItems = items.filter((i) => i.order_id === o.id);
                const total = relatedItems.reduce(
                  (total, item) => total + item.price_at_time * item.quantity,
                  0,
                );
                return (
                  <div
                    key={o.id}
                    className="bg-white rounded-[1.5rem] border-2 border-slate-100 p-5 shadow-md relative overflow-hidden group"
                  >
                    <div
                      className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-tight ${o.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {o.status || "Pending"}
                    </div>
                    <p className="text-xs font-black text-slate-400 mb-2">
                      #{o.id}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {relatedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                        >
                          {products.find((p) => p.id === item.product_id)
                            ?.name || "Item"}{" "}
                          <span className="text-indigo-200 ml-1">
                            x{item.quantity || 1}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-lg font-black text-slate-900 flex items-center gap-1">
                        <span className="text-base">Coins</span> {total || 0}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState message="Xaridlar mavjud emas" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <FaBoxOpen className="text-slate-200 text-6xl mb-4" />
    <p className="text-slate-400 text-sm font-black uppercase tracking-wide">
      {message}
    </p>
  </div>
);

export default Performance;
