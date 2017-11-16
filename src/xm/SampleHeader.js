const { buffer_to_string } = require('./util');

class SampleHeader {
    cosntructor(buffer) {
        this.length = buffer.readUInt32LE(0);
        this.loop_start = buffer.readUInt32LE(4);
        this.loop_length = buffer.readUInt32LE(8);
        this.volume = buffer.readUInt8(12);
        this.fine_tune = buffer.readInt8(13);
        this.type = buffer.readUInt8(14);
        this.panning = buffer.readUInt8(15);
        this.relative_note_number = buffer.readInt8(16);
        this.reserved = buffer.readInt8(17);
        this.name = buffer_to_string(buffer, 18, 22);
        this.size = 40;
    }
}

module.exports = SampleHeader;
