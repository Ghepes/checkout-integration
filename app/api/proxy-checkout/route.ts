import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Get the cart items from the request
    const requestData = await req.json()

    // Forward the request to the checkout server
    const response = await fetch("https://checkout.ui-app.com/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    // Get the response data
    const data = await response.json()

    // Return the response from the checkout server
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error("Proxy checkout error:", error)
    return NextResponse.json({ error: "Failed to process checkout request" }, { status: 500 })
  }
}
