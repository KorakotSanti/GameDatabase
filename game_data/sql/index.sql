use game_database;

create index game_name
on game(game_name);

create index dev_name
on developer(dev_name);

create index pub_name
on publisher(pub_name);

create index genre_name
on genre(genre_name);

create index platform_name
on platform(platform_name);