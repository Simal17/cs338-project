-- Login - Finding Employee Credentials in the Database
SELECT pwd
FROM User
WHERE user_id = '170530';

SELECT pwd
FROM User
WHERE user_id = '170531';

SELECT pwd
FROM User
WHERE user_id = '177010';

-- Products Having Limited Stock
SELECT Product.model_no, Product.name, Product.manufacture, Product.stock_qtty
FROM Product
WHERE Product.stock_qtty < 5;

-- Filtering by Product Type
SELECT product.*
FROM Product
WHERE product.model_no BETWEEN 30000 AND 39999;

-- List of suppliers offering the most products
SELECT 
Product.manufacture,
COUNT(Product.*) AS count
FROM Product
GROUP BY Product.manufacture
ORDER BY count DESC
LIMIT 10;

-- Searching by Model Number
SELECT Product.*
FROM Product
WHERE Product.model_no = 10010;

SELECT Product.*
FROM Product
WHERE Product.model_no = 10004;

-- Filter Products By Price Range
SELECT Product.*
FROM Product
WHERE retail_price 
BETWEEN 50 AND 60;