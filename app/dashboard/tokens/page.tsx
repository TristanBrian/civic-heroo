"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Coins, Gift, History, Smartphone, Zap, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { TokenTransaction, PartnerOffer } from "@/types"

// Mock data
const mockTransactions: TokenTransaction[] = [
  {
    id: "1",
    user_id: "123",
    amount: 100,
    type: "earned",
    description: "Completed lesson: Understanding County Government",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user_id: "123",
    amount: 50,
    type: "earned",
    description: "Completed task: Road Documentation",
    created_at: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    user_id: "123",
    amount: -200,
    type: "spent",
    description: "Redeemed: Mobile Data Bundle 1GB",
    created_at: "2024-01-14T16:45:00Z",
  },
]

const mockOffers: PartnerOffer[] = [
  {
    id: 1,
    name: "Mobile Data Bundle 1GB",
    token_value: 200,
    stock_count: 100,
    redemption_code: "DATA1GB001",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Airtime Credit KES 100",
    token_value: 150,
    stock_count: 200,
    redemption_code: "AIRTIME100",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Electricity Tokens KES 500",
    token_value: 400,
    stock_count: 50,
    redemption_code: "POWER500",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Banking Workshop Voucher",
    token_value: 100,
    stock_count: 30,
    redemption_code: "FINLIT001",
    image_url: "/placeholder.svg?height=100&width=100",
  },
]

export default function TokensPage() {
  const [userTokens, setUserTokens] = useState(1250)
  const [transactions, setTransactions] = useState<TokenTransaction[]>(mockTransactions)
  const [offers, setOffers] = useState<PartnerOffer[]>(mockOffers)
  const [selectedOffer, setSelectedOffer] = useState<PartnerOffer | null>(null)
  const [redeemAmount, setRedeemAmount] = useState("")

  const handleRedeem = (offer: PartnerOffer) => {
    if (userTokens >= offer.token_value) {
      // Simulate MTN Kenya airtime redemption
      if (offer.name.includes("Airtime")) {
        // Show MTN Kenya simulation
        alert(`🎉 Success! KES 100 airtime has been sent to your number. 
        
MTN Kenya Confirmation:
Transaction ID: MTN${Date.now()}
Amount: KES 100
Balance: KES 100.00
Thank you for using CivicHero!`)
      } else {
        alert(`Successfully redeemed ${offer.name}!`)
      }

      setUserTokens((prev) => prev - offer.token_value)
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? { ...o, stock_count: o.stock_count - 1 } : o)))

      // Add transaction
      const newTransaction: TokenTransaction = {
        id: Date.now().toString(),
        user_id: "123",
        amount: -offer.token_value,
        type: "spent",
        description: `Redeemed: ${offer.name}`,
        created_at: new Date().toISOString(),
      }
      setTransactions((prev) => [newTransaction, ...prev])
    }
  }

  const getOfferIcon = (name: string) => {
    if (name.includes("Data") || name.includes("Airtime")) return Smartphone
    if (name.includes("Electricity")) return Zap
    if (name.includes("Workshop")) return Gift
    return ShoppingCart
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Token Bank</h1>
          <p className="text-muted-foreground">Manage your tokens and redeem rewards</p>
        </div>
      </div>

      {/* Token Balance */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Token Balance</p>
              <p className="text-4xl font-bold">{userTokens.toLocaleString()}</p>
              <p className="text-sm opacity-90">≈ KES {(userTokens * 0.5).toFixed(2)}</p>
            </div>
            <Coins className="h-16 w-16 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Token Conversion Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-muted-foreground">Token</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground">=</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">KES 0.50</p>
              <p className="text-sm text-muted-foreground">Kenyan Shilling</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter tokens to convert"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
            />
            <Button variant="outline">
              = KES {redeemAmount ? (Number.parseFloat(redeemAmount) * 0.5).toFixed(2) : "0.00"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">Reward Catalog</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="earn">Earn More</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const OfferIcon = getOfferIcon(offer.name)
              const canAfford = userTokens >= offer.token_value

              return (
                <Card key={offer.id} className={`hover:shadow-lg transition-shadow ${!canAfford ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <OfferIcon className="h-8 w-8 text-blue-600" />
                      <Badge variant={offer.stock_count > 0 ? "default" : "secondary"}>
                        {offer.stock_count > 0 ? `${offer.stock_count} left` : "Out of stock"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{offer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{offer.token_value} tokens</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ≈ KES {(offer.token_value * 0.5).toFixed(2)}
                      </span>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={!canAfford || offer.stock_count === 0}
                          onClick={() => setSelectedOffer(offer)}
                        >
                          {!canAfford ? "Insufficient Tokens" : offer.stock_count === 0 ? "Out of Stock" : "Redeem Now"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Redemption</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center">
                            <OfferIcon className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                            <h3 className="text-xl font-bold">{offer.name}</h3>
                          </div>

                          <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span>Cost:</span>
                              <span className="font-bold">{offer.token_value} tokens</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your Balance:</span>
                              <span>{userTokens} tokens</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span>After Redemption:</span>
                              <span className="font-bold">{userTokens - offer.token_value} tokens</span>
                            </div>
                          </div>

                          {offer.name.includes("Airtime") && (
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <h4 className="font-medium text-orange-800 mb-2">MTN Kenya Airtime</h4>
                              <p className="text-sm text-orange-700">
                                KES 100 airtime will be sent directly to your registered phone number. You'll receive an
                                SMS confirmation from MTN Kenya.
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 bg-transparent">
                              Cancel
                            </Button>
                            <Button className="flex-1" onClick={() => handleRedeem(offer)}>
                              Confirm Redemption
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "earned" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {transaction.type === "earned" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "earned" ? "+" : ""}
                        {transaction.amount} tokens
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === "earned" ? "+" : ""}KES {(transaction.amount * 0.5).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earn" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Earn 50-200 tokens per lesson by learning about civic education topics.
                </p>
                <Button className="w-full">Browse Lessons</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Finish Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete community tasks and earn 50-300 tokens while helping your community.
                </p>
                <Button className="w-full">View Tasks</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get 10 tokens every day just for opening the app and staying engaged.
                </p>
                <Button className="w-full">Check In Today</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refer Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Invite friends to join CivicHero and earn 100 tokens for each successful referral.
                </p>
                <Button className="w-full">Share Invite Link</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
