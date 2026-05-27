const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const products = [
  {
    name: 'Crochet Tulip Bouquet',
    price: 499,
    category: 'Flowers',
    image: '/images/flower.png',
    description: 'A gorgeous handcrafted tulip bouquet made with soft cotton yarn. These everlasting blooms bring colour to any space without wilting. Perfect for gifting or home decor.',
    featured: true,
    stock: 30
  },
  {
    name: 'Pastel Bunny Plushie',
    price: 699,
    category: 'Plushies',
    image: '/images/plushie.png',
    description: 'An adorable soft bunny plushie crocheted with hypoallergenic stuffing. With floppy ears and a cheerful face, this bunny makes the perfect cuddle companion or nursery decoration.',
    featured: true,
    stock: 25
  },
  {
    name: 'Checkered Tote Bag',
    price: 899,
    category: 'Bags',
    image: '/images/bag.png',
    description: 'A stylish handcrafted tote bag in a classic checkered pattern. Sturdy enough for everyday use, this bag holds your essentials in fashionable style. Made with durable cotton-blend yarn.',
    featured: true,
    stock: 20
  },
  {
    name: 'Strawberry Keychain',
    price: 199,
    category: 'Keychains',
    image: '/images/keychain.png',
    description: 'A tiny sweet strawberry keychain that adds a pop of colour to your keys or bag. Crocheted with red and green yarn with intricate seed detailing. The cutest accessory!',
    featured: true,
    stock: 60
  },
  {
    name: 'Bright Crochet Sunflower',
    price: 349,
    category: 'Flowers',
    image: '/images/sunflower.png',
    description: 'A vibrant sunflower crafted with bright yellow petals and a rich brown centre. This cheerful bloom adds instant sunshine to any room. Comes as a single stem or can be bundled.',
    featured: false,
    stock: 35
  },
  {
    name: 'Little Frog Plushie',
    price: 549,
    category: 'Plushies',
    image: '/images/frog.png',
    description: 'A tiny green frog plushie that fits right in the palm of your hand. Crocheted with soft amigurumi yarn and safety eyes, this little guy is undeniably cute. A perfect desk companion.',
    featured: false,
    stock: 28
  },
  {
    name: 'Daisy Shoulder Bag',
    price: 999,
    category: 'Bags',
    image: '/images/daisy_bag.png',
    description: 'A boho daisy shoulder bag perfect for summer outings. Featuring delicate flower embellishments and a comfortable adjustable strap. Roomy enough for your daily essentials.',
    featured: false,
    stock: 15
  },
  {
    name: 'Happy Bee Keychain',
    price: 150,
    category: 'Keychains',
    image: '/images/bee_keychain.png',
    description: 'A tiny buzzing bee keychain stitched in cheerful yellow and black stripes. Complete with little wings and antennae, this bee is ready to bring a smile wherever it goes!',
    featured: false,
    stock: 80
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
