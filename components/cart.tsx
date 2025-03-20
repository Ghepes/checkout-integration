"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useCart } from "@/lib/cart"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Updated handleCheckout function to use our proxy API
  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsCheckingOut(true)

    try {
      // Format the items for the checkout API
      const checkoutItems = items.map((item) => ({
        id: item.id,
        priceId: item.priceId,
        quantity: item.quantity,
      }))

      // Get the user ID - replace with actual user ID if available
      const userId = "user123"

      // Make a request to our proxy API instead of directly to the checkout server
      const response = await fetch("/api/proxy-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          userId: userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Checkout failed")
      }

      const data = await response.json()

      // Redirect to the checkout URL provided by the external server
      if (data.url) {
        // Store cart items in session storage before redirecting
        // This allows us to clear the cart after successful checkout
        sessionStorage.setItem("pendingCheckout", "true")
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to process checkout",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <TooltipProvider>
      <Sheet>
        <Tooltip>
          <SheetTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="border-border relative size-8 shrink-0 border">
                <CartIcon className="size-4" />
                {items.length > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full text-xs">
                    {items.length}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </TooltipTrigger>
          </SheetTrigger>
          <TooltipContent align="end">Cart</TooltipContent>
          <SheetContent className="flex w-full flex-col md:max-w-[420px]">
            <SheetHeader>
              <SheetTitle>Cart</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm">No items in your cart.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                    {item.image && (
                      <div className="relative size-16 overflow-hidden rounded-lg">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-center text-sm tabular-nums">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => removeItem(item.id)}>
                      <X className="size-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <SheetFooter className="flex-col gap-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Tooltip>
      </Sheet>
    </TooltipProvider>
  )
}

function CartIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1730_25270)">
        <path
          d="M5.33317 14.6668C5.70136 14.6668 5.99984 14.3684 5.99984 14.0002C5.99984 13.632 5.70136 13.3335 5.33317 13.3335C4.96498 13.3335 4.6665 13.632 4.6665 14.0002C4.6665 14.3684 4.96498 14.6668 5.33317 14.6668Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6667 14.6668C13.0349 14.6668 13.3333 14.3684 13.3333 14.0002C13.3333 13.632 13.0349 13.3335 12.6667 13.3335C12.2985 13.3335 12 13.632 12 14.0002C12 14.3684 12.2985 14.6668 12.6667 14.6668Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.3667 1.36719H2.70003L4.47337 9.64719C4.53842 9.95043 4.70715 10.2215 4.95051 10.4138C5.19387 10.606 5.49664 10.7074 5.8067 10.7005H12.3267C12.6301 10.7 12.9244 10.596 13.1607 10.4057C13.3971 10.2154 13.5615 9.95021 13.6267 9.65385L14.7267 4.70052H3.41337"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1730_25270">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
