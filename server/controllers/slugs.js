const prisma = require("../utills/db");

async function getProductBySlug(request, response) {
  const { slug } = request.params;
  const product = await prisma.product.findMany({
    where: {
      slug: slug,
    },
    include: {
      category: true
    },
  });

  const foundProduct = product[0];
  if (!foundProduct) {
    return response.status(404).json({ error: "Product not found" });
  }
  return response.status(200).json(foundProduct);
}

module.exports = { getProductBySlug };
