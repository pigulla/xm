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
    'C-7', 'C#7', 'D-7', 'D#7', 'E-7', 'F-7', 'F#7', 'G-7', 'G#7', 'A-7', 'A#7', 'H-7',
    ' ▭ '
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
            let offset = 1;
            const {
                note_follows, instrument_follows, volume_follows, effect_type_follows, effect_parameter_follows
            } = unpack_compression(first_byte);

            if (note_follows) {
                this.note = buffer.readUInt8(offset++);
            }
            if (instrument_follows) {
                this.instrument = buffer.readUInt8(offset++);
            }
            if (volume_follows) {
                this.volume = buffer.readUInt8(offset++);
            }
            if (effect_type_follows) {
                this.effect_type = buffer.readUInt8(offset++);

                if (!effect_parameter_follows) {
                    this.effect_parameter = 0;
                }
            }
            if (effect_parameter_follows) {
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

    to_key() {
        return this.note !== null ? notes[this.note] : null;
    }
}

module.exports = Note;
