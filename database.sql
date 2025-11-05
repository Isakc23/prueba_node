CREATE DATABASE prueba_node;

use prueba_node;

create table usuarios (
    id integer not null,
    username varchar(30) not null,
    primary key (id),
    unique key (username)
);

insert into usuarios (id, username) values
(1, 'Erik'),
(2, 'Frida'),
(3, 'David');


-- hacer insersiones a la base de datos
-- mysql -u root -p -e "CREATE DATABASE prueba_node"

-- mysql -u root -p prueba_node < database.sql