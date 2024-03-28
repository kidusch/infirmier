import _ from 'lodash'

export function debouncedFunction(func, wait=500, maxWait=5000) {
   return _.debounce(func, wait, { maxWait })
}
