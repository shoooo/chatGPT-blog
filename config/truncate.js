const removeNumberedPrefixes = (inputText) => {
    // Regular expression to match a number followed by a period, a space, or a closing parenthesis
    const outputText = inputText.replace(/^\s*\d+[\.\s\)]+/gm, '');
    return outputText;
}

module.exports = { removeNumberedPrefixes }
