# trakt.tv-queued

Experimental plugin that automatically queues any call fired by the main module `trakt.tv`

At the moment it depends on any version of Node.js that supports async/await.

If you enable `trakt.tv-cached` too and pass the option `cached: true`, then `trakt.tv-queued` will use `trakt.tv-cached` to transparently cache any GET request.

TODO: complete this README.md

## Quick usage

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
      cached: true
    },
    cached: {
      defaultTTL: 20
    }
  }
})
```

`concurrency` sets how many calls can be in execution during the period defined by `delay` (in seconds). So, `concurrency: 2` and `delay: 1` means "no more than 2 calls at the same time in the space of 1 second".

`cached` can only be `true` if the plugin `cached` has been enabled. If so, any API call will hit the cache first; if the data is not cached, it will go in the queue and it will be executed - eventually; if the data is cached, it will be returned immediately as a resolved Promise without going into the queue.

At this time there's no way to set a timeout. If a call hangs, the queue will hang indefinitely as well.

If `trakt.tv-cached` is enabled and `cached` set to `true` in `trakt.tv-queue` options, anything you do to `cached` will have an effect on `queued`. The `ttl` parameter that `cached` expects will also have the intended effect, of course.

`concurrency`, `delay` and `cached` can be reconfigured on the fly:

```js
trakt.queued.reconfigure({concurrency: 4, delay: 1, cached: false})
```

`trakt.tv-queued` works similarly to `trakt.tv-cached`; you call the regular `trakt.tv` methods on the `queued` plugin:

```js
trakt.cached.setDefaultTTL(40)
let data = await trakt.queued.seasons.season({id: 'game-of-thrones', season: 4})
console.log('API CALL COMPLETED: ' + data.length + ' "Game of Thrones" episodes fetched'))
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
