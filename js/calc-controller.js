import { calcService } from './services/calc-service.js'

export const calcController = {
    initCurrs,
    onRenderCurrs,
    renderCurrs,
    onConvert,
    convert,
}

function initCurrs() {
    // console.log('%cinit', 'background:orange; color: blue;');
    Promise.resolve(onRenderCurrs())
        .then(onConvert)
}

function onRenderCurrs() {
    calcService.getCurrsToRender()
        .then(renderCurrs)
}

function renderCurrs(currs) {
    const strHTMLs = currs.map((curr) =>
        `<option value="${curr}">${curr}</option>`)
    const elfromCurr = document.querySelector('.from-curr');
    const eltoCurr = document.querySelector('.to-curr')
    elfromCurr.innerHTML = strHTMLs.join('');
    eltoCurr.innerHTML = strHTMLs.join('');
    elfromCurr.value = 'USD';
    eltoCurr.value = 'ILS';
}

function onConvert() {
    calcService.getRates()
        .then(convert)
}

function convert(carrs) {
    var amount = +document.querySelector('.amount').value
    var fromCurr = document.querySelector('.from-curr').value
    var toCurr = document.querySelector('.to-curr').value
    var elOutput = document.querySelector('.culc-output.culc-field')
    calcService.calcRates(amount, fromCurr, toCurr, carrs)
        .then(rates => elOutput.innerText = rates)
}

