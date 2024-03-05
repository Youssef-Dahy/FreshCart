export interface Orders {
  createdAt: string;
  _id: string;
  id: string;
  isDelivered: boolean;
  isPaid: boolean;
  paymentMethodType: string;
  shippingAddress: string;
  totalOrderPrice: number;
  updatedAt: string;
  user: User;
  imageCover: string;
  price: number;
  details: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}
