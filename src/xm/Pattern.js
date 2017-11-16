const Note = require('./Note');

class Pattern {
    constructor(buffer) {
        const packed_size = buffer.readUInt16LE(7);
        const data = packed_size === 0 ? null : buffer.slice(9, 9 + packed_size)

        this.header_size = buffer.readUInt32LE(0);
        this.packing_type = buffer.readUInt8(4);
        this.num_rows = buffer.readUInt16LE(5);
        this.data_size = packed_size;
        this.data = data;
        this.notes = this._read_notes();
        this.size = this.data_size + 9;
    }

    notes_by_row() {
        const result = (new Array(this.num_rows)).fill(null).map(_ => []);

        for (let i = 0; i < this.notes.length; i++) {
            const row = Math.floor(i / this.num_rows);
            result[row].push(this.notes[i]);
        }

        return result;
    }

    notes_by_track(tracks) {
        const result = (new Array(tracks)).fill(null).map(_ => []);

        for (let i = 0; i < this.notes.length; i++) {
            result[i % tracks].push(this.notes[i]);
        }

        return result;
    }

    _read_notes() {
        let offset = 0;
        const notes = [];

        while (offset < this.data_size) {
            const data = this.data.slice(offset, offset + 5);
            const note = new Note(data);
            notes.push(note);
            offset += note.size;
        }

        return notes;
    }
}

module.exports = Pattern;
