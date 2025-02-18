<?php declare(strict_types=1);

namespace App;

use Exception;

class ProductSimilarity
{
    protected $products       = [];
    protected $userWeight  = 1;
    protected $priceWeight    = 1;
    protected $categoryWeight = 1;
    protected $priceHighRange = 1000;

    public function __construct(array $products)
    {
        $this->products       = $products;
        $this->priceHighRange = max(array_column($products, 'price'));
    }

    public function setUserWeight(float $weight): void
    {
        $this->userWeight = $weight;
    }

    public function setPriceWeight(float $weight): void
    {
        $this->priceWeight = $weight;
    }

    public function setCategoryWeight(float $weight): void
    {
        $this->categoryWeight = $weight;
    }



    public function calculateSimilarityMatrix(): array
    {
        $matrix = [];

        foreach ($this->products as $product) {
            $similarityScores = [];

            foreach ($this->products as $_product) {
                if ($product['id'] === $_product['id']) {
                    continue;
                }
                $similarityScores['product_id_' . $_product['id']] =
                    $this->calculateSimilarityScore($product, $_product);
            }
            $matrix['product_id_' . $product['id']] = $similarityScores;
        }
        return $matrix;
    }

    public function getProductsSortedBySimularity(int $productId, array $matrix): array
    {
        $similarities = $matrix['product_id_' . $productId] ?? null;
        $sortedProducts = [];

        if (is_null($similarities)) {
            throw new Exception('Can\'t find product with that ID.');
        }

        arsort($similarities);

        foreach ($similarities as $productIdKey => $similarity) {
            $id = intval(str_replace('product_id_', '', $productIdKey));
            $products = array_filter($this->products, function ($product) use ($id) {
                return $product['id'] === $id;
            });
            if (!count($products)) {
                continue;
            }
            $product = $products[array_keys($products)[0]];
            $product['similarity'] = $similarity;
            $sortedProducts[] = $product;
        }
        return $sortedProducts;
    }

    protected function calculateSimilarityScore($productA, $productB)
    {
        // Calculate user similarity (1 if same user, 0 if different)
        $userSimilarity = $productA['user_id'] === $productB['user_id'] ? 1 : 0;
        $userSimilarity *= $this->userWeight;

        // Calculate price similarity using normalized values
        $priceSimilarity = Similarity::euclidean(
                Similarity::minMaxNorm([$productA['price']], 0, $this->priceHighRange),
                Similarity::minMaxNorm([$productB['price']], 0, $this->priceHighRange)
            ) * $this->priceWeight;

        // Calculate category similarity (1 if same category, 0 if different)
        $categorySimilarity = $productA['sub_category_id'] === $productB['sub_category_id'] ? 1 : 0;
        $categorySimilarity *= $this->categoryWeight;

        // Calculate final similarity score
        $totalWeight = $this->userWeight + $this->priceWeight + $this->categoryWeight;
        return ($userSimilarity + $priceSimilarity + $categorySimilarity) / $totalWeight;
    }
}
