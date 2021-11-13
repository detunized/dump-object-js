// Copyright (C) Dmitry Yakimenko (detunized@gmail.com).
// Licensed under the terms of the MIT license. See LICENCE for details.

// TODO: This is a work in progress thing. It needs a bit of work before
//       it could be used by anyone but myself.

(function () {
    function log(o) {
        if (typeof sendToHost === "function") {
            sendToHost(o.toString());
        } else {
            console.log(o);
        }
    }

    function main() {
        const usePadding = false;
        const squashNewlines = true;

        function dump(o, indent) {
            if (typeof indent === "undefined") {
                indent = "";
            }

            dumpObject(o, indent, []);
        }

        function dumpObject(o, indent, seen) {

            if (indent.length > 6)
                return;

            let keys = [];
            for (let k in o) {
                keys.push(k);
            }

            keys.sort();
            let maxKeyLength = Math.max(...keys.map(x => x.length));

            for (let i in keys) {
                let k = keys[i];
                let padding = usePadding ? " ".repeat(maxKeyLength - k.length) : "";
                let v = safeProperty(o, k);
                let primitive = isPrimitive(v);
                let fv = primitive ? formatPrimitiveValue(v) : getOpeningBrace(v);
                log(`${indent}${k}${padding} = ${fv}`);
                if (!primitive) {
                    seen.push(v);
                    dumpObject(v, indent + "  ", seen);
                    seen.pop(v);
                    log(indent + getClosingBrace(v));
                }
            }
        }

        function isPrimitive(v) {
            let t = typeof v;
            return v === null || t === "undefined" || t === "string" || t === "number" || t === "function";
        }

        function formatPrimitiveValue(v) {
            if (v === null) {
                return "null";
            }

            if (typeof v === "undefined") {
                return "undefined";
            }

            if (typeof v === "string") {
                return squashNewlines ? v.replaceAll("\n", " ") : v;
            }

            if (typeof v === "number" || typeof v === "function") {
                return v.toString();
            }

            return "";
        }

        function getOpeningBrace(v) {
            return Array.isArray(v) ? "[" : "{";
        }

        function getClosingBrace(v) {
            return Array.isArray(v) ? "]" : "}";
        }

        function formatValue(v, indent) {
            if (v === null) {
                return "null";
            }

            if (typeof v === "undefined") {
                return "undefined";
            }

            if (typeof v === "string") {
                return v;
            }

            if (typeof v === "number") {
                return v.toString();
            }

            if (typeof v === "object") {
                if (Array.isArray(v)) {
                    return "[" + v.map(x => x.toString()).join(", ")  + "]";
                }

                return "{" + Object.keys(v).map(x => x.toString()).join(", ")  + "}";
            }

            return v.toString();
        }

        function safeProperty(o, k) {
            try {
                return o[k];
            } catch (error) {
                return error.toString();
            }
        }

        // TODO: Get rid of this. Just for testing.
        log("window");
        dump(window, "  ");
    }

    try {
        main();
    } catch (error) {
        log(error);
    }
})()
