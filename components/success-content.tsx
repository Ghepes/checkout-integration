"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SuccessContentProps {
  sessionId: string | null
}

export function SuccessContent({ sessionId }: SuccessContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // You could fetch order details here if needed
      setOrderDetails({
        id: sessionId.substring(0, 8) + "...",
      })
    }
    setIsLoading(false)
  }, [sessionId])

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="flex flex-col items-center gap-2">
        <CheckCircle className="text-green-500 size-12" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading order details...</p>
        ) : sessionId ? (
          <p className="text-muted-foreground max-w-[500px]">
            Thank you for your purchase. Your order ID is: <strong>{orderDetails?.id || sessionId}</strong>
          </p>
        ) : (
          <p className="text-muted-foreground max-w-[500px]">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  )
}

