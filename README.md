# trakt.tv-queued
Experimental plugin that automatically queues any call fired by the main module `trakt.tv`

At the moment it depends on any version of Node.js that supports async/await.

If you pass the option `cached` = `true` then trakt.tv-queued will use trakt.tv-cached to transparently cache any GET request.

## Setup:
```bash
$ git clone https://github.com/MySidesTheyAreGone/trakt.tv-queued.git
$ git clone https://github.com/MySidesTheyAreGone/trakt.tv-cached.git
$ cd trakt.tv-cached
$ npm i
$ cd ../trakt.tv-queued
$ npm i
```

## Try it out

Run this script (use your client id and secret):
```js
let Trakt = require('trakt.tv')
let trakt = new Trakt({
  client_id: 'XXX',
  client_secret: 'YYY',
  plugins: {
    cached: require('../trakt.tv-cached/index.js'),
    queued: require('../trakt.tv-queued/index.js')
  },
  options: {
    'queued': {
      concurrency: 2,
      delay: 1,
      cached: true
    }
  }
})

trakt.cached.debug(true)
trakt.queued.debug(true)
trakt.cached.ttl(20)

async function test () {
  try {
    await Promise.all([
      trakt.queued.seasons.season({id: 'game-of-thrones', season: 4}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched')),
      trakt.queued.seasons.season({id: 'archer', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Archer" episodes fetched')),
      trakt.queued.seasons.season({id: 'humans', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Humans" episodes fetched')),
      trakt.queued.seasons.season({id: 'westworld', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Westworld" episodes fetched')),
      trakt.queued.seasons.season({id: 'the-expanse', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "The Expanse" episodes fetched')),
      trakt.queued.seasons.season({id: 'american-horror-story', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "American Horror Story" episodes fetched')),
      trakt.queued.seasons.season({id: 'penny-dreadful', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Penny Dreadful" episodes fetched'))
    ])
    await Promise.all([
      trakt.queued.seasons.season({id: 'game-of-thrones', season: 4}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched')),
      trakt.queued.seasons.season({id: 'archer', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Archer" episodes fetched')),
      trakt.queued.seasons.season({id: 'humans', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Humans" episodes fetched')),
      trakt.queued.seasons.season({id: 'westworld', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Westworld" episodes fetched')),
      trakt.queued.seasons.season({id: 'the-expanse', season: 1}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "The Expanse" episodes fetched')),
      trakt.queued.seasons.season({id: 'american-horror-story', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "American Horror Story" episodes fetched')),
      trakt.queued.seasons.season({id: 'penny-dreadful', season: 2}).then((data) => console.log('API CALL COMPLETED: ' + data.length + ' "Penny Dreadful" episodes fetched'))
    ])
  }
  catch (e) {
    console.log(e)
  }
}

test()
```

Output when caching is disabled:
```
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 5 calls are still waiting in the queue

API CALL COMPLETED: 13 "Archer" episodes fetched
API CALL COMPLETED: 10 "Game of Thrones" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 3 calls are still waiting in the queue

API CALL COMPLETED: 10 "Westworld" episodes fetched
API CALL COMPLETED: 8 "Humans" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 1 calls are still waiting in the queue

API CALL COMPLETED: 13 "American Horror Story" episodes fetched
API CALL COMPLETED: 10 "The Expanse" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 0 calls are still waiting in the queue

API CALL COMPLETED: 10 "Penny Dreadful" episodes fetched

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-queued | enqueueing an API call...
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | API call in progress...
trakt.tv-queued | 6 calls are still waiting in the queue

API CALL COMPLETED: 10 "Game of Thrones" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 5 calls are still waiting in the queue
trakt.tv-queued | API call in progress...
trakt.tv-queued | 4 calls are still waiting in the queue

API CALL COMPLETED: 13 "Archer" episodes fetched
API CALL COMPLETED: 8 "Humans" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 3 calls are still waiting in the queue

API CALL COMPLETED: 10 "Westworld" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 2 calls are still waiting in the queue

API CALL COMPLETED: 10 "The Expanse" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 1 calls are still waiting in the queue

API CALL COMPLETED: 13 "American Horror Story" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 0 calls are still waiting in the queue

API CALL COMPLETED: 10 "Penny Dreadful" episodes fetched

trakt.tv-queued | 0 calls are still waiting in the queue
```

Output when caching is enabled:

