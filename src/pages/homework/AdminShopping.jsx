"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../layout";
import {
  MdAddShoppingCart,
  MdOutlineInventory2,
  MdReceiptLong,
  MdCheckCircle,
  MdCancel,
  MdGeneratingTokens,
  MdTrendingUp,
  MdCloudUpload,
  MdClose,
  MdCheck,
  MdEdit,
  MdOutlinePhotoCamera,
  MdDeleteOutline,
} from "react-icons/md";
import { useRef } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false); // New state for button loading
  const [newProduct, setNewProduct] = useState({
    name: "",
    price_coins: "",
    description: "",
    stock: "",
    image: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [orderRes, productRes, orderItemRes] = await Promise.all([
        fetch("https://sql-server-nb7m.onrender.com/api/orders"),
        fetch("https://sql-server-nb7m.onrender.com/api/products"),
        fetch("https://sql-server-nb7m.onrender.com/api/orders/selected/items"),
      ]);

      setOrders(await orderRes.json());
      setProducts(await productRes.json());
      setItems(await orderItemRes.json());
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleStatusUpdate = async (order, status) => {
    if (status === "accepted" && order.total_coins < order.total) {
      alert("⚠️ Insufficient student funds!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `https://sql-server-nb7m.onrender.com/api/orders/${order.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) fetchAll();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };
  const fileInputRef = useRef(null);
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price_coins: product.price_coins,
      stock: product.stock,
      image_url: product.image_url, // keep existing image
    });
  };
  const handleSave = async (id) => {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price_coins", editForm.price_coins);
      formData.append("stock", editForm.stock);

      // only send image if user changed it
      if (editForm.image) {
        formData.append("image_url", editForm.image);
      } else {
        formData.append("image_url", editForm.image_url);
      }

      const res = await fetch(
        `https://sql-server-nb7m.onrender.com/api/products/${id}`,
        {
          method: "PUT",
          body: formData, // ❗ no JSON
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error("Update failed:", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(
          `https://sql-server-nb7m.onrender.com/api/products/${id}`,
          {
            method: "DELETE",
          },
        );
        if (res.ok) {
          // Remove from local state immediately
          setProducts(products.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price_coins", newProduct.price_coins);
    formData.append("description", newProduct.description);
    formData.append("stock", newProduct.stock);
    formData.append("image_url", newProduct.image); // file input

    try {
      const res = await fetch(
        "https://sql-server-nb7m.onrender.com/api/products/create",
        {
          method: "POST",
          body: formData, // ✅ no Content-Type header!
        },
      );

      if (res.ok) {
        setNewProduct({
          name: "",
          price_coins: "",
          description: "",
          stock: "",
          image: null,
        });
        fetchAll();
      } else {
        const errMsg = await res.text();
        console.error("Failed:", errMsg);
      }
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  // --- Helper: Stats calculation ---
  const stats = [
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: <MdReceiptLong />,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Total Revenue",
      value: `${orders.filter((o) => o.status === "accepted").reduce((acc, curr) => acc + (curr.total || 0), 0)} 🪙`,
      icon: <MdTrendingUp />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Active Products",
      value: products.length,
      icon: <MdOutlineInventory2 />,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:px-5 lg:py-10 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
        {/* MODAL: ADD PRODUCT */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <MdAddShoppingCart className="text-indigo-600" /> New Product
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-all"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                    placeholder="e.g. Designer Notebook"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Price (Coins)
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                      placeholder="50"
                      value={newProduct.price_coins}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price_coins: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Stock
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                      placeholder="100"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-slate-800"
                    placeholder="Details..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Image
                  </label>
                  <div className="relative group">
                    <label className="cursor-pointer">
                      {/* The Input */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const previewUrl = URL.createObjectURL(file);

                          // SYNC BOTH: Update the 'newProduct' state so the UI label changes
                          setNewProduct((prev) => ({
                            ...prev,
                            image: file,
                            preview: previewUrl, // Use a preview key for the UI
                          }));
                        }}
                      />

                      {/* The UI Box */}
                      <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-3 text-slate-400 group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all">
                        {newProduct.preview ? (
                          <img
                            src={newProduct.preview}
                            alt="Preview"
                            className="h-8 w-8 object-cover rounded-lg border border-indigo-200"
                          />
                        ) : (
                          <MdCloudUpload
                            size={20}
                            className="text-indigo-400"
                          />
                        )}

                        <span className="text-xs font-bold truncate max-w-[200px]">
                          {newProduct.image
                            ? newProduct.image.name
                            : "Select photo"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  {submitting ? "Processing..." : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Store Command{" "}
              <span className="text-sm font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                Admin
              </span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">
              Monitor transactions and inventory in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchAll}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Refresh Data
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <MdAddShoppingCart size={20} /> Add Product
            </button>
          </div>
        </header>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]"
            >
              <div className={`p-4 rounded-2xl text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: INVENTORY LIST */}
          <div className="lg:col-span-4">
            <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <MdOutlineInventory2 className="text-indigo-500" /> Current
                  Stock
                </h2>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">
                  {products.length} Items
                </span>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`group overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                      editingId === p.id
                        ? "bg-indigo-50/50 border-indigo-300 shadow-lg"
                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md"
                    }`}
                  >
                    {/* Top Info Bar */}
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={
                            editingId === p.id && editForm?.preview
                              ? editForm.preview
                              : `https://sql-server-nb7m.onrender.com${p.image_url}`
                          }
                          className="w-full h-full object-cover"
                          alt={p.name}
                        />

                        {/* EDIT OVERLAY */}
                        {editingId === p.id && (
                          <label
                            htmlFor={`file-upload-${p.id}`}
                            className="absolute inset-0 bg-indigo-600/60 cursor-pointer flex items-center justify-center text-white"
                          >
                            <MdOutlinePhotoCamera size={20} />
                            {/* HIDDEN INPUT INSIDE THE LABEL */}
                            <input
                              id={`file-upload-${p.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setEditForm({
                                    ...editForm,
                                    image: file,
                                    preview: url,
                                  });
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        {editingId === p.id ? (
                          <input
                            className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                          />
                        ) : (
                          <>
                            <p className="font-bold text-slate-800 text-sm truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-2">
                              {p.price_coins} Coins •
                              <span
                                className={
                                  p.stock < 5
                                    ? "text-rose-500"
                                    : "text-slate-400"
                                }
                              >
                                Stock: {p.stock}
                              </span>
                            </p>
                          </>
                        )}
                      </div>

                      {/* QUICK ACTIONS */}
                      {!editingId && (
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <MdDeleteOutline size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expanded Edit Section */}
                    {editingId === p.id && (
                      <div className="p-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <textarea
                          className="w-full text-xs bg-white border border-indigo-200 rounded-xl p-2 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                          rows="2"
                          placeholder="Description..."
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                        />

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase ml-1">
                                Price
                              </span>
                              <input
                                type="number"
                                className="w-16 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs font-bold"
                                value={editForm.price_coins}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    price_coins: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase ml-1">
                                Stock
                              </span>
                              <input
                                type="number"
                                className="w-16 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs font-bold"
                                value={editForm.stock}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    stock: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              disabled={submitting}
                              onClick={() => setEditingId(null)}
                              className="p-2 text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                              <MdClose size={20} />
                            </button>
                            <button
                              disabled={submitting}
                              onClick={() => handleSave(p.id)}
                              className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                            >
                              <MdCheck size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
          {/* MAIN: Order Processing */}
          <div className="lg:col-span-8">
            <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[700px] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <MdReceiptLong className="text-indigo-500" size={28} /> Order
                  Requests
                </h2>
                {loading && (
                  <div className="h-6 w-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              <div className="p-5 flex-grow">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <MdReceiptLong size={40} className="opacity-20" />
                    </div>
                    <p className="font-bold text-slate-400">
                      No active requests found
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {orders.map((order) => {
                      const relatedItems = items.filter(
                        (i) => Number(i.order_id) === Number(order.id),
                      );
                      const totalCost = relatedItems.reduce(
                        (sum, item) => sum + Number(item.price_at_time || 0),
                        0,
                      );
                      return (
                        <div
                          key={order.id}
                          className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span
                                className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                                  order.status === "pending"
                                    ? "bg-amber-100 text-amber-600"
                                    : order.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-rose-100 text-rose-600"
                                }`}
                              >
                                {order.status}
                              </span>
                              <h3 className="text-xl font-black text-slate-800 mt-2">
                                {order.firstName} {order.lastName}
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase mt-1">
                                <MdGeneratingTokens className="text-amber-400" />{" "}
                                Wallet: {order.total_coins}
                              </p>
                            </div>
                            <div className="text-right w-20">
                              <p className="text-[10px] font-black text-slate-400 uppercase">
                                Order ID
                              </p>
                              <p className="text-sm font-mono font-bold text-slate-600">
                                #{order.id.toString().padStart(4, "0")}
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 flex-grow">
                            <ul className="space-y-2">
                              {relatedItems.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between text-xs font-bold text-slate-600"
                                >
                                  <span>
                                    {products.find(
                                      (p) =>
                                        Number(p.id) ===
                                        Number(item.product_id),
                                    )?.name || "Item"}
                                  </span>
                                  <span className="text-slate-400">
                                    {item.price_at_time} coins
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="border-t border-slate-200 mt-4 pt-3 flex justify-between items-center">
                              <span className="text-xs font-black text-slate-800 uppercase">
                                Grand Total
                              </span>
                              <span className="text-lg font-black text-indigo-600">
                                {totalCost} coins
                              </span>
                            </div>
                          </div>

                          {order.status === "pending" && (
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                              <button
                                disabled={submitting}
                                onClick={() =>
                                  handleStatusUpdate(order, "accepted")
                                }
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                              >
                                <MdCheckCircle size={18} /> Approve
                              </button>
                              <button
                                disabled={submitting}
                                onClick={() =>
                                  handleStatusUpdate(order, "rejected")
                                }
                                className="bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                              >
                                <MdCancel size={18} /> Decline
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
