const Header = require('./Header');
const Instrument = require('./Instrument');
const Pattern = require('./Pattern');

// ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20%28.xm%29.html

class Xm {
    constructor(buffer) {
        this.header = new Header(buffer);
        this.patterns = [];
        this.instruments = [];

        let position = 60 + 20 + 256;
        for (let i = 0; i < this.header.num_patterns; i++) {
            const data = buffer.slice(position);
            const pattern = new Pattern(data);

            this.patterns.push(pattern);
            position += pattern.size;
        }

        for (let i = 0; i < this.header.num_instruments; i++) {
            const data = buffer.slice(position);
            const instrument = new Instrument(data);
            this.instruments.push(instrument);
            position += instrument.size;
        }
    }
}

module.exports = Xm;
