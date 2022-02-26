create database if not exists public;
create table if not exists public.instances (
	adminID varchar(8) not null,
    expiration datetime not null,
    preset varchar(255),
    primary key (adminID)
);
create table if not exists public.lists (
	adminID varchar(8) not null,
    listID varchar(6) not null,
    listName varchar(255) not null,
    primary key (listID),
    foreign key (adminID) references instances(adminID) on delete cascade
);
create table if not exists public.listItems (
	listItemID varchar(8) not null,
	listItem varchar(255) not null,
    listID varchar(6) not null,
    primary key (listItemID),
    foreign key (listID) references lists(listID) on delete cascade
);
create table if not exists public.probabilities (
	listItemID1 varchar(8) not null,
    listItemID2 varchar(8) not null,
    probability int not null,
    primary key (listItemID1,listItemID2),
    foreign key (listItemID1) references listItems(listItemID) on delete cascade,
    foreign key (listItemID2) references listItems(listItemID) on delete cascade
);