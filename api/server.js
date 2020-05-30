const express = require('express');
const axios = require('axios');
const cors = require('cors');


async function start() {
  const app = express();

  const {data: {results: users}} = await axios('https://randomuser.me/api/?results=1000');

  const router = express.Router();

  router.get('/search', (req, res, next) => {
    const {q} = req.query;
    if (!q) return next(new Error('No query found'));

    let searched = users.filter(u => {
      const name = `${u.name.first} ${u.name.last}`.toLowerCase();
      /**
       * This is what the "includes" function does. (Substring search)
       * ✅ "bob brown" -> "bob b"
       * ✅ "bob brown" -> "BOB"
       * ✅ "bob brown" -> "row"
       * ❌ "bob brown" -> "BO "
       * ❌ "bob brown" -> "bob c"
       */
      return name.includes(q.toLowerCase());
    });
    searched = searched.slice(0, 9);

    res.json(searched);
  });


  app.use(cors());
  app.use(router);


  app.listen(9999);
  console.log('API is listening on http://localhost:8080');
}

start();
