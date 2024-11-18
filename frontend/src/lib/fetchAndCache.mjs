
export function fetchAndCache(id, service, statusCache, valueCache) {
   if (!statusCache || !valueCache) return { value: undefined, promise: null }
   const status = statusCache[id]
   if (status === 'ready') return { value: valueCache[id], promise: null }
   if (status === 'ongoing') return { value: undefined, promise: null } // ongoing request
   statusCache[id] = 'ongoing'
   const promise = service.findUniqueOrThrow({ where: { id }})
   promise.then(value => {
      valueCache[id] = value
      statusCache[id] = 'ready'
   })
   .catch(err => {
      console.log('fetchAndCache err', id, service.name, where, err)
      setTimeout(() => {
         delete statusCache[id]
      }, 500)
   })
   return { value: undefined, promise }
}

export function fetchAndCacheList(service, where, whereTag, predicate, statusCache, valueCache, listStatusCache) {
   if (!statusCache || !valueCache || !listStatusCache) return { value: undefined, promise: null }
   const status = listStatusCache[whereTag]
   if (status === 'ready') {
      return {
         value: Object.values(valueCache).filter(val => predicate(val)),
         promise: null,
      }
   }
   if (status === 'ongoing') return { value: [], promise: null } // ongoing request
   listStatusCache[whereTag] = 'ongoing'
   const promise = service.findMany({ where })
   promise.then(list => {
      for (const value of list) {
         valueCache[value.id] = value
         statusCache[value.id] = 'ready'
      }
      listStatusCache[whereTag] = 'ready'
   })
   .catch(err => {
      console.log('fetchAndCacheList err', service.name, where, err)
      setTimeout(() => {
         delete listStatusCache[whereTag]
      }, 500)
   })
   return { value: [], promise }
}
