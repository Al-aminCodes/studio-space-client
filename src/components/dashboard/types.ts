export type DashboardUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

export type Studio = {
  id: number;
  name: string;
  category: string;
  location: string;
  price: number;
  status: "Active" | "Pending";
  image: string;
  rating: number;
};

export type Booking = {
  id: number;
  studio: string;
  customer: string;
  date: string;
  amount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export type DashboardSection =
  | "Overview"
  | "Add New Studio"
  | "My Studio Listings"
  | "My Bookings"
  | "Profile";
