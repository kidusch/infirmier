
/* https://shamansir.github.io/pegjs-fn/ */


lines
   = lineTerminator* car:line cdr:(lineTerminator* line)* lineTerminator*
   { return [car, ...cdr.map(x => x[1])] }


line
  = title / li / parts

title
  = cat:"#"+ ([ ]+) text:words
  { return { type: 'title', cat: cat.length, text } }

li
  = "-" ([ ]+) content:part+
  { return { type: 'li', content } }

parts
  = list:part+
  { return list.length === 1 ? list[0] : list }

part = emphasized_text / plain_text / special

plain_text
  = text:words
  { return { type: 'plain_text', text } }

emphasized_text
  = "***" text:words "***"
  { return { type: 'emphasized_text', text } }

special
  = "[" text:words "]{" type " " ref:words "}"
  { return { type: 'special', text, ref } }

type = "link" / "image" / "3D-model"

words
  = text:[^\n\r\[\]\{\}*]+
  { return text.join('') }


lineTerminator 
  = [\n\r] 


