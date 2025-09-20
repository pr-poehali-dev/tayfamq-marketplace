import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

const categories = [
  { id: 'all', name: 'Все товары', icon: 'Grid3X3' },
  { id: 'electronics', name: 'Электроника', icon: 'Smartphone' },
  { id: 'home', name: 'Дом и быт', icon: 'Home' },
  { id: 'beauty', name: 'Красота', icon: 'Sparkles' },
  { id: 'clothes', name: 'Одежда', icon: 'Shirt' },
  { id: 'sport', name: 'Спорт', icon: 'Dumbbell' },
  { id: 'food', name: 'Продукты', icon: 'Apple' }
]

const products: Product[] = []

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TAYFAMQ</h1>
              <Badge variant="secondary" className="bg-brand-orange text-white">
                Семейный маркетплейс
              </Badge>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <Icon name="ShoppingCart" size={20} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-orange text-white min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Button variant="outline">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar with categories */}
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Категории</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-brand-orange text-white hover:bg-brand-orange/90'
                          : 'text-gray-700'
                      }`}
                    >
                      <Icon name={category.icon as any} size={20} />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Cart Sidebar */}
            {showCart && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Корзина
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCart(false)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Корзина пуста</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 pb-3 border-b">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={12} />
                              </Button>
                              <span className="text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={12} />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {(item.price * item.quantity).toLocaleString()} ₽
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="font-bold text-lg">
                            {getTotalPrice().toLocaleString()} ₽
                          </span>
                        </div>
                        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                          Оформить заказ
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-brand-orange to-brand-purple rounded-lg p-8 mb-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Добро пожаловать в TAYFAMQ! 🇹🇭
              </h2>
              <p className="text-lg opacity-90 mb-6">
                Лучшие товары с Озона для всей семьи. Быстрая доставка, проверенное качество.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-brand-orange hover:bg-gray-100"
              >
                Смотреть новинки
              </Button>
            </div>

            {/* Products grid */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedCategory === 'all' ? 'Все товары' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProducts.length} товаров)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-brand-red text-white">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="secondary">Нет в наличии</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {product.price.toLocaleString()} ₽
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {product.originalPrice.toLocaleString()} ₽
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50"
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Товары не найдены
                </h3>
                <p className="text-gray-600">
                  Попробуйте изменить поисковый запрос или выбрать другую категорию
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Index