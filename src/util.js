module.exports.buffer_to_byte_array = function buffer_to_byte_array(buffer) {
    const result = new Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i];
    }

    return result;
};

module.exports.buffer_to_string = function buffer_to_string(buffer, start, length) {
    return buffer.toString('ascii', start, start + length).replace(/(\0)+$/, '');
};
