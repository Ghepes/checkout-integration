"use server"

import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

// Helper function to get base URL
async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  return `${protocol}://${host}`
}

export async function checkoutAction(_prevState: unknown, formData: FormData) {
  try {
    const priceId = formData.get("priceId") as string
    const productId = formData.get("productId") as string
    const productName = formData.get("productName") as string
    const userId = formData.get("userId") as string
    const downloadUrl = formData.get("downloadUrl") as string
    if (!priceId) {
      return { error: "Price ID is required" }
    }

    const baseUrl = await getBaseUrl()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        productDev0: downloadUrl,
        user_id: userId,
        product_id: productId,
        product_name: productName,
      },
    })

    if (session.url) {
      redirect(session.url)
    }

    return { error: "Failed to create checkout session" }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

// Replace the cartCheckoutAction function with this external checkout implementation
export async function cartCheckoutAction(
  items: { price: string; quantity: number; productId: string; productName: string; downloadUrl: string }[],
  userId: string,
) {
  try {
    // Format the items for the external checkout API
    const checkoutItems = items.map((item) => ({
      id: item.productId,
      priceId: item.price,
      quantity: item.quantity,
    }))

    // Make a request to the external checkout server
    const response = await fetch("https://checkout.ui-app.com/api/checkout", {
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
      redirect(data.url)
    } else {
      throw new Error("No checkout URL returned")
    }
  } catch (error) {
    console.error("External checkout error:", error)
    throw new Error(error instanceof Error ? error.message : "Checkout failed")
  }
}

