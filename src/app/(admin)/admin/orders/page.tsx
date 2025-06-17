"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface OrderProduct {
  productId: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  products: OrderProduct[];
  total: number;
  shippingCost: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all",
  );
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (dateRange.start) count++;
    if (dateRange.end) count++;
    return count;
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
  };

  const filterOrders = useCallback(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= startDate,
      );
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) <= endDate,
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, dateRange, filterOrders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-muted text-foreground",
      processing: "bg-primary/20 text-primary",
      shipped: "bg-secondary/20 text-secondary",
      delivered: "bg-accent/20 text-accent",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return colors[status];
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (error)
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold font-heading">Orders</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-full h-5 w-5 flex items-center justify-center p-0"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium font-heading">Filters</h4>
                {getActiveFiltersCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-1" htmlFor="status-filter">
                    Status
                  </Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: Order["status"] | "all") =>
                      setStatusFilter(value)
                    }
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1" htmlFor="start-date">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="mb-1" htmlFor="end-date">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-subcard">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="space-y-1">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.email}
                      </div>
                      {order.userId && (
                        <div className="text-xs text-muted-foreground">
                          ID: {order.userId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value: Order["status"]) =>
                        handleStatusChange(order._id, value)
                      }
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No orders found</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    {selectedOrder.userId && (
                      <p>
                        <span className="font-medium">User ID:</span>{" "}
                        {selectedOrder.userId}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.email}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedOrder.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {selectedOrder.city}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span>{" "}
                      {selectedOrder.country}
                    </p>
                    <p>
                      <span className="font-medium">Postal Code:</span>{" "}
                      {selectedOrder.postalCode}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {format(new Date(selectedOrder.createdAt), "PPpp")}
                    </p>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={`ml-2 ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                    <p>
                      <span className="font-medium">Shipping Cost:</span> $
                      {selectedOrder.shippingCost.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> $
                      {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-subcard">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">
                            {product.productId.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            ${(product.quantity * product.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
