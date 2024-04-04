import _ from 'lodash'

export function debouncedFunction(func, wait=500, maxWait=5000) {
   return _.debounce(func, wait, { maxWait })
}

export function timeout(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
