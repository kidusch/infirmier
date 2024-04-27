@{%
const appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } }
const appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } }
const empty = function (d) { return []; }
const emptyStr = function (d) { return ""; }
%}


lines              -> line
                   | lines newline line                {% appendItem(0,2) %}

line               -> "#":+ " " parts
                   | "-" " ":+ parts
				   | parts
				   
parts -> part | part " ":+ parts	 

				   
part -> special | emphasis | text


text -> [^\n\r*\[\]\(\) ]:+

type -> "image" | "3d-model"

special -> "[" text "]{" type ":" text "}"

emphasis -> "***" text "***"


newline           -> "\r" "\n"                       {% empty %}
                   | "\r" | "\n"                     {% empty %}
				   
unquoted_field    -> null                            {% emptyStr %}
                   | unquoted_field char             {% appendItemChar(0,1) %}

char              -> [^\n\r",]                       {% id %}
