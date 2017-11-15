const { buffer_to_byte_array } = require('./util');

class Header {
    constructor(buffer) {
        const version = buffer.readUInt16LE(58);
        const version_minor = version & 255;
        const version_major = version >> 8;
        const pattern_order_table = buffer.slice(80, 80 + 256);

        Object.assign(this, {
            id: buffer.toString('ascii', 0, 17).trim(),
            module_name: buffer.toString('ascii', 17, 37).trim(),
            $1a: buffer.toString('ascii', 37, 38),
            tracker_name: buffer.toString('ascii', 38, 58).trim(),
            version_number: `${version_major}.${String(version_minor).padStart(2, '0')}`,
            header_size: buffer.readUInt32LE(60),
            song_length: buffer.readUInt16LE(60 + 4),
            restart_position: buffer.readUInt16LE(60 + 6),
            num_channels: buffer.readUInt16LE(60 + 8),
            num_patterns: buffer.readUInt16LE(60 + 10),
            num_instruments: buffer.readUInt16LE(60 + 12),
            flags: buffer.readUInt16LE(60 + 14),
            default_tempo: buffer.readUInt16LE(60 + 16),
            default_bpm: buffer.readUInt16LE(60 + 18),
            pattern_order_table: buffer_to_byte_array(pattern_order_table)
        });
    }

    toJSON() {
        return {
            id: this.id,
            module_name: this.module_name,
            tracker_name: this.tracker_name,
            version_number: this.version_number,
            header_size: this.header_size,
            song_length: this.song_length,
            restart_position: this.restart_position,
            num_channels: this.num_channels,
            num_patterns: this.num_patterns,
            num_instruments: this.num_instruments,
            default_tempo: this.default_tempo,
            default_bpm: this.default_bpm,
            pattern_order_table: this.pattern_order_table
        };
    }

    uses_amiga_frequency_table() {
        return this.flags & 1 === 0;
    }

    uses_linear_frequency_table() {
        return this.flags & 1 === 1;
    }
}

module.exports = Header;
