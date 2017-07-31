const R = require('ramda')

let queued = module.exports = {}
let cached
let Trakt

let debugEnabled = false

let running = []
let queue = []

let config = {}

function _debug (msg) {
  if (debugEnabled) {
    console.log('trakt.tv-queued | ' + msg)
  }
}

const decideBy = R.curry((fnName, obj) => obj[fnName]())

function pendingAwarePromise (p) {
  let pending = true
  p.then(() => (pending = false)).catch(() => (pending = false))
  p.isPending = () => pending
  return p
}

function interval (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay * 1000)
  })
}

function enqueue (fn) {
  _debug('enqueueing an API call...')
  var resolveAction, rejectAction
  var p = new Promise((resolve, reject) => {
    resolveAction = resolve
    rejectAction = reject
  })

  queue.push({
    act: fn,
    res: resolveAction,
    rej: rejectAction
  })

  process.nextTick(advance)
  return p
}

async function run (delay, p) {
  _debug('API call in progress...')
  await Promise.all([
    p.act().then(p.res).catch(p.rej),
    interval(delay)
  ])
  process.nextTick(advance)
}

function advance () {
  let p
  let delay = config.delay
  let concurrency = config.concurrency
  running = R.filter(decideBy('isPending'), running)
  while (running.length < concurrency && queue.length > 0) {
    p = queue.shift()
    running.push(pendingAwarePromise(run(delay, p)))
  }
  _debug(queue.length + ' calls are still waiting in the queue')
}

function reconfigure (options) {
  config.concurrency = options.concurrency || 2
  config.delay = options.delay || 1
  config.cached = options.cached || false
  if (config.cached && R.isNil(cached)) {
    cached = Trakt.cached
  }
}

queued.debug = function (enabled) {
  debugEnabled = enabled
  return cached
}

queued.reconfigure = reconfigure

queued.ttl = function (n) {
  if (!R.isNil(cached)) {
    cached.ttl(n)
  }
  return queued
}

queued._call = function (method, params) {
  _debug('method: ' + method.url + ', params: ' + R.toString(params))
  if (config.cached) {
    _debug('forwarding to trakt.tv-cached...')
    return cached._call(method, params, enqueue)
  } else {
    return enqueue(() => Trakt._call(method, params))
  }
}

queued.init = function (trakt, options) {
  Trakt = trakt
  trakt._construct.apply(queued)
  reconfigure(options)
}
