// HEAVYBITES HAVELIAN — all menu data transcribed from the shop's own menu cards & deal posters.
// Edit prices here and the whole site updates.

window.HB = {
  name: "Heavybites Havelian",
  tagline: "Big Bites, Bold Flavors!",
  motto: "Good Food • Good Mood",
  sub: "Pizza • Fast Food • Ice Cream",
  phoneDisplay: "0333 1244488",
  phoneTel: "+923331244488",
  whatsapp: "923331244488",
  address: "Ameer Mahwiya Chowk, Railway Road, Main Bazar, Havelian 22500",
  hours: "Open daily, 10 AM – 12 AM",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=34.0518124,73.1575456",
  facebook: "https://www.facebook.com/people/Heavy-Bites-Havelian/61590453789216/",
  tiktok: "https://www.tiktok.com/@heavy.bites",

  // ---------- DEALS ----------
  dealGroups: [
    {
      id: "d999", title: "Deals 999", price: 999, badge: "Starter Deals",
      deals: [
        { name: "Yari Deal", items: "2 Zinger Burger + Half Liter Cold Drink", price: 999 },
        { name: "Small Pizza + Zinger", items: "1 Small Pizza + 1 Zinger Burger", price: 999 },
        { name: "Behari Roll Deal", items: "Behari Roll + Shawarma + Paratha Roll + Cold Drink", price: 999 },
        { name: "Shawarma Deal", items: "6 Chicken Shawarma", price: 999 },
        { name: "Arabic Shawarma Deal", items: "5 Arabic Shawarma", price: 999 }
      ]
    },
    {
      id: "d1250", title: "Food Cafe Deals 1250", price: 1250, badge: "Food Cafe",
      deals: [
        { name: "Deal 1", items: "1 Large Loaded Fries + 1 Paratha Roll + 1 Shawarma", price: 1250 },
        { name: "Deal 2", items: "1 Medium Loaded Fries + 1 Medium Pasta + 1 Paratha Roll", price: 1250 },
        { name: "Deal 3", items: "1 Zinger Burger + 1 Loaded Fries (Medium) + 1 Paratha Roll + 1 × 350ml Cold Drink", price: 1250 },
        { name: "Deal 4", items: "1 Small Pizza + 1 Pasta + 1 Paratha Roll", price: 1250 },
        { name: "Deal 5", items: "1 Behari Roll + 1 Patty Burger + 1 Shawarma + 1 Paratha Roll + 1 × 350ml Cold Drink", price: 1250 },
        { name: "Deal 6", items: "1 Medium Pizza + 1 × 1 Liter Cold Drink", price: 1250 }
      ]
    },
    {
      id: "d1499", title: "Special Feast Deals 1499", price: 1499, badge: "More Food • More Happiness",
      deals: [
        { name: "Feast 1", items: "Large Pizza", price: 1499 },
        { name: "Feast 2", items: "Medium Pizza + Small Pizza", price: 1499 },
        { name: "Feast 3", items: "3 Small Pizza", price: 1499 },
        { name: "Feast 4", items: "Medium Pizza + 3 Shawarma", price: 1499 },
        { name: "Feast 5", items: "Medium Pizza + Zinger Burger", price: 1499 },
        { name: "Feast 6", items: "Medium Pasta + Medium Loaded Fries + Small Pizza", price: 1499 }
      ]
    },
    {
      id: "d1500", title: "Special Deals 1500", price: 1500, badge: "Har Deal Sirf Rs. 1500",
      deals: [
        { name: "Deal 1", items: "3 Small Pizzas", price: 1500 },
        { name: "Deal 2", items: "1 Medium Pizza + 1 Small Pizza", price: 1500 },
        { name: "Deal 3", items: "1 Medium Pizza + 3 Shawarma", price: 1500 },
        { name: "Deal 4", items: "2 Zinger Burger + 2 Behari Roll", price: 1500 },
        { name: "Deal 5", items: "3 Zinger Burger + 1 Cold Drink", price: 1500 }
      ]
    },
    {
      id: "dhb", title: "HB Special Deals", price: null, badge: "Family & Group Deals",
      deals: [
        { name: "Dosti Yari Deal", items: "4 Zinger + 1.5 Liter Cold Drink", price: 1800 },
        { name: "3 Zinger Deal", items: "3 Zinger + 1 Liter Cold Drink", price: 1500 },
        { name: "Behari Combo", items: "2 Behari Roll + Shawarma + Small Pizza + 1 Liter Cold Drink", price: 1500 },
        { name: "Zinger + Pizza Deal", items: "1 Zinger + 1 Small Pizza + Behari Roll + 1.5 Liter Cold Drink", price: 1550 },
        { name: "Combo Deal", items: "Small Pizza + Zinger Burger + Shawarma + 1 Liter Cold Drink", price: 1250 },
        { name: "Happy Family Deal", items: "1 Large Pizza + 4 Zinger + Plain Fries + 1.5 Liter Cold Drink", price: 3700 },
        { name: "Jigers Deal", items: "3 Chicken Shawarma + Loaded Fries + 1 Liter Cold Drink", price: 1500 },
        { name: "Bomb Deal", items: "HeavyBites Special XL Pizza + Crunchy Pasta + 2 Loaded Fries (M) + 4 Zinger Burger + 2 Shawarma + Behari Roll + 2 Liter Cold Drink", price: 6500 }
      ]
    }
  ],

  // ---------- MENU ----------
  menu: [
    {
      id: "signature", title: "Signature Pizzas", icon: "pizza",
      note: "Sizes: S = Small · M = Medium · L = Large · XL = Extra Large",
      type: "sizes", sizes: ["S", "M", "L", "XL"],
      items: [
        { name: "HB Special", prices: [700, 1399, 1899, 2299] },
        { name: "Stuffed Crust Pizza", prices: [null, 1399, 1899, 2299] },
        { name: "Behari Kabab Pizza", prices: [null, 1499, 2000, 2500] }
      ]
    },
    {
      id: "classic", title: "Classic Pizzas", icon: "pizza",
      type: "sizes", sizes: ["S", "M", "L", "XL"],
      items: [
        { name: "Chicken Tikka", prices: [550, 1100, 1599, 1899] },
        { name: "Chicken Fajita", prices: [550, 1100, 1599, 1899] }
      ],
      extra: { title: "Extra Topping Charges", prices: [100, 150, 200, 250], sizes: ["S", "M", "L", "XL"] }
    },
    {
      id: "burgers", title: "Burgers", icon: "burger",
      type: "single",
      items: [
        { name: "HB Special Zinger Burger", price: 550 },
        { name: "Zinger Burger", price: 450 },
        { name: "Tower Burger", price: 700 },
        { name: "Tower Patty + Zinger", price: 600 },
        { name: "Patty Burger", price: 350 }
      ]
    },
    {
      id: "fries", title: "Fries", icon: "fries",
      type: "sizes", sizes: ["M", "L"],
      items: [
        { name: "Plain Fries", prices: [300, 450] },
        { name: "Loaded Fries", prices: [500, 850] }
      ]
    },
    {
      id: "wings", title: "Wings", icon: "wings",
      type: "sizes", sizes: ["12 pcs", "6 pcs"],
      items: [
        { name: "Crispy Wings", prices: [800, 500] },
        { name: "Oven Bake Wings", prices: [750, 450] },
        { name: "Hot & Spicy Wings", prices: [800, 500] }
      ]
    },
    {
      id: "pasta", title: "Pasta", icon: "pasta",
      type: "sizes", sizes: ["L", "M"],
      items: [
        { name: "Crunchy Pasta", prices: [850, 500] },
        { name: "Falime Pasta", prices: [700, 450] }
      ]
    },
    {
      id: "sandwiches", title: "Sandwiches", icon: "sandwich",
      type: "single",
      items: [
        { name: "Calzone Sandwich", price: 1200 },
        { name: "Club Sandwich", price: 799 },
        { name: "Chicken Cheese Stick", price: 600 },
        { name: "Cheese Stick", price: 450 }
      ]
    },
    {
      id: "rolls", title: "Rolls & Shawarma", icon: "roll",
      type: "single",
      items: [
        { name: "Chicken Shawarma", price: 200 },
        { name: "Chicken Arabic Shawarma", price: 250 },
        { name: "Chicken Cheese Shawarma", price: 250 },
        { name: "Arabic Cheese Shawarma", price: 300 },
        { name: "Kababish Shawarma", price: 300 },
        { name: "Zinger Shawarma", price: 350 },
        { name: "Chicken Paratha Roll", price: 300 },
        { name: "Kababish Paratha Roll", price: 350 },
        { name: "Zinger Paratha", price: 450 },
        { name: "Behari Roll", price: 399 },
        { name: "Oven Bake Wrap", price: 699 }
      ]
    },
    {
      id: "desi", title: "Desi Foods", icon: "bowl",
      type: "single",
      items: [
        { name: "Samosa Chaat", price: 250 },
        { name: "Dahi Bhaly", price: 250 },
        { name: "Chana Chaat", price: 250 },
        { name: "Dhaba Khati Chaat", price: 250 },
        { name: "Golgapy (10 pcs)", price: 400 },
        { name: "HB Shami Burger", price: 150 },
        { name: "HB Egg Shami Burger", price: 200 },
        { name: "Chicken Shami Burger", price: 250 },
        { name: "Achari Shami Burger", price: 200 }
      ]
    },
    {
      id: "icecream", title: "Ice Cream & Shakes", icon: "icecream",
      type: "single",
      items: [
        { name: "Ice Cream · Small", price: 150 },
        { name: "Ice Cream · Medium", price: 220 },
        { name: "Ice Cream · Large", price: 300 },
        { name: "Ice Cream · Family Pack", price: 800 },
        { name: "Ice Cream Shake", price: 400 },
        { name: "Milkshake", price: 300 }
      ]
    },
    {
      id: "soups", title: "Soups", icon: "soup",
      type: "single",
      items: [
        { name: "Chicken Corn Soup", price: 250 },
        { name: "Hot & Spicy Soup", price: 250 },
        { name: "Heavybites Special Soup", price: 350 },
        { name: "Family Pack", priceText: "1200 / 1500" }
      ]
    },
    {
      id: "fish", title: "Fish · Grilled & Fried", icon: "fish",
      type: "single",
      items: [
        { name: "Silver", price: 1200 },
        { name: "Raho", price: 1400 },
        { name: "Masheer", price: 1400 },
        { name: "Chira", price: 1600 },
        { name: "Fish Piece", priceText: "500 / 600" }
      ]
    }
  ]
};
