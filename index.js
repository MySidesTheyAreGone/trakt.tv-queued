const R = require('ramda')

class ShutdownError extends Error {
  constructor () {
    super('Canceled - shutting down')
    this.name = 'ShutdownError'
  }
}

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
}

function shutdown () {
  for (let job of queue) {
    job.rej(new ShutdownError())
  }
  queue = []
}

function enableDebug () {
  debugEnabled = true
  return queued
}

function _call (method, params) {
  _debug('method: ' + method.url + ', params: ' + R.toString(params))
  if (config.cached === true && !R.isNil(Trakt.cached)) {
    _debug('forwarding to trakt.tv-cached...')
    return Trakt.cached._call(method, R.assoc('enqueue', enqueue, params))
  } else {
    return enqueue(() => Trakt._call(method, params))
  }
}

let queued = module.exports = {
  enableDebug,
  reconfigure,
  shutdown,
  ShutdownError,
  _call
}

queued.init = function (trakt, options) {
  Trakt = trakt
  trakt._construct.apply(queued)
  reconfigure(options)
}
