CREATE TABLE accounts (
                          id UUID PRIMARY KEY,
                          user_id UUID NOT NULL,
                          currency VARCHAR(10) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT now(),
                          UNIQUE(user_id, currency)
);

CREATE TABLE ledger_entries (
                                id UUID PRIMARY KEY,
                                transaction_id UUID NOT NULL,
                                account_id UUID NOT NULL REFERENCES accounts(id),
                                amount NUMERIC(18, 8) NOT NULL,
                                direction VARCHAR(10) NOT NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_ledger_account ON ledger_entries(account_id);
CREATE INDEX idx_ledger_txn ON ledger_entries(transaction_id);