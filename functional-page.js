/* 
 * Author: Oliver Steele
 * Copyright: Copyright 2007 by Oliver Steele.  All rights reserved.
 * License: MIT License
 * Homepage: http://osteele.com/javascripts/functional.html
 * Source: http://osteele.com/javascripts/functional-examples.js
 * Created: 2007-07-11
 * Modified: 2007-07-14
 */

var info = window.console && console.info || function(){};
var trace = info;

Function.prototype.reporting = function() {
    var fn = this;
    return function() {
        try {
            fn.apply(this, arguments);
        } catch (e) {
            info(e);
            throw e;
        }
    }
}

// debugging references
var gExamples, gDocs;

function initialize() {
    gExamples = OSDoc.Examples.load('functional-examples.js').onSuccess(done.saturate('examples')).replace($('output'));
    gDocs = new OSDoc.Docs({onLoad: function() {
        gDocs.replace($('docs'));
        done('docs');
    }});
    gDocs.load('functional.js');
    makeTogglePair('hide-header', 'show-header', 'header');
    Event.observe('run-tests', 'click', function(e) {
        Event.stop(e);
        var results = gDocs.runTests();
        alert(results.toHTML());
    });
    Event.observe('write-tests', 'click', function(e) {
        Event.stop(e);
        var text = gDocs.createTestText();
        document.write('<pre>'+text.escapeHTML()+'</pre>');
    });
    Event.observe('cin', 'keyup', function(e) {
        if (e.keyCode == 13) {
            doit();
            Event.stop(e);
        }
    });
    Event.observe('eval', 'click', function(e) {
        doit();
    });
    function makeToggler(button, complement, action) {
        Event.observe(button, 'click', function(e) {
            Event.stop(e);
            Element.hide(button);
            Element.show(complement);
            action();
        });
    }
    function makeTogglePair(hider, shower, target) {
        makeToggler(hider, shower, Element.hide.bind(Element, target));
        makeToggler(shower, hider, Element.show.bind(Element, target));
    }
}

var gg = {};
function doit() {
    var cin = $('cin').value = $('cin').value.strip().replace('\n', '');
    var html;
    try {
        cin = cin.replace(/^\s*var\s+/, '');
        var v;
        with(gg) v = eval(cin);
        html = OSDoc.toString(v).escapeHTML();
    } catch (e) {
        html = 'Error: ' + e;
    }
    $('cout').innerHTML = html;
    //window.location = '#cin';
}

function done(name) {
    var me = arguments.callee;
    me[name] = true;
    if (me.docs && me.examples) {
        $('noscript').hide();
        function handler(e) {
            var text = Event.element(e).innerHTML.unescapeHTML();
            $('cin').value = text;
            doit();
        }
        map(Event.observe.bind(Event).partial(_, 'click', handler), $$('.input'));
    }
}

Event.observe(window, 'load', initialize);
