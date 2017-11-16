const assert = require('assert');

const notes = [
    null,
    'C-0', 'C#0', 'D-0', 'D#0', 'E-0', 'F-0', 'F#0', 'G-0', 'G#0', 'A-0', 'A#0', 'H-0',
    'C-1', 'C#1', 'D-1', 'D#1', 'E-1', 'F-1', 'F#1', 'G-1', 'G#1', 'A-1', 'A#1', 'H-1',
    'C-2', 'C#2', 'D-2', 'D#2', 'E-2', 'F-2', 'F#2', 'G-2', 'G#2', 'A-2', 'A#2', 'H-2',
    'C-3', 'C#3', 'D-3', 'D#3', 'E-3', 'F-3', 'F#3', 'G-3', 'G#3', 'A-3', 'A#3', 'H-3',
    'C-4', 'C#4', 'D-4', 'D#4', 'E-4', 'F-4', 'F#4', 'G-4', 'G#4', 'A-4', 'A#4', 'H-4',
    'C-5', 'C#5', 'D-5', 'D#5', 'E-5', 'F-5', 'F#5', 'G-5', 'G#5', 'A-5', 'A#5', 'H-5',
    'C-6', 'C#6', 'D-6', 'D#6', 'E-6', 'F-6', 'F#6', 'G-6', 'G#6', 'A-6', 'A#6', 'H-6',
    'C-7', 'C#7', 'D-7', 'D#7', 'E-7', 'F-7', 'F#7', 'G-7', 'G#7', 'A-7', 'A#7', 'H-7'
];

function is_compression_info(byte) {
    return (byte & 0b10000000) !== 0;
}

function unpack_compression(byte) {
    return {
        note_follows: (byte & 0b00000001) > 0,
        instrument_follows: (byte & 0b00000010) > 0,
        volume_follows: (byte & 0b00000100) > 0,
        effect_type_follows: (byte & 0b00001000) > 0,
        effect_parameter_follows: (byte & 0b00010000) > 0
    };
}

class Note {
    constructor(buffer, fields) {
        const first_byte = buffer.readUInt8(0);

        this.size = null;
        this.note = null;
        this.instrument = null;
        this.volume = null;
        this.effect_type = null;
        this.effect_parameter = null;
        this.is_compressed = is_compression_info(first_byte);

        if (this.is_compressed) {
            const compression = unpack_compression(first_byte);
            let offset = 1;

            if (compression.note_follows) {
                this.note = buffer.readUInt8(offset++);
            }
            if (compression.instrument_follows) {
                this.instrument = buffer.readUInt8(offset++);
            }
            if (compression.volume_follows) {
                this.volume = buffer.readUInt8(offset++);
            }
            if (compression.effect_type_follows) {
                this.effect_type = buffer.readUInt8(offset++);
            }
            if (compression.effect_parameter_follows) {
                this.effect_parameter = buffer.readUInt8(offset++);
            }

            this.size = offset;

        } else {
            this.size = 5;
            this.note = buffer.readUInt8(0);
            this.instrument = buffer.readUInt8(1);
            this.volume = buffer.readUInt8(2);
            this.effect_type = buffer.readUInt8(3);
            this.effect_parameter = buffer.readUInt8(4);
        }
    }

    is_key_off() {
        return this.note === 97;
    }

    volume_string() {
        const v = this.volume;

        if (v === null) {
            return '   ';
        } else if (v >= 0x10 && v <= 0x50) {
            // set volume
            return ' ' + (v - 0x10).toString(16).padStart(2, '0');
        } else if (v >= 0x60 && v <= 0x6f) {
            // volume slide down
            return '▼' + (v - 0x60).toString(16);
        } else if (v >= 0x70 && v <= 0x7f) {
            // volume slide up
            return '▲' + (v - 0x70).toString(16);
        } else if (v >= 0x80 && v <= 0x8f) {
            // fine volume slide down
            return '▽' + (v - 0x80).toString(16);
        } else if (v >= 0x90 && v <= 0x9f) {
            // fine volume slide up
            return '△' + (v - 0x90).toString(16);
        } else if (v >= 0xa0 && v <= 0xaf) {
            // set vibrato speed
            return '≈' + (v - 0xa0).toString(16);
        } else if (v >= 0xb0 && v <= 0xbf) {
            // vibrato
            return '~' + (v - 0xb0).toString(16);
        } else if (v >= 0xc0 && v <= 0xcf) {
            // set panning
            return '◇' + (v - 0xc0).toString(16);
        } else if (v >= 0xd0 && v <= 0xdf) {
            // panning slide left
            return '◁' + (v - 0xd0).toString(16);
        } else if (v >= 0xe0 && v <= 0xef) {
            // panning slide right
            return '▷' + (v - 0xe0).toString(16);
        } else if (v >= 0xf0 && v <= 0xff) {
            // tone porta
            return '◎' + (v - 0xf0).toString(16);
        } else {
            return `??? (${v})`;
        }
    }

    toString() {
        return (this.is_compressed ? '@[' : ' [') + (
                [
                    this.note === null ? '   ' : (this.is_key_off() ? ' ▭ ' : (notes[this.note] || '???')),
                    this.instrument !== null ? this.instrument.toString(16).padStart(2, '0') : '  ',
                    this.volume_string(),
                    this.effect_type !== null ? this.effect_type.toString(16).padStart(2, '0') : '  ',
                    this.effect_parameter !== null ? this.effect_parameter.toString(16).padStart(2, '0') : '  ',
                ].join(' ')
            ) + `] (${this.size})`;
    }
}

module.exports = Note;
