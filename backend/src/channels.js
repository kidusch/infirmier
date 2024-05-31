
export default function(app) {
        
    app.service('user').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
        
    app.service('ue').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
        
    app.service('sub_ue').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
        
    app.service('topic').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })

}
