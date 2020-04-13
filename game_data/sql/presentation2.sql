/*
Video Game Database
By: Pawel, Jacob, Korakot, Garrett, Cole
*/ 
use game_database;
select count(*) from game;

/*
Selects all games with their developer and publisher
*/
create view TheView as
select game_id, game_name as Game, dev_name as Developer, pub_name as Publisher, q_rating as "Quality Rating", m_rating as Maturity
from game left outer join developer on game.dev_id=developer.dev_id
left outer join publisher on game.pub_id=publisher.pub_id;

select * from TheView;

/*
display the recommended game
*/
Set @recommend = "CLANNAD";
select distinct Game, Developer, Publisher from TheView
left outer join game_genre on TheView.game_id = game_genre.game_id
where genre_id in (select genre.genre_id from game 
left outer join game_genre on game.game_id = game_genre.game_id
left outer join genre on game_genre.genre_id = genre.genre_id
where game_name = @recommend);

/*
Selects platform with number of games
*/
select platform_name as Platform, count(*) as "Num Games"
from platform natural join game_platform
group by platform_name
order by count(*) desc;

/*
delete raid: shadow legends ;( D: D: D: D: xD
*/
delete from game 
where game_name="Raid: Shadow Legends";

select * from TheView;
/*
display mature games
*/
select game_name as "Mature Game"
from game
where m_rating = 'M'
order by game_name;

select * from developer;

update developer
set dev_name = "Nintendo BEST"
where dev_name = "Nintendo EPD";