import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'


export async function loadFBXFromUri(uri, scene) {
   const loader = new FBXLoader()
   const reader = new FileReader()
 
   const res = await fetch(uri)
   const blob = await res.blob()
 
   reader.onload = evt => {
      const result = evt.target?.result
      if (!result) return
   
      const group = loader.parse(result, '')
      scene.add(group)
   }
 
   reader.readAsArrayBuffer(blob)
}


export async function loadFBXFromArrayBuffer(arrayBuffer) {
   // const loader = new FBXLoader()
   // const reader = new FileReader()
 
   // const res = await fetch('/assets/Idle.fbx')
   // const blob = await res.blob()
 
   // reader.onload = evt => {
   //   const result = evt.target?.result
   //   if (!result) return
 
   //   const group = loader.parse(result, '')
   //   this.scene.add(group)
   // }
 
   // reader.readAsArrayBuffer(blob)


   return new Promise((resolve, reject) => {

      const loader = new FBXLoader()
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      
      reader.onload = function(e) {
         const result = evt.target?.result
         if (!result) reject(new Error('Error in loadFBXFromArrayBuffer'))

         const group = loader.parse(result, '')
         resolve(group)
      }

      reader.onerror = function(e) {
         reject(new Error('Error in loadFBXFromArrayBuffer'))
      }

   })

}
