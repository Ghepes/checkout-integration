"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart"
import { SuccessContent } from "@/components/success-content"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()

  useEffect(() => {
    // Check if we have a pending checkout in session storage
    const pendingCheckout = sessionStorage.getItem("pendingCheckout")

    if (pendingCheckout === "true" && sessionId) {
      // Clear the cart and remove the pending checkout flag
      clearCart()
      sessionStorage.removeItem("pendingCheckout")
    }
  }, [sessionId, clearCart])

  return <SuccessContent sessionId={sessionId} />
}

