const { buffer_to_byte_array, buffer_to_string } = require('./util');
const SampleHeader = require('./SampleHeader');

class Instrument {
    toJSON() {
        const result = {
            header_size: this.header_size,
            name: this.name,
            type: this.type,
            num_samples: this.num_samples,
            sample_headers: this.sample_headers.map(header => header.toJSON()),
            sample_data: this.sample_data
        };

        if (this.num_samples > 0) {
            Object.assign(result, {
                sample_header_size: this.sample_header_size,
                sample_numbers: this.sample_numbers,
                volume_envelope_points: this.volume_envelope_points,
                panning_envelope_points: this.panning_envelope_points,
                num_volume_points: this.num_volume_points,
                num_panning_points: this.num_panning_points,
                volume_sustain_point: this.volume_sustain_point,
                volume_loop_start_point: this.volume_loop_start_point,
                volume_loop_end_point: this.volume_loop_end_point,
                panning_sustain_point: this.panning_sustain_point,
                panning_loop_start_point: this.panning_loop_start_point,
                panning_loop_end_point: this.panning_loop_end_point,
                volume_type: this.volume_type,
                panning_type: this.panning_type,
                vibrato_type: this.vibrato_type,
                vibrato_sweep: this.vibrato_sweep,
                vibrato_depth: this.vibrato_depth,
                vibrato_rate: this.vibrato_rate,
                volume_fadeout: this.volume_fadeout
            });
        }

        return result;
    }

    static from(buffer, position) {
        const instrument = new Instrument();
        const packed_size = buffer.readUInt16LE(position + 7);
        const patterndata = packed_size === 0 ? null : buffer.slice(position + 9, position + 9 + packed_size);
        const num_samples = buffer.readUInt16LE(position + 27);

        Object.assign(instrument, {
            header_size: buffer.readUInt32LE(position),
            name: buffer_to_string(buffer, position + 4, 22),
            type: buffer.readUInt8(position + 26),
            num_samples,
            sample_headers: [],
            sample_data: []
        });

        console.log(`  Instrument name is "${instrument.name}"`);
//        console.log(`  Instrument header size is ${instrument.header_size} bytes`);
//        console.log(`  Samples detected: ${num_samples}`);

        if (num_samples === 0) {
            return instrument;
        }

        const volume_envelope_points = buffer.slice(position + 129, position + 129 + 48);
        const panning_envelope_points = buffer.slice(position + 177, position + 177 + 48);
        const sample_numbers = buffer.slice(position + 33, position + 33 + 96);

        Object.assign(instrument, {
            sample_header_size: buffer.readUInt32LE(position + 29),
            sample_numbers: buffer_to_byte_array(sample_numbers),
            volume_envelope_points: buffer_to_byte_array(volume_envelope_points),
            panning_envelope_points: buffer_to_byte_array(panning_envelope_points),
            num_volume_points: buffer.readUInt8(position + 225),
            num_panning_points: buffer.readUInt8(position + 226),
            volume_sustain_point: buffer.readUInt8(position + 227),
            volume_loop_start_point: buffer.readUInt8(position + 228),
            volume_loop_end_point: buffer.readUInt8(position + 229),
            panning_sustain_point: buffer.readUInt8(position + 230),
            panning_loop_start_point: buffer.readUInt8(position + 231),
            panning_loop_end_point: buffer.readUInt8(position + 232),
            volume_type: buffer.readUInt8(position + 233),
            panning_type: buffer.readUInt8(position + 234),
            vibrato_type: buffer.readUInt8(position + 235),
            vibrato_sweep: buffer.readUInt8(position + 236),
            vibrato_depth: buffer.readUInt8(position + 237),
            vibrato_rate: buffer.readUInt8(position + 238),
            volume_fadeout: buffer.readUInt16LE(position + 239),
            reserved: buffer.readUInt16LE(position + 241)
        });

        position += instrument.header_size;
        for (let i = 0; i < num_samples; i++) {
//            console.log(`  Loading sample header #${i} from offset ${position}`);

            const sample_header = SampleHeader.from(buffer, position);
            instrument.sample_headers.push(sample_header)
//
//            console.log(`  Sample header size is ${sample_header.size} bytes`);
            position += sample_header.size;
        }

        return instrument;
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
