const start = async () => {
  return await Promise.resolve('value')
}

start().then(console.error)

// const variable = 42 /*unused-vars*/

class Util {
  static id = Date.now()
}

import('lodash-es').then(_ => {
  console.error('lodash', _.random(0, 42, true))
})

console.error('date', Util.id)
