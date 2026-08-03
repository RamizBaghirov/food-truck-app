export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}