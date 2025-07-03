document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на элементы DOM
    const k1Input = document.getElementById('k1');
    const k2Input = document.getElementById('k2');
    const s1Input = document.getElementById('s1');
    const s2Input = document.getElementById('s2');
    const c1Select = document.getElementById('c1');
    const c2Select = document.getElementById('c2');
    const c3Select = document.getElementById('c3');
    const p1Span = document.getElementById('p1');
    const p2Span = document.getElementById('p2');
    const totalSumSpan = document.getElementById('totalSum');
    const resultSpan = document.getElementById('result');
    const exchangeRateValueSpan = document.getElementById('exchangeRateValue');
    const curLabel1 = document.getElementById('cur_label_1');
    const curLabel2 = document.getElementById('cur_label_2');

    // Инициализация переменных
    let koefRes = 1;
    let isCurrency1RUB = true;
    let isCurrency2RUB = true;
    let isCurrency3RUB = true;
    let koefNaSum_1 = 0;
    let koefNaSum_2 = 0;
    let exchangeRate = 1;
    let s1Input_2 = 0;
    let s2Input_2 = 0;

    // Добавление слушателей событий для полей ввода и выпадающих списков
    k1Input.addEventListener('input', calculate);
    k2Input.addEventListener('input', calculate);
    s1Input.addEventListener('input', calculateSum);
    c1Select.addEventListener('change', updateCurrency1);
    c2Select.addEventListener('change', updateCurrency2);
    c3Select.addEventListener('change', updateCurrency3);

    // Функция для преобразования строки в число, заменяя запятую на точку
    function parseInputValue(value) {
        return parseFloat(value.replace(',', '.'));
    }

    // Функция для расчета коэффициента
    function calculate() {
        const k1 = parseInputValue(k1Input.value);
        const k2 = parseInputValue(k2Input.value);

        if (!isNaN(k1) && !isNaN(k2) && k1 !== 0) {
            koefRes = k2 / k1;
        } else {
            koefRes = 1;
        }
        calculateSum(); // Вызов функции для расчета суммы
    }

    // Функция для расчета сумм и обновления значений
    function calculateSum() {
        const s1 = parseInputValue(s1Input.value);
        const k1 = parseInputValue(k1Input.value);
        const k2 = parseInputValue(k2Input.value);

        if (!isNaN(s1) && koefRes !== 0) {
            // Устанавливаем значения в зависимости от выбранной валюты
            s1Input_2 = isCurrency1RUB ? s1 : s1 * exchangeRate;

            // Вычисляем s2
            let s2 = s1Input_2 / koefRes;

            // Проверяем выбор валюты для s2
            s2Input_2 = isCurrency2RUB ? s2 : s2 / exchangeRate;

            // Устанавливаем значение в поле s2 в зависимости от выбранной валюты
            s2Input.value = isCurrency2RUB ? Math.round(s2Input_2) : s2Input_2.toFixed(2);

            koefNaSum_1 = k1 * s1Input_2;
            koefNaSum_2 = k2 * s2Input_2;

            updatePlusValues(); // Обновляем значения plus
        } else {
            // Сброс значений при некорректном вводе
            s2Input.value = '0';
            p1Span.textContent = '0';
            p2Span.textContent = '0';
            totalSumSpan.textContent = '0';
            resultSpan.textContent = '0 %';
            koefNaSum_1 = 0;
            koefNaSum_2 = 0;
        }
    }

    // Функция для обновления значений plus
    function updatePlusValues() {
        const s1 = parseInputValue(s1Input.value);
        const s2 = parseInputValue(s2Input.value);

        let plus1 = koefNaSum_1 - s1Input_2 - s2Input_2;
        let plus2 = koefNaSum_2 - s1Input_2 - s2Input_2;

        // Обновляем отображение значений plus в зависимости от выбранной валюты
        if (!isCurrency1RUB) {
            p1Span.textContent = plus1.toFixed(2);
        } else {
            p1Span.textContent = Math.round(plus1);
        }

        if (!isCurrency2RUB) {
            p2Span.textContent = plus2.toFixed(2);
        } else {
            p2Span.textContent = Math.round(plus2);
        }

        // Рассчитываем общую сумму в зависимости от выбранной валюты в c3
        let totalSum;
        if (isCurrency3RUB) {
            totalSum = s1Input_2 + s2Input_2;
            totalSumSpan.textContent = Math.round(totalSum);
        } else {
            totalSum = (s1Input_2 + s2Input_2) / exchangeRate;
            totalSumSpan.textContent = totalSum.toFixed(2);
        }

        const result = (Math.round(plus1) * 100) / (s1 + s2);
        resultSpan.textContent = result.toFixed(2) + ' %';
    }

    // Функция для обновления валюты первого исхода
    function updateCurrency1() {
        isCurrency1RUB = c1Select.value === 'RUB';
        curLabel1.textContent = isCurrency1RUB ? 'rub' : 'usd';
        s1Input_2 = isCurrency1RUB ? parseInputValue(s1Input.value) : parseInputValue(s1Input.value) * exchangeRate;
        calculateSum();
    }

    // Функция для обновления валюты второго исхода
    function updateCurrency2() {
        isCurrency2RUB = c2Select.value === 'RUB';
        curLabel2.textContent = isCurrency2RUB ? 'rub' : 'usd';
        calculateSum();
    }

    // Функция для обновления валюты общей суммы
    function updateCurrency3() {
        isCurrency3RUB = c3Select.value === 'RUB';
        updatePlusValues();
    }

    // Функция для получения текущего курса доллара
    function fetchExchangeRate() {
        const url = `https://www.cbr-xml-daily.ru/daily.xml`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                const usdNode = xmlDoc.querySelector("Valute[ID='R01235'] Value");
                if (usdNode) {
                    exchangeRate = parseFloat(usdNode.textContent.replace(',', '.'));
                    exchangeRateValueSpan.textContent = exchangeRate.toFixed(2);
                    calculateSum();
                }
            }
        };
        xhr.send();
    }

    // Вызов функции для получения курса доллара при загрузке страницы
    fetchExchangeRate();
});
