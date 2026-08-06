CREATE TABLE idempotency_keys (
                                  id UUID PRIMARY KEY,
                                  key VARCHAR(255) NOT NULL UNIQUE,
                                  response_body TEXT,
                                  status_code INT NOT NULL,
                                  created_at TIMESTAMP NOT NULL DEFAULT now()
);