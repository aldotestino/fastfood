export interface Food {
  name: string
  price: number
  image: string
}

export interface CartItem {
  id: string
  item: Food
  quantity: number
}
