CREATE TABLE orders (
                        id UUID PRIMARY KEY,
                        user_id UUID NOT NULL REFERENCES users(id),
                        symbol VARCHAR(20) NOT NULL,
                        side VARCHAR(4) NOT NULL,
                        type VARCHAR(10) NOT NULL,
                        price NUMERIC(18, 8),
                        quantity NUMERIC(18, 8) NOT NULL,
                        filled_quantity NUMERIC(18, 8) NOT NULL DEFAULT 0,
                        status VARCHAR(20) NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_symbol_status ON orders(symbol, status);