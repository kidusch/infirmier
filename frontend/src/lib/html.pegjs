{
  function makeNode(name, attributes, children) {
    return { type: 'Element', name: name, attributes: attributes, children: children };
  }
  function makeAttribute(name, value) {
    return { name: name, value: value };
  }
}

start
  = children:element*
  { return makeNode('body', [], children); }

element
  = openTag:openTag children:element* closeTag?
  { return makeNode(openTag.name, openTag.attributes, children); }
  / selfClosingTag
  / text

openTag
  = "<" name:tagName space* attributes:attribute* ">"
  { return { name: name, attributes: attributes }; }

closeTag
  = "</" tagName ">"

selfClosingTag
  = "<" name:tagName space* attributes:attribute* "/>"
  { return makeNode(name, attributes, []); }

attribute
  = name:attributeName space* "=" value:attributeValue space*
  { return makeAttribute(name, value); }

attributeName
  = first:[a-zA-Z_:] others:[a-zA-Z0-9:._-]*
  { return [first, ...others].join('') }

attributeValue
  = "\"" value:[^\"]* "\"" { return value.join(""); }
  / "'" value:[^']* "'" { return value.join(""); }

tagName
  = first:[a-zA-Z] others:[a-zA-Z0-9]*
  { return [first, ...others].join('') }

text
  = [^<]+ { return { type: 'Text', value: text() }; }

space
  = [\n\r ]
