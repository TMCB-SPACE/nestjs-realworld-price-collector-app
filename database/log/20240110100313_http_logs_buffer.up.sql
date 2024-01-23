CREATE TABLE logging.http_logs_buffer AS http_logs ENGINE = Buffer(logging, http_logs, 1, 10, 100, 10000, 1000000, 10000000, 100000000);
