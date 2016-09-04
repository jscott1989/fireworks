const past_regex = new RegExp("<%(.+?)%>", "g");
const current_regex = new RegExp("<#(.+?)#>", "g");

module.exports = {
    parseText(t) {
        t = t.replace(past_regex, (r) => {
            const key = r.substr(2, r.length - 4);
            return "<strong>" + data.text[key] + "</strong>";
        });

        t = t.replace(current_regex, (r) => {
            const key = r.substr(2, r.length - 4);
            return "<em>" + window.text[key] + "</em>";
        });

        return t;
    },

    parseSound(text) {
        text = text.replace(past_regex, (r) => {
            const key = r.substr(2, r.length - 4);
            return data.sound[key];
        });

        text = text.replace(current_regex, (r) => {
            const key = r.substr(2, r.length - 4);
            return sounds[key];
        });

        return text;
    }
}