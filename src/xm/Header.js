class Header {
    constructor(buffer) {
        const version = buffer.readUInt16LE(58);
        const version_minor = version & 255;
        const version_major = version >> 8;
        const pattern_order_table = buffer.slice(80, 80 + 256);

        this.id = buffer.toString('ascii', 0, 17).trim();
        this.module_name = buffer.toString('ascii', 17, 37).trim();
        this.$1a = buffer.toString('ascii', 37, 38);
        this.tracker_name = buffer.toString('ascii', 38, 58).trim();
        this.version_number = `${version_major}.${String(version_minor).padStart(2, '0')}`;
        this.header_size = buffer.readUInt32LE(60);
        this.song_length = buffer.readUInt16LE(60 + 4);
        this.restart_position = buffer.readUInt16LE(60 + 6);
        this.num_channels = buffer.readUInt16LE(60 + 8);
        this.num_patterns = buffer.readUInt16LE(60 + 10);
        this.num_instruments = buffer.readUInt16LE(60 + 12);
        this.flags = buffer.readUInt16LE(60 + 14);
        this.default_tempo = buffer.readUInt16LE(60 + 16);
        this.default_bpm = buffer.readUInt16LE(60 + 18);
        this.pattern_order_table = [...pattern_order_table.slice(0, this.song_length)];

        console.dir(this.pattern_order_table.map(n => n.toString(16)));
    }

    uses_amiga_frequency_table() {
        return this.flags & 1 === 0;
    }

    uses_linear_frequency_table() {
        return this.flags & 1 === 1;
    }
}

module.exports = Header;
