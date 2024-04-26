@{%
const appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } }
const appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } }
const empty = function (d) { return []; }
const emptyStr = function (d) { return ""; }
%}

rows              -> row
                   | rows newline row                {% appendItem(0,2) %}

row               -> part
                   | row " ":+ part                   {% appendItem(0,2) %}
				   
				   
part -> special | emphasis | title | text

text -> [^\n\r*\[\]\(\) ]:+

type -> "image" | "3d-model"

special -> "[" text "](" type ":" text ")"

emphasis -> "***" text "***"

title -> "#":+ text

newline           -> "\r" "\n"                       {% empty %}
                   | "\r" | "\n"                     {% empty %}