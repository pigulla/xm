module.exports.buffer_to_string = function buffer_to_string(buffer, start, length) {
    return buffer.toString('ascii', start, start + length).replace(/(\0)+$/, '');
};
