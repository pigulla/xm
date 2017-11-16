const { buffer_to_string } = require('./util');
const SampleHeader = require('./SampleHeader');

class Instrument {
    constructor(buffer) {
        this.packed_size = buffer.readUInt16LE(7);
        this.data = this.packed_size === 0 ? null : buffer.slice(9, 9 + this.packed_size);
        this.num_samples = buffer.readUInt16LE(27);
        this.header_size = buffer.readUInt32LE(0);
        this.name = buffer_to_string(buffer, 4, 22);
        this.type = buffer.readUInt8(26);
        this.sample_headers = [];
        this.sample_data = [];

        if (this.num_samples === 0) {
            return;
        }

        const volume_envelope_points = buffer.slice(129, 129 + 48);
        const panning_envelope_points = buffer.slice(177, 177 + 48);
        const sample_numbers = buffer.slice(33, 33 + 96);

        this.sample_header_size = buffer.readUInt32LE(29);
        this.sample_numbers = [...sample_numbers];
        this.volume_envelope_points = [...volume_envelope_points];
        this.panning_envelope_points = [...panning_envelope_points];
        this.num_volume_points = buffer.readUInt8(225);
        this.num_panning_points = buffer.readUInt8(226);
        this.volume_sustain_point = buffer.readUInt8(227);
        this.volume_loop_start_point = buffer.readUInt8(228);
        this.volume_loop_end_point = buffer.readUInt8(229);
        this.panning_sustain_point = buffer.readUInt8(230);
        this.panning_loop_start_point = buffer.readUInt8(231);
        this.panning_loop_end_point = buffer.readUInt8(232);
        this.volume_type = buffer.readUInt8(233);
        this.panning_type = buffer.readUInt8(234);
        this.vibrato_type = buffer.readUInt8(235);
        this.vibrato_sweep = buffer.readUInt8(236);
        this.vibrato_depth = buffer.readUInt8(237);
        this.vibrato_rate = buffer.readUInt8(238);
        this.volume_fadeout = buffer.readUInt16LE(239);
        this.reserved = buffer.readUInt16LE(241)

        let position = this.header_size;
        for (let i = 0; i < this.num_samples; i++) {
            const data = buffer.slice(position);
            const sample_header = new SampleHeader(data);

            this.sample_headers.push(sample_header)
            position += sample_header.size;
        }
    }

    get size() {
        if (this.num_samples === 0) {
            return this.header_size;
        }

        const headers_total = this.num_samples * this.sample_header_size;
        const samples_total = this.sample_headers.reduce((sum, header) => sum += header.length, 0);

        return this.header_size + headers_total + samples_total;
    }
}

module.exports = Instrument;
