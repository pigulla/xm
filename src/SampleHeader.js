const { buffer_to_string } = require('./util');

class SampleHeader {
    get size() {
        return 40;
    }

    toJSON() {
        return {
            length: this.length,
            loop_start: this.loop_start,
            loop_length: this.loop_length,
            volume: this.volume,
            fine_tune: this.fine_tune,
            type: this.type,
            panning: this.panning,
            relative_note_number: this.relative_note_number,
            reserved: this.reserved,
            name: this.name,
        };
    }

    static from(buffer, position) {
        const sample_header = new SampleHeader();

        Object.assign(sample_header, {
            length: buffer.readUInt32LE(position),
            loop_start: buffer.readUInt32LE(position + 4),
            loop_length: buffer.readUInt32LE(position + 8),
            volume: buffer.readUInt8(position + 12),
            fine_tune: buffer.readInt8(position + 13),
            type: buffer.readUInt8(position + 14),
            panning: buffer.readUInt8(position + 15),
            relative_note_number: buffer.readInt8(position + 16),
            reserved: buffer.readInt8(position + 17),
            name: buffer_to_string(buffer, position + 18, 22)
        });

//        console.log(`  Sample name is "${sample_header.sample_name}"`);
//        console.log(`  Sample length is ${sample_header.sample_length} bytes`);

        return sample_header;
    }
}

module.exports = SampleHeader;
