
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
        
    app.service('course').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })

    app.service('card').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
    
    app.service('quiz').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
    
    app.service('quiz_choice').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })
    
    app.service('case_study').publish(async (context) => {
        return context.methodName.startsWith('find') ? [] : ['authenticated']
    })

}
