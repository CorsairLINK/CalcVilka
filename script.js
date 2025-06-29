document.addEventListener('DOMContentLoaded', function() {
    const k1Input = document.getElementById('k1');
    const k2Input = document.getElementById('k2');
    const s1Input = document.getElementById('s1');
    const s2Input = document.getElementById('s2');
    const c1Select = document.getElementById('c1');
    const c2Select = document.getElementById('c2');
    const p1Span = document.getElementById('p1');
    const p2Span = document.getElementById('p2');
    const totalSumSpan = document.getElementById('totalSum');
    const resultSpan = document.getElementById('result');

    let koefRes = 1;
    let isCurrency1RUB = true;
    let isCurrency2RUB = true;
    let koefNaSum_1 = 0;
    let koefNaSum_2 = 0;

    k1Input.addEventListener('input', calculate);
    k2Input.addEventListener('input', calculate);
    s1Input.addEventListener('input', calculateSum);
    c1Select.addEventListener('change', updateCurrency1);
    c2Select.addEventListener('change', updateCurrency2);

    function calculate() {
        const k1 = parseFloat(k1Input.value);
        const k2 = parseFloat(k2Input.value);

        if (!isNaN(k1) && !isNaN(k2) && k1 !== 0) {
            koefRes = k2 / k1;
            console.log('KoefRes:', koefRes);
        } else {
            koefRes = 1;
        }
        calculateSum();
    }

    function calculateSum() {
        const s1 = parseFloat(s1Input.value);
        const k1 = parseFloat(k1Input.value);
        const k2 = parseFloat(k2Input.value);

        if (!isNaN(s1) && koefRes !== 0) {
            const s2 = Math.round(s1 / koefRes);
            s2Input.value = s2;

            koefNaSum_1 = k1 * s1;
            koefNaSum_2 = k2 * s2;

            const plus = koefNaSum_1 - s1 - s2;

            p1Span.textContent = plus;
            p2Span.textContent = plus;

            const totalSum = s1 + s2;
            totalSumSpan.textContent = totalSum;

            const result = (plus * 100) / totalSum;
            resultSpan.textContent = result.toFixed(2) + ' %';

            console.log('KoefNaSum_1:', koefNaSum_1);
            console.log('KoefNaSum_2:', koefNaSum_2);
            console.log('Plus:', plus);
            console.log('Total Sum:', totalSum);
            console.log('Result:', result);
        } else {
            s2Input.value = '0';
            p1Span.textContent = '0';
            p2Span.textContent = '0';
            totalSumSpan.textContent = '0';
            resultSpan.textContent = '0 %';
            koefNaSum_1 = 0;
            koefNaSum_2 = 0;
        }
    }

    function updateCurrency1() {
        isCurrency1RUB = c1Select.value === 'RUB';
        console.log('Currency 1 is RUB:', isCurrency1RUB);
    }

    function updateCurrency2() {
        isCurrency2RUB = c2Select.value === 'RUB';
        console.log('Currency 2 is RUB:', isCurrency2RUB);
    }
});
