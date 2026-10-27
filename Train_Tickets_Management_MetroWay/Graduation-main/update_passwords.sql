-- Update existing passwords to hashed versions
-- This script should be run after the hash_password function is created

-- Update hanhkhach passwords
UPDATE `hanhkhach` SET `Password` = SHA2(CONCAT(`Password`, 'salt_key_2024'), 256);

-- Update admin passwords  
UPDATE `admin` SET `Password` = SHA2(CONCAT(`Password`, 'salt_key_2024'), 256);

-- Update nhanvien passwords
UPDATE `nhanvien` SET `password` = SHA2(CONCAT(`password`, 'salt_key_2024'), 256);

-- Verify the updates
SELECT 'hanhkhach' as table_name, COUNT(*) as count FROM hanhkhach WHERE LENGTH(Password) = 64
UNION ALL
SELECT 'admin' as table_name, COUNT(*) as count FROM admin WHERE LENGTH(Password) = 64  
UNION ALL
SELECT 'nhanvien' as table_name, COUNT(*) as count FROM nhanvien WHERE LENGTH(password) = 64;
