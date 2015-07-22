 create table Project(
  projectId serial primary key,
  projectName varchar(40),
  email varchar (40)
);

create table Song(
  songId serial primary key,
  title text not null,
  project integer not null references Project(projectId),
  duration integer,
  hasProductionStatus char(3) check( hasProductionStatus in ('mas','mix', 'raw')),
  added date not null,
  created date,
  likes integer,
  listens integer,
  notes text,
  serverKey varchar(60) not null
);

create table UserTable(
  userId serial primary key,
  userName varchar(20) UNIQUE,
  firstName varchar(25),
  lastName varchar(50), 
  email varchar(40) unique,
  regDate timestamp,
  pw varchar(20) not null
);

create table SongComment (
  songId integer references Song(songId),
  userId integer references UserTable(userId), 
  commentText text not null, 
  commentDate time not null,
  Primary key(songId, userId, commentDate)
);

create table CommentComment(
  songId integer references Song(songId),
  userId integer references UserTable(userId), 
  commentText text not null, 
  commentDate time not null,
  Primary key(songId, userId, commentDate),
  foreign key (songId, userId, commentDate) references SongComment(songId, userId, commentDate)
);

create table songParticipation (
  songId integer references song(songId),
  userId integer references userTable(userId),
  role varchar,
  primary key(songId, userId, role)
);

create table songInfluence(
  songId integer references song(songId),
  influence text,
  primary key(songId, influence)
);

create table projectParticipation (
  projectId integer references project(projectId),
  userId integer references userTable(userId),
  role varchar,
  primary key(projectId, userId, role)
);

create table projectInfluence(
  projectId integer references project(projectId),
  influence text,
  primary key(projectId, influence)
);

create table SocialPlatformAffiliation(
  userId integer references userTable(userId),
  webAddress text not null,
  socialPlatform varchar(20),
  primary key(userId, socialPlatform)
);

