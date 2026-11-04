export type DashboardUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  userEmail: string;
  userName: string;
  status: "Active" | "Inactive" | "Pending" | "Rejected";
};

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  bookingDate: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  userEmail: string;
  userName: string;
  userImage: string;
};

export type DashboardSection =
  | "Overview"
  | "Add New Studio"
  | "My Studio Listings"
  | "My Bookings"
  | "Profile";
