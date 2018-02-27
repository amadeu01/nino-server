
<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/amadeu01/nino-server/master/assets/nino-logo.png">
</p>

# PostGres Usage
---------------

## For mac users

1. Make sure you has PostGres installed.

```{r, engine='bash', count_lines}
$ brew install postgres
```

2. Make sure you have the file and is authorized to modified it.

```zsh
sudo mkdir /usr/local/var/postgres
sudo chmod 775 /usr/local/var/postgres
sudo chown YOURNAMEOFUSER /usr/local/var/postgres
```

3. Init the database and run.

```bash
$ pg_ctl init -D /usr/local/var/postgres/
$ pg_ctl -D /usr/local/var/postgres -l ONDEVCARMAZENALOG start
```

4. Create Database.

```bash
$ createdb
```

5. Create user !

```bash
$ createuser -P nino
```
**Here:** you put the password `nino`

1. Run postgres and access it.

```bash
$ psql
```

2. Create the database table

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
a. You can do this to generate Documentations.

```bash
$ grunt doc
```

b. Or, this.

```bash
$ grunt
```

---


# [License](./LICENSE)
---

MIT License

Copyright (c) 2018 Amadeu Cavalcante

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
