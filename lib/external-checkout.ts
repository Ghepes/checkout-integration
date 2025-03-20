interface CartItem {
    id: string
    priceId: string
    quantity: number
  }
  
  interface CheckoutRequest {
    items: CartItem[]
    userId: string
  }
  
  /**
   * Sends a checkout request to the external checkout server
   */
  export async function externalCheckout(items: CartItem[], userId: string) {
    const checkoutRequest: CheckoutRequest = {
      items,
      userId,
    }
  
    try {
      const response = await fetch("https://checkout.ui-app.com/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutRequest),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Checkout failed with status: ${response.status}`)
      }
  
      const data = await response.json()
  
      if (data.url) {
        return data.url
      } else {
        throw new Error("No checkout URL returned from external checkout service")
      }
    } catch (error) {
      console.error("External checkout error:", error)
      throw error
    }
  }
    