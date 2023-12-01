CREATE TABLE public.beers (
    batch BIGSERIAL,
    name VARCHAR(1024),
    style VARCHAR(1024),
    abv numeric,
    ibu integer,
    on_tap boolean DEFAULT false,
    tap integer,
    tap_date timestamp without time zone DEFAULT NOW(),
    colour VARCHAR(24),
    description varchar(2048),
);
