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

-- Adding a product
INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, color) 
VALUES (96063, 'NZXT H6 Flow', 'NZXT', 101.99, 54, 0, 'black'); 
INSERT INTO ProdCase(model_no, type, psu, side_panel, external_volume, internal_35_bays) 
VALUES (96063, 'ATX Mid Tower', 'ATX', 'Tempered Glass', 49, 1); 
SELECT * FROM Product WHERE model_no = 96063;
SELECT * FROM ProdCase WHERE model_no = 96063;

INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, color)
VALUES ((SELECT MAX(model_no) + 1 FROM Product),'2TB PCIe NVMe', 'Samsung', 269.99, 56, 0, 'black');
INSERT INTO Memory(model_no, type, speed, kit_size, size_per_stick, first_word_latency, cas_latency)
VALUES ((SELECT model_no FROM Product WHERE name = '2TB PCIe NVMe'), 'ddr5', 8000, 2, 16, 14, 36);
SELECT * FROM Product WHERE name = '2TB PCIe NVMe';
SELECT * FROM Memory WHERE model_no = (SELECT model_no FROM Product WHERE name = '2TB PCIe NVMe');

-- Filtering by Product Type
SELECT Product.*, CPU.*
FROM Product
INNER JOIN CPU ON product.model_no = cpu.model_no;

-- Editing the Price of a Product
UPDATE Product SET retail_price = 59.99
WHERE model_No = 10027;
SELECT * FROM Product WHERE model_no = 10027;

UPDATE Product SET retail_price = 69.99
WHERE model_No = 10027;
SELECT * FROM Product WHERE model_no = 10027;

-- Searching by Model Number
SELECT 
	Product.model_no AS Product_ID,
    Product.*,
	ProdCase.*,
	CpuCooler.*,
	CPU.*,
	GPU.*,
	Memory.*,
	Motherboard.*,
	PSU.*,
	Storage.*
FROM 
	Product
LEFT JOIN
	ProdCase ON Product.model_no = ProdCase.model_no
LEFT JOIN
	CPUCooler ON Product.model_no = CPUCooler.model_no
LEFT JOIN
	CPU ON Product.model_no = CPU.model_no
LEFT JOIN
	GPU ON Product.model_no = GPU.model_no
LEFT JOIN
	Memory ON Product.model_no = Memory.model_no
LEFT JOIN
	Motherboard ON Product.model_no = Motherboard.model_no
LEFT JOIN
    PSU ON Product.model_no = PSU.model_no
LEFT JOIN
	Storage ON Product.model_no = Storage.model_no
WHERE
	Product.model_no = 10010;

SELECT 
	Product.model_no AS Product_ID,
    Product.*,
	ProdCase.*,
	CpuCooler.*,
	CPU.*,
	GPU.*,
	Memory.*,
	Motherboard.*,
	PSU.*,
	Storage.*
FROM 
	Product
LEFT JOIN
	ProdCase ON Product.model_no = ProdCase.model_no
LEFT JOIN
	CPUCooler ON Product.model_no = CPUCooler.model_no
LEFT JOIN
	CPU ON Product.model_no = CPU.model_no
LEFT JOIN
	GPU ON Product.model_no = GPU.model_no
LEFT JOIN
	Memory ON Product.model_no = Memory.model_no
LEFT JOIN
	Motherboard ON Product.model_no = Motherboard.model_no
LEFT JOIN
    PSU ON Product.model_no = PSU.model_no
LEFT JOIN
	Storage ON Product.model_no = Storage.model_no
WHERE
	Product.model_no = 10004;