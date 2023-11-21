/**
 * USAGE:
 * psql -f initial-db.sql -U postgres
 */
drop database if exists response;
create database response OWNER=postgres;

\connect response;

drop table if exists conversations;
create table if not exists conversations (
	id serial auto_increment,
    started_at timestamp not null default current_timestamp,
    primary key(id)
);

insert into conversations (id, started_at) values (1, '2019-01-01 00:00:00');

drop table if exists textresponses;
create table if not exists textresponses (
    id serial auto_increment,
    conversation_id integer not null,
    prompot text not null,
    response text,
    created_at timestamp not null default current_timestamp,
    primary key(id),
    foreign key(conversation_id) references conversations(id)
); 

drop table if exists imagereponses;
create table if not exists imagereponses (
    id serial auto_increment,
    conversation_id integer not null,
    prompot text not null,
    imagepath text,
    created_at timestamp not null default current_timestamp,
    primary key(id),
    foreign key(conversation_id) references conversations(id)
)