```
trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-cached | key generated: 45afecceb11968059894f26879aac134
trakt.tv-cached | key is not in memory: 45afecceb11968059894f26879aac134
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-cached | key generated: 069e06fa0a04c3fc2c4fb8cdf0c42f09
trakt.tv-cached | key is not in memory: 069e06fa0a04c3fc2c4fb8cdf0c42f09
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-cached | key generated: c62558c8d74b029ed0ced4daed0c5800
trakt.tv-cached | key is not in memory: c62558c8d74b029ed0ced4daed0c5800
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-cached | key generated: 60ef35408fc3ba21ce1100f2123c21f6
trakt.tv-cached | key is not in memory: 60ef35408fc3ba21ce1100f2123c21f6
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-cached | key generated: a75e20735ea304374f9c8ce60cd26d8b
trakt.tv-cached | key is not in memory: a75e20735ea304374f9c8ce60cd26d8b
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-cached | key generated: d0c9d4c491f9217575c0b99568e87c43
trakt.tv-cached | key is not in memory: d0c9d4c491f9217575c0b99568e87c43
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-cached | key generated: 51579eab5b85a7da66c37625a4aa24fb
trakt.tv-cached | key is not in memory: 51579eab5b85a7da66c37625a4aa24fb
trakt.tv-queued | enqueueing an API call...

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 5 calls are still waiting in the queue

API CALL COMPLETED: 13 "Archer" episodes fetched
API CALL COMPLETED: 10 "Game of Thrones" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 3 calls are still waiting in the queue

API CALL COMPLETED: 10 "Westworld" episodes fetched
API CALL COMPLETED: 8 "Humans" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | API call in progress...
trakt.tv-queued | 1 calls are still waiting in the queue

API CALL COMPLETED: 13 "American Horror Story" episodes fetched
API CALL COMPLETED: 10 "The Expanse" episodes fetched

trakt.tv-queued | API call in progress...
trakt.tv-queued | 0 calls are still waiting in the queue
API CALL COMPLETED: 10 "Penny Dreadful" episodes fetched

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "game-of-thrones", "season": 4}
trakt.tv-cached | key generated: 45afecceb11968059894f26879aac134
trakt.tv-cached | key is in memory: 45afecceb11968059894f26879aac134
trakt.tv-cached | returning data from memory (key: 45afecceb11968059894f26879aac134)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "archer", "season": 2}
trakt.tv-cached | key generated: 069e06fa0a04c3fc2c4fb8cdf0c42f09
trakt.tv-cached | key is in memory: 069e06fa0a04c3fc2c4fb8cdf0c42f09
trakt.tv-cached | returning data from memory (key: 069e06fa0a04c3fc2c4fb8cdf0c42f09)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "humans", "season": 1}
trakt.tv-cached | key generated: c62558c8d74b029ed0ced4daed0c5800
trakt.tv-cached | key is in memory: c62558c8d74b029ed0ced4daed0c5800
trakt.tv-cached | returning data from memory (key: c62558c8d74b029ed0ced4daed0c5800)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "westworld", "season": 1}
trakt.tv-cached | key generated: 60ef35408fc3ba21ce1100f2123c21f6
trakt.tv-cached | key is in memory: 60ef35408fc3ba21ce1100f2123c21f6
trakt.tv-cached | returning data from memory (key: 60ef35408fc3ba21ce1100f2123c21f6)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "the-expanse", "season": 1}
trakt.tv-cached | key generated: a75e20735ea304374f9c8ce60cd26d8b
trakt.tv-cached | key is in memory: a75e20735ea304374f9c8ce60cd26d8b
trakt.tv-cached | returning data from memory (key: a75e20735ea304374f9c8ce60cd26d8b)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "american-horror-story", "season": 2}
trakt.tv-cached | key generated: d0c9d4c491f9217575c0b99568e87c43
trakt.tv-cached | key is in memory: d0c9d4c491f9217575c0b99568e87c43
trakt.tv-cached | returning data from memory (key: d0c9d4c491f9217575c0b99568e87c43)

trakt.tv-queued | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-queued | forwarding to trakt.tv-cached...
trakt.tv-cached | method: /shows/:id/seasons/:season, params: {"id": "penny-dreadful", "season": 2}
trakt.tv-cached | key generated: 51579eab5b85a7da66c37625a4aa24fb
trakt.tv-cached | key is in memory: 51579eab5b85a7da66c37625a4aa24fb
trakt.tv-cached | returning data from memory (key: 51579eab5b85a7da66c37625a4aa24fb)

API CALL COMPLETED: 10 "Game of Thrones" episodes fetched
API CALL COMPLETED: 13 "Archer" episodes fetched
API CALL COMPLETED: 8 "Humans" episodes fetched
API CALL COMPLETED: 10 "Westworld" episodes fetched
API CALL COMPLETED: 10 "The Expanse" episodes fetched
API CALL COMPLETED: 13 "American Horror Story" episodes fetched
API CALL COMPLETED: 10 "Penny Dreadful" episodes fetched

trakt.tv-queued | 0 calls are still waiting in the queue
```


## LICENSE

The MIT License (MIT) - author: MySidesTheyAreGone <mysidestheyaregone@protonmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
