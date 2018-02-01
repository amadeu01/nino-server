
<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/amadeu01/nino-server/master/assets/nino-logo.png">
</p>


# Implementation
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

# PostGres Usage
---------------

## For mac users

1. Make sure you has PostGres installed.
```
brew install postgres
```
1. Make sure you have the file and is authorized to modified it.
```
sudo mkdir /usr/local/var/postgres
sudo chmod 775 /usr/local/var/postgres
sudo chown YOURNAMEOFUSER /usr/local/var/postgres
```
1. Init the database and run.

```bash
pg_ctl init -D /usr/local/var/postgres/
pg_ctl -D /usr/local/var/postgres -l ONDEVCARMAZENALOG start
```
1. Create Database.

```bash
createdb
```

1. Create user !

```bash
createuser -P nino
```
**Here:** you put the password `nino`

1. Run postgres and access it.

```bash
$ psql
```

1. Create the database table

```sql
CREATE DATABASE nino WITH TEMPLATE template0 OWNER nino;
\q
```

### To stop postgres

```bash
$ pg_ctl -D /usr/local/var/postgres stop -s -m fast
```

## Jaguar.js template for JSDoc 3
---
- [Jaguar.js](http://davidshimjs.github.io/jaguarjs)
- [Jaguar.js Documentations](http://davidshimjs.github.io/jaguarjs/doc)
- [JSDoc3](https://github.com/jsdoc3/jsdoc)
- [JSDoc3 API Documentations](http://usejsdoc.org)

## Usage (I might take it off)
---
1. You can do this to generate Documentations.

```bash
$ grunt doc
```

1. Or, this.

```bash
$ grunt
```

---


# License
---
MIT
