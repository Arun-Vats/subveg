'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

const menuItems = [
  { id: 1, name: "Veggie Sub", price: "₹ 259", image: "/sub.jpg", vegetarian: true, bestseller: true },
  { id: 2, name: "Chicken Teriyaki", price: "₹ 309", image: "/sub.jpg", vegetarian: false, bestseller: false },
  { id: 3, name: "Italian B.M.T.", price: "₹ 289", image: "/sub.jpg", vegetarian: false, bestseller: true },
  { id: 4, name: "Tuna Sub", price: "₹ 279", image: "/sub.jpg", vegetarian: false, bestseller: false },
]

const carouselImages = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
]

function CartButton({ itemId, onAddToCart, count }) {
  const handleAdd = () => {
    onAddToCart(itemId, count + 1);
  };

  const handleRemove = () => {
    onAddToCart(itemId, Math.max(0, count - 1));
  };

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex items-center bg-white border border-[#1e7e34] rounded-md overflow-hidden">
      {count > 0 ? (
        <>
          <button onClick={handleRemove} className="px-2 py-1 text-[#1e7e34] font-bold">-</button>
          <span className="px-2 py-1 text-[#1e7e34] font-bold">{count}</span>
          <button onClick={handleAdd} className="px-2 py-1 text-[#1e7e34] font-bold">+</button>
        </>
      ) : (
        <button onClick={handleAdd} className="px-4 py-1 text-[#1e7e34] font-bold">ADD</button>
      )}
    </div>
  );
}

export default function Home() {
  const [cartItems, setCartItems] = useState({});
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const router = useRouter();
  const headerRef = useRef(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowFloatingCart(headerBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = useCallback((itemId, count) => {
    setCartItems(prev => {
      const newCart = { ...prev, [itemId]: count };
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const totalCartItems = Object.values(cartItems).reduce((a, b) => a + b, 0);

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-yellow-400 text-black text-center p-12 text-xl font-bold hidden md:block">
        This is a mobile website. For the best experience, please use a smartphone to view and order from this website.
      </div>

      <header ref={headerRef} className="bg-[#1e7e34] p-5 flex justify-between items-center sticky top-0 z-10">
        <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-10 w-auto" />
        <div className="relative">
          <button onClick={handleCartClick} className="text-white text-2xl">
            <i className="fas fa-shopping-cart"></i>
            <span className="sr-only">View Cart</span>
          </button>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalCartItems}
            </span>
          )}
        </div>
      </header>

      {showFloatingCart && (
        <button
          onClick={handleCartClick}
          className="fixed bottom-4 right-4 bg-[#1e7e34] text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 ease-in-out hover:bg-[#167029] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e7e34]"
        >
          <i className="fas fa-shopping-cart text-2xl"></i>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalCartItems}
            </span>
          )}
        </button>
      )}

      <div className="mx-2.5 my-5 relative">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-48 md:h-64">
                  <Image 
                    src={src}
                    alt={`Promotional Image ${index + 1}`}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="text-center mt-7 mb-5 text-2xl font-bold">
        <hr className="w-1/3 mx-auto border-[#1e7e34] border-opacity-30" />
        <span className="my-5 inline-block">Our Menu</span>
        <hr className="w-1/3 mx-auto border-[#1e7e34] border-opacity-30" />
      </div>

      {menuItems.map((item, index) => (
        <div key={index}>
          <div className="relative flex justify-between items-center mx-2.5 mb-8">
            {item.vegetarian && (
              <Image src="/veg.png" alt="Vegetarian" width={20} height={20} className="absolute top-0.5 left-0.5" />
            )}
            {item.bestseller && (
              <span className="absolute top-[-2px] left-[25px] text-white rounded-full bestseller-animation">
                Bestseller
              </span>
            )}
            <div>
              <span className="font-bold text-lg">{item.name}</span>
              <br />
              <span className="text-black text-opacity-60 text-base">{item.price}</span>
            </div>
            <div className="relative">
              <div className="w-[130px] h-[130px]">
                <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-xl" />
              </div>
              <CartButton 
                itemId={item.id} 
                onAddToCart={handleAddToCart} 
                count={cartItems[item.id] || 0}
              />
            </div>
          </div>
          {index < menuItems.length - 1 && (
            <hr className="w-full border-[#1e7e34] border-opacity-10 my-4" />
          )}
        </div>
      ))}

      <footer className="bg-[#1e7e34] text-white py-8 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">About Us</h3>
            <p className="text-sm">We serve fresh, delicious subs made with quality ingredients. Our goal is to provide a satisfying meal experience for all our customers.</p>
          </div>
          <div className="flex justify-center space-x-8">
            <Link href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-300">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span className="sr-only">Find us on Google Maps</span>
            </Link>
            <Link href="tel:+1234567890" className="text-white text-3xl hover:text-gray-300">
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
              <span className="sr-only">Call us</span>
            </Link>
            <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-300">
              <i className="fab fa-instagram" aria-hidden="true"></i>
              <span className="sr-only">Follow us on Instagram</span>
            </Link>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2023 Sub Delights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

