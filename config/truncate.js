const removeNumberedPrefixes = (inputText) => {
    // Regular expression to match a number followed by a period, a space, or a closing parenthesis
    const regex = /^\s*\d+[\.\s\)]+/gm;
    const outputText = inputText.replace(regex, '');
    return outputText;
}

module.exports = { removeNumberedPrefixes }
