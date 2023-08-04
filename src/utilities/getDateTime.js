function getDateTime() {
    const dataAtual = new Date();

    const year = dataAtual.getFullYear();
    const month = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const day = String(dataAtual.getDate()).padStart(2, '0');
    const hours = String(dataAtual.getHours()).padStart(2, '0');
    const minutes = String(dataAtual.getMinutes()).padStart(2, '0');
    const seconds = String(dataAtual.getSeconds()).padStart(2, '0');

    const dateTimeFormatted = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return dateTimeFormatted
}

module.exports = { getDateTime }