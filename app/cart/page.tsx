'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const menuItems = [
  { id: 1, name: "Veggie Sub", price: "₹ 259", image: "/placeholder.svg?height=130&width=130", vegetarian: true, bestseller: true },
  { id: 2, name: "Chicken Teriyaki", price: "₹ 309", image: "/placeholder.svg?height=130&width=130", vegetarian: false, bestseller: false },
  { id: 3, name: "Italian B.M.T.", price: "₹ 289", image: "/placeholder.svg?height=130&width=130", vegetarian: false, bestseller: true },
  { id: 4, name: "Tuna Sub", price: "₹ 279", image: "/placeholder.svg?height=130&width=130", vegetarian: false, bestseller: false },
]

export default function Cart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState({})

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  const updateCart = (itemId, quantity) => {
    setCartItems(prev => {
      const newCart = { ...prev, [itemId]: quantity }
      if (quantity === 0) {
        delete newCart[itemId]
      }
      localStorage.setItem('cartItems', JSON.stringify(newCart))
      return newCart
    })
  }

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId))
      return total + (item ? parseFloat(item.price.replace('₹ ', '')) * quantity : 0)
    }, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1e7e34] p-5 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-white text-2xl">
          <i className="fas fa-arrow-left"></i>
          <span className="sr-only">Go back</span>
        </button>
        <h1 className="text-white text-xl font-bold">Your Cart</h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-grow p-5">
        {Object.entries(cartItems).map(([itemId, quantity]) => {
          const item = menuItems.find(item => item.id === parseInt(itemId))
          if (!item || quantity === 0) return null
          return (
            <div key={itemId} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md mr-4" />
                <div>
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.price} x {quantity}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateCart(item.id, quantity - 1)} className="px-2 py-1 bg-[#1e7e34] text-white rounded-l-md">-</button>
                <span className="px-3 py-1 border-t border-b">{quantity}</span>
                <button onClick={() => updateCart(item.id, quantity + 1)} className="px-2 py-1 bg-[#1e7e34] text-white rounded-r-md">+</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white p-5 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Total</h2>
          <p className="text-xl font-bold">₹ {getTotalPrice().toFixed(2)}</p>
        </div>
        <button className="w-full bg-[#1e7e34] text-white py-3 rounded-md font-bold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

