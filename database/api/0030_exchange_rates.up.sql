BEGIN;
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate REAL NULL DEFAULT 1.0::REAL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP::TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP::TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  CONSTRAINT exchange_rates_pkey PRIMARY KEY (id),
  CONSTRAINT exchange_rates_from_currency_fkey FOREIGN KEY (from_currency) REFERENCES public.currencies(code) ON DELETE CASCADE,
  CONSTRAINT exchange_rates_to_currency_fkey FOREIGN KEY (to_currency) REFERENCES public.currencies(code) ON DELETE CASCADE
);
COMMIT;

BEGIN;
insert into public.exchange_rates (from_currency, to_currency, rate)
values ('USD', 'EUR', 0.85),
       ('EUR', 'USD', 1.18),
       ('USD', 'GBP', 0.75),
       ('GBP', 'USD', 1.33),
       ('EUR', 'GBP', 0.88),
       ('GBP', 'EUR', 1.14);
COMMIT;
