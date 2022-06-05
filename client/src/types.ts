export interface Food {
  name: string
  price: number
  image: string
}

export interface CartItem {
  item: Food
  quantity: number
}
