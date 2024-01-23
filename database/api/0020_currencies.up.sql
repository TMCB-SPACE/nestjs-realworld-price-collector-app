BEGIN;
CREATE TABLE public.currencies (
  code VARCHAR(3) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP::TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP::TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  CONSTRAINT currencies_pkey PRIMARY KEY (code)
);
COMMIT;

BEGIN;
insert into public.currencies (code, name)
values ('USD', 'United States Dollar'),
       ('EUR', 'Euro'),
       ('GBP', 'British Pound');
COMMIT;
