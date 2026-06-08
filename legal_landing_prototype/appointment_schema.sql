-- Пример структуры для сервиса записи клиентов.
-- Данные можно отдавать на сайт через API: GET /api/appointment-slots и POST /api/appointments

CREATE TABLE legal_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE appointment_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_id INT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (service_id) REFERENCES legal_services(id)
);

CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slot_id INT NOT NULL,
  client_name VARCHAR(160) NOT NULL,
  client_phone VARCHAR(80) NOT NULL,
  comment TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES appointment_slots(id)
);
