
/* https://shamansir.github.io/pegjs-fn/ */

main = lineTerminator* list:lines lineTerminator*
  { return list }

lines
   = car:line cdr:line*
   { return [...car.flat(), ...cdr.flat()] }


line
  = title / li / parts / empty_line

empty_line
  = lineTerminator+
  { return [{ type: 'break' }] }

title
  = cat:"#"+ ([ ]+) text:words lineTerminator
  { return [{ type: 'title', cat: cat.length, text }] }

li
  = "-" ([ ]+) content:part+
  { return [{ type: 'li', content }] }

parts = list:part+

part = emphasized_text / plain_text / special

plain_text
  = text:words
  { return { type: 'span', text } }

emphasized_text
  = "{" text:words "}"
  { return { type: 'bold-span', text } }

special
  = "[" text:words "]{" type:type " " ref:words "}"
  { return { type, text, ref } }

type = "link" / "lexique" / "image" / "audio" / "3D"

words
  = text:[^\n\r\[\]\{\}*]+
  { return text.join('') }


lineTerminator 
  = [\n\r] 
