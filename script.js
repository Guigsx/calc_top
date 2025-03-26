document.addEventListener("DOMContentLoaded", function () {
    const inputDados = document.getElementById("inputDados")
    const btnRegistrar = document.getElementById("btnRegistrar")
    const listaOriginal = document.getElementById("listaOriginal")
    const listaOrdenada = document.getElementById("listaOrdenada")
    const resultados = document.getElementById("resultados")

    let valores = []

    function registrarValor() {
        const valor = inputDados.value.trim()
        if (valor === "" || isNaN(valor)) return

        valores.push(Number(valor))
        inputDados.value = ""
        inputDados.focus()
        atualizarResultados()
    }

    btnRegistrar.addEventListener("click", registrarValor)
    inputDados.addEventListener("keypress", (event) => {
        if (event.key === "Enter") registrarValor()
    })

    function calcularMedia(arr) {
        return (arr.reduce((acc, num) => acc + num, 0) / arr.length)
    }

    function calcularModa(arr) {
        const freq = {}
        let maxFreq = 0
        let modas = []

        arr.forEach(num => {
            freq[num] = (freq[num] || 0) + 1
            maxFreq = Math.max(maxFreq, freq[num])
        })

        for (let num in freq) {
            if (freq[num] === maxFreq) modas.push(`${num} [${freq[num]}]`)
        }

        return modas.length === arr.length ? "Sem moda" : modas.join(", ")
    }

    function calcularMediana(arr) {
        const sorted = [...arr].sort((a, b) => a - b)
        const meio = Math.floor(sorted.length / 2)
        return { sorted, mediana: sorted.length % 2 === 0 ? ((sorted[meio - 1] + sorted[meio]) / 2) : sorted[meio] }
    }

    function calcularDesvioPadrao(arr, populacional = true) {
        const media = calcularMedia(arr)
        const somaQuadrados = arr.reduce((acc, num) => acc + Math.pow(num - media, 2), 0)
        return Math.sqrt(somaQuadrados / (populacional ? arr.length : arr.length - 1))
    }

    function atualizarResultados() {
        if (valores.length === 0) {
            resultados.innerHTML = "<p>Adicione números para calcular.</p>"
            listaOriginal.innerHTML = ""
            listaOrdenada.innerHTML = ""
            return
        }

        const media = calcularMedia(valores)
        const moda = calcularModa(valores)
        const { sorted, mediana } = calcularMediana(valores)
        const somatorio = valores.reduce((acc, num) => acc + num, 0)
        const quantidadeItens = valores.length
        const desvioPadraoPopulacional = calcularDesvioPadrao(valores, true)
        const desvioPadraoAmostral = calcularDesvioPadrao(valores, false)

        listaOriginal.innerHTML = valores.map((num, index) => `<li data-index="${index}">${num}</li>`).join("")
        listaOrdenada.innerHTML = sorted.map(num => `<li>${num}</li>`).join("")

        resultados.innerHTML = `
            <p><strong>Média:</strong> ${media}</p>
            <p><strong>Moda:</strong> ${moda}</p>
            <p><strong>Mediana:</strong> ${mediana}</p>
            <p><strong>Somatório:</strong> ${somatorio}</p>
            <p><strong>Quantidade de Itens:</strong> ${quantidadeItens}</p>
            <p><strong>Desvio Padrão Populacional:</strong> ${desvioPadraoPopulacional}</p>
            <p><strong>Desvio Padrão Amostral:</strong> ${desvioPadraoAmostral}</p>
        `
    }

    // Permitir a remoção de números ao clicar na listaOriginal
    listaOriginal.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const index = event.target.getAttribute("data-index")
            valores.splice(index, 1)
            atualizarResultados()
        }
    })

    // Manipulação da reta de aproximação
    const inputX = document.getElementById("inputX")
    const inputY = document.getElementById("inputY")
    const btnAdicionar = document.getElementById("btnAdicionar")
    const listaPontos = document.getElementById("listaPontos")
    const resultadoReta = document.getElementById("resultadoReta")

    let pontos = []

    function adicionarPonto() {
        const x = parseFloat(inputX.value.trim())
        const y = parseFloat(inputY.value.trim())
        if (isNaN(x) || isNaN(y)) return

        pontos.push({ x, y })
        inputX.value = ""
        inputY.value = ""
        inputX.focus()
        atualizarLista()
        calcularReta()
    }

    function atualizarLista() {
        listaPontos.innerHTML = pontos.map((p, index) => `<li data-index="${index}">(${p.x}, ${p.y})</li>`).join("")
    }

    listaPontos.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const index = event.target.getAttribute("data-index")
            pontos.splice(index, 1)
            atualizarLista()
            calcularReta()
        }
    })

    function calcularReta() {
        if (pontos.length < 2) {
            resultadoReta.innerHTML = "Adicione pelo menos 2 pontos."
            return
        }

        const n = pontos.length
        let somaX = 0, somaY = 0, somaXY = 0, somaX2 = 0

        pontos.forEach(p => {
            somaX += p.x
            somaY += p.y
            somaXY += p.x * p.y
            somaX2 += p.x * p.x
        })

        const mediaX = somaX / n
        const mediaY = somaY / n
        const m = (somaXY - n * mediaX * mediaY) / (somaX2 - n * mediaX * mediaX)
        const b = mediaY - m * mediaX

        resultadoReta.innerHTML = `Equação da reta: y = ${m.toFixed(4)}x + ${b.toFixed(4)}`
    }

    btnAdicionar.addEventListener("click", adicionarPonto)
    inputX.addEventListener("keypress", (event) => { if (event.key === "Enter") inputY.focus() })
    inputY.addEventListener("keypress", (event) => { if (event.key === "Enter") adicionarPonto() })

    const inputX1 = document.getElementById("inputX1")
    const inputY1 = document.getElementById("inputY1")
    const inputX2 = document.getElementById("inputX2")
    const inputY2 = document.getElementById("inputY2")
    const btnCalcularReta = document.getElementById("btnCalcularReta")
    const resultadoReta2 = document.getElementById("resultadoReta2")

    function calcularRetaDoisPontos() {
        const x1 = parseFloat(inputX1.value.trim())
        const y1 = parseFloat(inputY1.value.trim())
        const x2 = parseFloat(inputX2.value.trim())
        const y2 = parseFloat(inputY2.value.trim())

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            resultadoReta2.innerHTML = "Por favor, insira as coordenadas corretamente."
            return
        }

        const m = (y2 - y1) / (x2 - x1)
        const b = y1 - m * x1

        resultadoReta2.innerHTML = `Equação da reta: y = ${m.toFixed(4)}x + ${b.toFixed(4)}`
    }

    btnCalcularReta.addEventListener("click", calcularRetaDoisPontos)
})