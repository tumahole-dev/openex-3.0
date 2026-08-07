CREATE TABLE trades (
                        id UUID PRIMARY KEY,
                        symbol VARCHAR(20) NOT NULL,
                        buy_order_id UUID NOT NULL REFERENCES orders(id),
                        sell_order_id UUID NOT NULL REFERENCES orders(id),
                        price NUMERIC(18, 8) NOT NULL,
                        quantity NUMERIC(18, 8) NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT now()
);