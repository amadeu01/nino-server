Implementation
---
Feature                   | Route     | Tested  | Business | Tested | Persistence | Tested
------------------------- | :-------: | :-----: | :---: | :---: | :-----: | :-:
Create New                 | ✓         | ✓       | ✓     | ✓     | ✓       | See notes
Update Existing          | ✓         | ✓       | ✓     | ✓     | ✓       |
Associate*                | ✓         | ✓       | ✓     | ✓     | ✓       |
GATT Server Connect       | ✓         | ✓       | ✓     | ✓     |         |
Read Characteristic       | ✓         | ✓       | 53    | ✓ |
Write Characteristic      | ✓         | ✓       | 53    | ✓ |
Characteristic Properties | ✓         | ✓       | 53    | ✓     |         |
GATT Notifications        | ✓         | &nbsp;&nbsp;✓&nbsp;&nbsp;&nbsp;start <br/> :construction_worker: stop|  53 start  | ✓ |
GATT Server Disconnect    | ✓         | ✓       | ✓     | ✓     |         |
Get Characteristics List  | ✓         | ✓       | 53    | ✓     |         |
Device Disconnected Event | 52        | 52      | 52    | 52    |         |
Get Primary Services List | 53        | 53      | 53    | 53    |         |

 Associate = Create relatiomship, like add activity to class.

PostGres Usage
---------------

1. Make sure you has PostGres installed.
```
brew install postgres
```
2. Make sure you have the file and is authorized to modified it.
```
sudo mkdir /usr/local/var/postgres
sudo chmod 775 /usr/local/var/postgres
sudo chown YOURNAMEOFUSER /usr/local/var/postgres
```
3. Init the database.
```
pg_ctl init -D /usr/local/var/postgres/
INICIAR: pg_ctl -D /usr/local/var/postgres -l ONDEVCARMAZENALOG start
```
```
createdb
```
4. Create user !
```
createuser -P nino
——AQUI VOCE DIGITA SENHA E CONFIRMA: a senha é *nino* sem os asteriscos
```

5. Run
```
psql
```
6. Create the database table
```
CREATE DATABASE nino WITH TEMPLATE template0 OWNER nino;
\q
```


PARA PARAR: pg_ctl -D /usr/local/var/postgres stop -s -m fast


Jaguar.js template for JSDoc 3
---
- [Jaguar.js](http://davidshimjs.github.io/jaguarjs)
- [Jaguar.js Documentations](http://davidshimjs.github.io/jaguarjs/doc)
- [JSDoc3](https://github.com/jsdoc3/jsdoc)
- [JSDoc3 API Documentations](http://usejsdoc.org)

Usage
---
1. You can do this to generate Documentations.
```
$ grunt doc
```

2. Or, this.
```
$ grunt
```

---


License
---
Nino ! The only owner !!!
