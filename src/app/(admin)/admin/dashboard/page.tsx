"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/products"),
          fetch("/api/orders")
        ]);
        if (!usersRes.ok || !productsRes.ok || !ordersRes.ok) throw new Error("Failed to fetch data");
        const users = await usersRes.json();
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        setStats({ 
          users: users.length, 
          products: products.length,
          orders: orders.length
        });
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-background p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground font-heading">Welcome, Admin</h1>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold text-foreground font-heading">{stats.users}</span>
            <span className="text-sm sm:text-base text-muted-foreground mt-2">Total Users</span>
          </div>
          <div className="bg-card rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold text-foreground font-heading">{stats.products}</span>
            <span className="text-sm sm:text-base text-muted-foreground mt-2">Total Products</span>
          </div>
          <div className="bg-card rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold text-foreground font-heading">{stats.orders}</span>
            <span className="text-sm sm:text-base text-muted-foreground mt-2">Total Orders</span>
          </div>
        </div>
      )}
    </div>
  );
}