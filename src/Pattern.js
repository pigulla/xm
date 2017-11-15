class Pattern {
    get size() {
        return this.packed_patterndata_size + 9;
    }

    toJSON() {
        return {
            header_size: this.header_size,
            num_rows: this.num_rows,
            packed_patterndata_size: this.packed_patterndata_size
        };
    }

    static from(buffer, position) {
        const pattern = new Pattern();
        const packed_size = buffer.readUInt16LE(position + 7);
        const patterndata = packed_size === 0 ? null : buffer.slice(position + 9, position + 9 + packed_size)

        Object.assign(pattern, {
            header_size: buffer.readUInt32LE(position),
            packing_type: buffer.readUInt8(position + 4),
            num_rows: buffer.readUInt16LE(position + 5),
            packed_patterndata_size: packed_size,
            patterndata
        });

        return pattern;
    }
}

module.exports = Pattern;
