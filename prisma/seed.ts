import { genSaltSync, hashSync } from "bcrypt";
import { faker } from "@faker-js/faker";
import { generateUniqueRandomId, randomizeLikeProduct, randomizeReviewProduct } from "../src/lib/utils";
import { prisma } from "../src/database/client.js";

const saltRounds = 10;
const salt = genSaltSync(saltRounds);
const password_hash = hashSync("rahasia123", salt);
const createUserCount = 20;

const categories = [
  { id: 1, name: "Food", slug: "food" },
  { id: 2, name: "Drink", slug: "drink" },
];
const tags = [
  { id: 1, name: "Coffee", slug: "coffee" },
  { id: 2, name: "Tea", slug: "tea" },
  { id: 3, name: "Sushi", slug: "sushi" },
  { id: 4, name: "Milk", slug: "milk" },
  { id: 5, name: "Juice", slug: "juice" },
  { id: 6, name: "Cocktail", slug: "cocktail" },
  { id: 7, name: "Egg", slug: "egg" },
  { id: 8, name: "Salad", slug: "salad" },
  { id: 9, name: "Cheese", slug: "cheese" },
  { id: 10, name: "Fish", slug: "fish" },
  { id: 11, name: "Soup", slug: "soup" },
  { id: 12, name: "Vegetable", slug: "vegetable" },
  { id: 13, name: "Cake", slug: "cake" },
  { id: 14, name: "Mushroom", slug: "mushroom" },
  { id: 15, name: "Pizza", slug: "pizza" },
  { id: 16, name: "Bean", slug: "bean" },
  { id: 17, name: "Yam", slug: "yam" },
  { id: 18, name: "Potato", slug: "potato" },
  { id: 19, name: "Bread", slug: "bread" },
  { id: 20, name: "Pie", slug: "pie" },
  { id: 21, name: "Spaghetti", slug: "spaghetti" },
  { id: 22, name: "Eel", slug: "eel" },
  { id: 23, name: "Pudding", slug: "pudding" },
  { id: 24, name: "Burger", slug: "burger" },
  { id: 25, name: "Ginger", slug: "ginger" },
  { id: 26, name: "Wine", slug: "wine" },
];
const users = [
  {
    username: "zylcom.dev",
    phonenumber: "0812-3456-7890",
    password: password_hash,
    profile: {
      create: {
        name: "Zylcom",
        avatar: faker.image.avatar(),
        address: "Indonesia",
      },
    },
    cart: { create: {} },
  },
  {
    username: "sabil.dev",
    phonenumber: "0898-7654-3210",
    password: password_hash,
    profile: {
      create: {
        name: "Sabilillah",
        avatar: faker.image.avatar(),
        address: "Indonesia",
      },
    },
    cart: { create: {} },
  },
  ...Array.from({ length: createUserCount }, (_) => {
    return {
      username: faker.internet.userName(),
      phonenumber: faker.phone.number(),
      password: password_hash,
      profile: {
        create: {
          name: faker.person.fullName(),
          avatar: faker.image.avatar(),
          address: faker.location.country(),
        },
      },
      cart: { create: {} },
    };
  }),
];
async function productsData() {
  return [
    {
      name: "Cappuccino",
      slug: "cappuccino",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505624/cappuccino_wn68yc.jpg",
      ingredients: "Coffee, milk.",
      description: "It's cool and refreshing.",
      category: { connect: { slug: "drink" } },
      tags: {
        connect: [{ id: 1 }, { id: 4 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Egg",
      slug: "fried-egg",
      price: 8500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505599/fried_egg_gu3hzh.jpg",
      ingredients: "Egg.",
      category: { connect: { slug: "food" } },
      description: "Sunny-side up.",
      tags: {
        connect: [{ id: 7 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Omelet",
      slug: "omelet",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505604/omelet_zbnyv5.jpg",
      ingredients: "Egg, milk",
      category: { connect: { slug: "food" } },
      description: "It's super fluffy.",
      tags: {
        connect: [{ id: 7 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Salad",
      slug: "salad",
      price: 9500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505611/salad_usqdtw.jpg",
      ingredients: "Leek, dandelion, vinegar.",
      category: { connect: { slug: "food" } },
      description: "A healthy garden salad.",
      tags: {
        connect: [{ id: 8 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Cheese Cauliflower",
      slug: "cheese-cauliflower",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505626/cheese_cauliflower_gzttl4.jpg",
      ingredients: "Cauliflower, cheese.",
      category: { connect: { slug: "food" } },
      description: "It smells great!",
      tags: {
        connect: [{ id: 9 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Baked Fish",
      slug: "baked-fish",
      price: 8500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505622/baked_fish_ktlbhm.jpg",
      ingredients: "Sunfish, bream fish, wheat flour.",
      category: { connect: { slug: "food" } },
      description: "Baked fish on a bed of herbs.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Parsnip Soup",
      slug: "parsnip-soup",
      price: 7500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505605/parsnip_soup_rtmd90.jpg",
      ingredients: "Parsnip, milk, vinegar.",
      category: { connect: { slug: "food" } },
      description: "It's fresh and hearty.",
      tags: {
        connect: [{ id: 11 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Vegetable Medley",
      slug: "vegetable-medley",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505620/vegetable_medley_zlf1p9.jpg",
      ingredients: "Tomato, beet.",
      category: { connect: { slug: "food" } },
      description: "This is very nutritious.",
      tags: {
        connect: [{ id: 12 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Complete Breakfast",
      slug: "complete-breakfast",
      price: 15000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505597/complete_breakfast_kupi7x.jpg",
      ingredients: "Fried egg, milk, hashbrowns.",
      category: { connect: { slug: "food" } },
      description: "You'll feel ready to take on the world!",
      tags: {
        connect: [{ id: 7 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Calamari",
      slug: "fried-calamari",
      price: 12000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505598/fried_calamari_fwel5y.jpg",
      ingredients: "Squid, wheat flour, oil.",
      category: { connect: { slug: "food" } },
      description: "It's so chewy.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Strange Bun",
      slug: "strange-bun",
      price: 8500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505616/strange_bun_ulodve.jpg",
      ingredients: "Wheat flour, periwinkle, void mayonnaise.",
      category: { connect: { slug: "food" } },
      description: "What's inside?",
      tags: {
        connect: [{ id: 13 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Mushroom",
      slug: "fried-mushroom",
      price: 7500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505602/fried_mushroom_cpf11z.jpg",
      ingredients: "Common mushroom, morel, oil.",
      category: { connect: { slug: "food" } },
      description: "Earthy and aromatic.",
      tags: {
        connect: [{ id: 14 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pizza",
      slug: "pizza",
      price: 9000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505606/pizza_t24lbe.jpg",
      ingredients: "Wheat flour, tomato, cheese.",
      category: { connect: { slug: "food" } },
      description: "It's popular for all the right reasons.",
      tags: {
        connect: [{ id: 15 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Bean Hotpot",
      slug: "bean-hotpot",
      price: 7500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505623/bean_hotpot_tcbeit.jpg",
      ingredients: "Green bean.",
      category: { connect: { slug: "food" } },
      description: "It sure is healthy.",
      tags: {
        connect: [{ id: 16 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Glazed Yams",
      slug: "glazed-yams",
      price: 6000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505603/glazed_yams_de41hp.jpg",
      ingredients: "Yam, sugar.",
      category: { connect: { slug: "food" } },
      description: "Sweet and satisfying... The sugar gives it a hint of caramel.",
      tags: {
        connect: [{ id: 17 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Carp Surprise",
      slug: "carp-surprise",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505627/carp_surprise_qliwun.jpg",
      ingredients: "Carp.",
      category: { connect: { slug: "food" } },
      description: "It's bland and oily.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Hashbrowns",
      slug: "hashbrowns",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505603/hashbrowns_hogvft.jpg",
      ingredients: "Potato, oil.",
      category: { connect: { slug: "food" } },
      description: "Crispy and golden-brown!",
      tags: {
        connect: [{ id: 18 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pancakes",
      slug: "pancakes",
      price: 7000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505605/pancakes_x9sw1u.jpg",
      ingredients: "Wheat flour, egg.",
      category: { connect: { slug: "food" } },
      description: "A double stack of fluffy, soft pancakes.",
      tags: {
        connect: [{ id: 13 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Salmon Dinner",
      slug: "salmon-dinner",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505611/salmon_dinner_zbnk1g.jpg",
      ingredients: "Salmon, amaranth, kale.",
      category: { connect: { slug: "food" } },
      description: "The lemon spritz makes it special.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fish Taco",
      slug: "fish-taco",
      price: 7500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505600/fish_taco_piu8ar.jpg",
      ingredients: "Tuna, tortilla, red cabbage, mayonnaise.",
      category: { connect: { slug: "food" } },
      description: "It smells delicious.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Crispy Bass",
      slug: "crispy-bass",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505599/crispy_bass_bti0t4.jpg",
      ingredients: "Largemouth bass, wheat flour, oil.",
      category: { connect: { slug: "food" } },
      description: "Wow, the breading is perfect.",
      tags: {
        connect: [{ id: 10 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pepper Poppers",
      slug: "pepper-poppers",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505605/pepper_poppers_ylmdgg.jpg",
      ingredients: "Hot pepper, cheese.",
      category: { connect: { slug: "food" } },
      description: "Spicy breaded peppers filled with cheese.",
      tags: {
        connect: [{ id: 9 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Bread",
      slug: "bread",
      price: 5000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505624/bread_cvrwvk.jpg",
      ingredients: "Wheat flour.",
      category: { connect: { slug: "food" } },
      description: "A crusty baguette.",
      tags: {
        connect: [{ id: 19 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Tom Kha Soup",
      slug: "tom-kha-soup",
      price: 12000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505617/tom_kha_soup_m9rlur.jpg",
      ingredients: "Coconut, shrimp, common mushroom.",
      category: { connect: { slug: "food" } },
      description: "These flavors are incredible!",
      tags: {
        connect: [{ id: 11 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Chocolate Cake",
      slug: "chocolate-cake",
      price: 15000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505627/chocolate_cake_grdt0b.jpg",
      ingredients: "Wheat flour, egg, sugar, cocoa powder.",
      category: { connect: { slug: "food" } },
      description: "Rich and moist with a thick fudge icing.",
      tags: {
        connect: [{ id: 13 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pink Cake",
      slug: "pink-cake",
      price: 15000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505606/pink_cake_rgoe4t.jpg",
      ingredients: "Melon, wheat flour, sugar, egg.",
      category: { connect: { slug: "food" } },
      description: "There's little heart candies on top.",
      tags: {
        connect: [{ id: 13 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Rhubarb Pie",
      slug: "rhubarb-pie",
      price: 12000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505609/rhubarb_pie_yrag2v.jpg",
      ingredients: "Rhubarb, wheat flour, sugar.",
      category: { connect: { slug: "food" } },
      description: "Mmm, tangy and sweet!",
      tags: {
        connect: [{ id: 20 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Cookie",
      slug: "cookie",
      price: 6000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505598/cookie_x1gm66.jpg",
      ingredients: "Wheat flour, sugar, egg.",
      category: { connect: { slug: "food" } },
      description: "Very chewy.",
      tags: {
        connect: [{ id: 13 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Spaghetti",
      slug: "spaghetti",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505614/spaghetti_jd7nx0.jpg",
      ingredients: "Wheat flour, tomato.",
      category: { connect: { slug: "food" } },
      description: "An old favorite.",
      tags: {
        connect: [{ id: 21 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fried Eel",
      slug: "fried-eel",
      price: 11000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505598/fried_eel_sg2k6c.jpg",
      ingredients: "Ell, oil.",
      category: { connect: { slug: "food" } },
      description: "Greasy but flavorful.",
      tags: {
        connect: [{ id: 22 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Spicy Eel",
      slug: "spicy-eel",
      price: 11000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505615/spicy_eel_g7edy4.jpg",
      ingredients: "Eel, hot pepper, oil.",
      category: { connect: { slug: "food" } },
      description: "It's really spicy! Be careful.",
      tags: {
        connect: [{ id: 22 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Red Plate",
      slug: "red-plate",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505608/red_plate_teupmz.jpg",
      ingredients: "Red cabbage, radish.",
      category: { connect: { slug: "food" } },
      description: "Full of antioxidants.",
      tags: {
        connect: [{ id: 12 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Eggplant Parmesan",
      slug: "eggplant-parmesan",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505600/eggplant_parmesan_xkjfsm.jpg",
      ingredients: "Eggplant, tomato.",
      category: { connect: { slug: "food" } },
      description: "Tangy, cheesy, and wonderful.",
      tags: {
        connect: [{ id: 12 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Rice Pudding",
      slug: "rice-pudding",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505610/rice_pudding_n9naij.jpg",
      ingredients: "Milk, sugar, rice.",
      category: { connect: { slug: "food" } },
      description: "It's creamy, sweet, and fun to eat.",
      tags: {
        connect: [{ id: 23 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Survival Burger",
      slug: "survival-burger",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505616/survival_burger_hgldda.jpg",
      ingredients: "Bread, cave carrot, eggplant.",
      category: { connect: { slug: "food" } },
      description: "A convenient snack for the explorer.",
      tags: {
        connect: [{ id: 24 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pumpkin Soup",
      slug: "pumpkin-soup",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505608/pumpkin_soup_ymlvew.jpg",
      ingredients: "Pumpkin, milk.",
      category: { connect: { slug: "food" } },
      description: "A seasonal favorite.",
      tags: {
        connect: [{ id: 11 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Trout Soup",
      slug: "trout-soup",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505619/trout_soup_t5axjk.jpg",
      ingredients: "Rainbow trout, green algae.",
      category: { connect: { slug: "food" } },
      description: "Pretty salty.",
      tags: {
        connect: [{ id: 11 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Algae Soup",
      slug: "algae-soup",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505621/algae_soup_flscz7.jpg",
      ingredients: "Green algae.",
      category: { connect: { slug: "food" } },
      description: "It's a little slimy.",
      tags: {
        connect: [{ id: 11 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Plum Pudding",
      slug: "plum-pudding",
      price: 7500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505607/plum_pudding_n6lerz.jpg",
      ingredients: "Wild plum, wheat flour, sugar.",
      category: { connect: { slug: "food" } },
      description: "A traditional holiday treat.",
      tags: {
        connect: [{ id: 23 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Pumpkin Pie",
      slug: "pumpkin-pie",
      price: 7000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505607/pumpkin_pie_qmybsd.jpg",
      ingredients: "",
      category: { connect: { slug: "food" } },
      description: "Silky pumpkin cream in a flakey crust.",
      tags: {
        connect: [{ id: 20 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Radish Salad",
      slug: "radish-salad",
      price: 8500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505608/radish_salad_jpko2c.jpg",
      ingredients: "Oil, vinegar, radish.",
      category: { connect: { slug: "food" } },
      description: "The radishes are so crisp!",
      tags: {
        connect: [{ id: 8 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Seafoam Pudding",
      slug: "seafoam-pudding",
      price: 8000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505612/seafoam_pudding_lfpmaq.jpg",
      ingredients: "Flounder, midnight carp, squid ink.",
      category: { connect: { slug: "food" } },
      description: "This briny pudding will really get you into the maritime mindset!",
      tags: {
        connect: [{ id: 23 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fruit Salad",
      slug: "fruit-salad",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505602/fruit_salad_gsi56s.jpg",
      ingredients: "Blueberry, melon, apricot.",
      category: { connect: { slug: "food" } },
      description: "A delicious combination of summer fruits.",
      tags: {
        connect: [{ id: 8 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Fiddlehead Risotto",
      slug: "fiddlehead-risotto",
      price: 10000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505601/fiddlehead_risotto_eypho4.jpg",
      ingredients: "Oil, fiddlehead fern, garlic.",
      category: { connect: { slug: "food" } },
      description: "A creamy rice dish served with sauteed fern heads. It's a little bland.",
      tags: {
        connect: [{ id: 12 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Triple Shot Espresso",
      slug: "triple-shot-espresso",
      price: 4500,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505618/triple_shot_espresso_q8y4mz.jpg",
      ingredients: "Coffee",
      category: { connect: { slug: "drink" } },
      description: "It's more potent than regular coffee!",
      tags: {
        connect: [{ id: 1 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Shrimp Cocktail",
      slug: "shrimp-cocktail",
      price: 5000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505613/shrimp_cocktail_ujfbq1.jpg",
      ingredients: "Tomato, shrimp, wild horseradish.",
      category: { connect: { slug: "drink" } },
      description: "A sumptuous appetizer made with freshly-caught shrimp.",
      tags: {
        connect: [{ id: 6 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Ginger Ale",
      slug: "ginger-ale",
      price: 5000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505602/ginger_ale_jszdsf.jpg",
      ingredients: "Ginger, sugar.",
      category: { connect: { slug: "drink" } },
      description: "A zesty soda known for its soothing effect on the stomach.",
      tags: {
        connect: [{ id: 25 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
    {
      name: "Wine",
      slug: "wine",
      price: 15000,
      image: "https://res.cloudinary.com/dk9bcf16t/image/upload/v1699505621/wine_rpab6n.jpg",
      ingredients: "Grape.",
      category: { connect: { slug: "drink" } },
      description: "Drink in moderation.",
      tags: {
        connect: [{ id: 26 }],
      },
      likes: {
        create: await randomizeLikeProduct(createUserCount),
      },
      reviews: {
        create: await randomizeReviewProduct(createUserCount),
      },
    },
  ];
}

async function main() {
  const categoryCount = await prisma.category.createMany({
    data: categories,
  });
  const tagCount = await prisma.tag.createMany({ data: tags });

  users.forEach(async (user) => {
    console.log(user);

    const result = await prisma.user.create({
      data: { ...user },
      include: { cart: { include: { cartItems: true } } },
    });

    console.log(result);
  });

  Promise.all([categoryCount, tagCount])
    .then(async (values) => {
      console.log(values);

      const products = await productsData();

      return await Promise.all(
        products.map(async (product) => {
          const sumRating = product.reviews.create.reduce((acc, review) => acc + review.rating, 0);

          return await prisma.product.create({
            data: {
              name: product.name,
              slug: product.slug,
              price: product.price,
              ingredients: product.ingredients,
              description: product.description,
              category: product.category,
              image: product.image,
              tags: product.tags,
              reviews: product.reviews,
              likes: product.likes,
              averageRating: !!sumRating ? sumRating / product.reviews.create.length : null,
            },
          });
        }),
      );
    })
    .then(async (result) => {
      console.log(result);

      let totalPrice = 0;

      for (let index = 0; index < Math.floor(Math.random() * 5 + 1); index++) {
        const products = await productsData();
        const randomUniqueID = generateUniqueRandomId(47);
        const result = await prisma.cartItem.upsert({
          update: {
            cart: { connect: { id: 1 } },
            product: { connect: { slug: products[randomUniqueID].slug } },
            quantity: Math.floor(Math.random() * 100),
          },
          create: {
            cart: { connect: { id: 1 } },
            product: { connect: { slug: products[randomUniqueID].slug } },
            quantity: Math.floor(Math.random() * 100),
          },
          where: {
            item: { productSlug: products[randomUniqueID].slug, cartId: 1 },
          },
          include: { cart: { include: { cartItems: true } }, product: true },
        });

        totalPrice += result.quantity * result.product.price;

        console.log(result);
      }

      await prisma.cart.update({
        where: { username: "zylcom.dev" },
        data: { totalPrice },
      });

      console.log("Successfully seeded database. Closing connection.");
    });
}

main()
  .catch(async (e) => {
    console.error(`There was an error while seeding: ${e}`);

    await prisma.$disconnect();

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
