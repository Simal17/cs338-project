-- R6. Login - Finding Employee Credentials in the Database !-
SELECT pwd
FROM Users
WHERE user_id = '170530';

SELECT pwd
FROM Users
WHERE user_id = '170531';

SELECT pwd
FROM Users
WHERE user_id = '177010';

-- R7. Products Having Limited Stock !-
SELECT Product.model_no, Product.name, Product.manufacture, Product.stock_qtty
FROM Product
WHERE Product.stock_qtty < 5
LIMIT 10;

-- R8. Filtering by Product Type, only displaying first 10 to avoid lengthiness!-
SELECT *
FROM Product
WHERE ptype = 'cpu'
LIMIT 10;

-- R9. List of suppliers offering the most products !-
SELECT 
Product.manufacture,
COUNT(*) AS count
FROM Product
GROUP BY Product.manufacture
ORDER BY count DESC
LIMIT 10;

-- R10. Displaying Order Details (LIMIT 5 for testing purposes) !-
SELECT * FROM Orders o
INNER JOIN Product p on p.model_no = o.items
LIMIT 5;

-- R11. Filter Products By Price Range !-
SELECT *
FROM Product
WHERE retail_price 
BETWEEN 50 AND 51
LIMIT 10;