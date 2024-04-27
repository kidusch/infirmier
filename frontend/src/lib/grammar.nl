

line
  = title / li

title
  = cat:"#"+ ([ ]+) text:words
  { return { type: 'title', cat: cat.length, text } }

li
  = "-" ([ ]+) text:words
  { return { type: 'li', text } }


words
  = text:[^\n\r\[\]\{\}]+
  { return text.join('') }



Word
  = chars:[a-zA-Z0-9_]+
     { return { 'name': chars.join("") }; }


_ "whitespace"
  = ( whiteSpace / lineTerminator / lineComment )*
     { return []; }

whiteSpace 
  = [\t\v\f \u00A0\uFEFF] 

lineTerminator 
  = [\n\r] 

lineComment 
  = "//" (!lineTerminator anyCharacter)* 
  / "#" (!lineTerminator anyCharacter)* 

anyCharacter 
  = . 

