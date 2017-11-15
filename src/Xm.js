const Header = require('./Header');
const Instrument = require('./Instrument');
const Pattern = require('./Pattern');

class Xm {
    constructor(buffer) {
        this.header = new Header(buffer);
        this.patterns = [];
        this.instruments = [];

        let position = 60 + 20 + 256;
        for (let i = 0; i < this.header.num_patterns; i++) {
            //console.log(`Loading pattern ${i} from offset ${position}`);

            const pattern = Pattern.from(buffer, position);
            this.patterns.push(pattern);
            position += pattern.size;
        }

        for (let i = 0; i < this.header.num_instruments; i++) {
//            console.log(`Loading instrument ${i} from offset ${position}`);

            const instrument = Instrument.from(buffer, position);
            this.instruments.push(instrument);
//            console.log(`  Instrument size is ${instrument.size}`);
            position += instrument.size;
        }
    }

    toJSON() {
        return {
//            header: this.header.toJSON(),
//            patterns: this.patterns.map(pattern => pattern.toJSON()),
            instruments: this.instruments.map(instrument => instrument.toJSON())
        };
    }
}

module.exports = Xm;
