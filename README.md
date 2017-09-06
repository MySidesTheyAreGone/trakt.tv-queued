# trakt.tv-queued
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)<br /><br />
[![NPM](https://nodei.co/npm/trakt.tv-queued.png?downloads=true&stars=true)](https://nodei.co/npm/trakt.tv-queued/)
[![NPM](https://nodei.co/npm-dl/trakt.tv-queued.png?months=6)](https://nodei.co/npm/trakt.tv-queued/)

By using this plugin you can forget about rate-limiting your requests. Simply set a `concurrency` and `delay` and the plugin will take care of everything.

Moreover, if you enable `trakt.tv-cached` the functionality of the two plugins can be combined.

At the moment `trakt.tv-queued` depends on any version of Node.js that supports async/await.


## Basic usage

Install the plugin as a normal dependency:

```js
$ npm i trakt.tv-queued --save
```

When you create a trakt.tv instance, pass this plugin to the constructor and specify any options:

```js
let Trakt = require('trakt.tv')
let trakt = new Trakt({
  client_id: 'YYY',
  client_secret: 'ZZZ',
  plugins: {
    queued: require('trakt.tv-queued')
  },
  options: {
    queued: {
      concurrency: 2,
      delay: 1
    }
  }
})
```

Make sure the plugin itself and its options are in a field called `queued`.

`concurrency` sets how many calls can be in execution during the period defined by `delay` (in seconds). So, `concurrency: 2` and `delay: 1` means "no more than 2 calls at the same time in the space of 1 second". If an API call requires more than one second to complete, a new one will be fired as soon as it completes; if it requires only half a second, a half second delay will be added before firing the next call.

At this time there's no way to set a timeout. If a call hangs, the queue will hang indefinitely as well. This should never happen.

To use the plugin, simply add `queued.` before the method you would normally call directly on the main module:

```js
let data = await trakt.queued.seasons.season({id: 'game-of-thrones', season: 4})
console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched'))
```
`concurrency` and `delay` can be reconfigured on the fly. This would increase concurrency to 4:

```js
trakt.queued.reconfigure({concurrency: 4, delay: 1})
```

You can shut down everything, clearing the queue completely, by calling the `shutdown` function:

```js
trakt.queued.shutdown()
```

This will empty the queue immediately. Any queued request will be rejected with a `ShutdownError`. You can tell it apart from any other Error from the `name` field, which is set to "ShutdownError", or by comparison with `trakt.queued.ShutdownError`. You app should probably just swallow it and maybe tell the user that a few pending requests have been canceled.

## Combining `queued` with `cached`

`trakt.tv-queued` and `trakt.tv-cached` are loosely coupled. To combine their functionality, enable them both and pass the option `cached` (set to `true`) to `queued`:

```js
let Trakt = require('trakt.tv')
let trakt = new Trakt({
  client_id: 'YYY',
  client_secret: 'ZZZ',
  plugins: {
    cached: require('trakt.tv-cached'),
    queued: require('trakt.tv-queued')
  },
  options: {
    queued: {
      concurrency: 2,
      delay: 1,
      cached: true // <-- this is important lol
    },
    cached: {
      defaultTTL: 20
    }
  }
})
```

If you do this, any API call will hit the cache first; if the data is not cached, it will go in the queue and it will be executed - eventually; if the data is cached, it will be returned immediately as a resolved Promise without going into the queue.

`cached` can be reconfigured on the fly just like `concurrency` and `delay`. This would turn the cache off and increase concurrency to 4:

```js
trakt.queued.reconfigure({concurrency: 4, delay: 1, cached: false})
```

The `system:ttl` parameter that `cached` expects will have the intended effect in any call you make via either `queued` or `cached`.

```js
trakt.cached.setDefaultTTL(40)
let data = await trakt.queued.seasons.season({id: 'game-of-thrones', season: 4})
console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched'))

// the following call will complete almost immediately without going into the queue
// because the data you need is already in the cache
data = await trakt.queued.seasons.season({id: 'game-of-thrones', season: 4})
console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched'))

// the following call will be queued and its result cached, but the TTL will be 0
data = await trakt.queued.seasons.season({id: 'penny-dreadful', season: 2, system:ttl: 0})
console.log('API CALL COMPLETED: ' + data.length + ' "Penny Dreadful" episodes fetched'))

// since the data fetched with the previous call has already expired, this
// call will hit the website again
data = await trakt.queued.seasons.season({id: 'penny-dreadful', season: 2})
console.log('API CALL COMPLETED: ' + data.length + ' "Penny Dreadful" episodes fetched'))
```

You can still use `cached` normally if you need to make calls that shouldn't be queued.

## Debugging

If you enable debug mode...

```js
trakt.queued.enableDebug()
```

...you'll get a truckload of messages of very dubious usefulness.

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
