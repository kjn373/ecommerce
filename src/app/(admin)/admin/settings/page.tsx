"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

interface Settings {
  shippingCharge: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    shippingCharge: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/settings");
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/settings", settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 font-heading">Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div>
          <Label htmlFor="shippingCharge">Shipping Charge ($)</Label>
          <Input
            id="shippingCharge"
            type="number"
            min="0"
            step="0.01"
            value={settings.shippingCharge}
            onChange={(e) =>
              setSettings({
                ...settings,
                shippingCharge: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
