// Lista de funcionarios
const FUNCIONARIOS = [
    "ALFREDO CORCHO PARRA",
    "ANDREA MARCELA VILLA MOSQUERA",
    "ANGELA CRISTINA PARRA PABON",
    "ANGIE NATALIA ANTONIO MURCIA",
    "ARELIS DE LA CRUZ LEON ACOSTA",
    "BETTY ALVARADO VASQUEZ",
    "CARLOS HORACIO SIERRA HERRERA",
    "DAISY CECILIA CENDALES SANCHEZ",
    "DARCIS BARRAGAN GALEANO",
    "FERNANDO OVALLE BOLIVAR",
    "GIOMAR BETTINA GRANADOS VERA",
    "GLORIA ESPERANZA PINILLA MURILLO",
    "HENRY OSWALDO AMAYA PAEZ",
    "IVAN FERNANDO VILLANUEVA AYURE",
    "JOSE YERSON CAMPO CAMPO",
    "JUAN PABLO RAMIREZ GARCIA",
    "MARIA FERNANDA ESQU IVIA PAIPA",
    "MILQUIADES GARAVITO RODRIGUEZ",
    "MIRYAM JOHANA CABEZAS GUTIERREZ",
    "OSCAR JAVIER RODRIGUEZ BERNATE",
    "OSCAR LUIS LEONES ARIAS",
    "RICARDO BENITO RODRIGUEZ ROSALES",
    "RUTH YIBETH ALVAREZ BORDA",
    "SAUL BETANCUR TORO",
    "SOLMAR EDIR GOMEZ TELLEZ",
    "VANESSA FABIOLA MARTELO GRACIA",
    "VICTOR MANUEL OSTOS LEON",
    "WALDIR ENRIQUE PERTUZ LOBO",
    "YAMILE DIAZ RUBIO",
    "YURY KARINE ORTIZ BONILLA",
    "FABIAN ARLEY TAVERA ZARATE",
    "DAYAN LORENA TORRES",
    "MARIO ALEJANDRO HERNANDEZ CRUZ",
    "LUIS HERNANDO OTALORA",
    "GLORIA ESTELLA OVIEDO TORRES",
    "JHONNY ALEXANDER FRACICA PIRABAN",
    "MAYRA ALEJANDRA RODRIGUEZ REAL",
    "ROSMIRA ROSA ROSARIO RUIZ",
    "ANA MARIA AGUIRRE",
    "SANDRA MARCELA RUBIO QUIBANO",
    "PAOLA DEL PILAR GASCA CARDOSO",
    "FABIAN MELO GORDILLO",
    "MARTHA ISABEL DOMINGUEZ",
    "DANIELA ALEJANDRA URREA CARDENAS",
    "GIOVANNY FLOREZ CHAPARRO"
];

// Lista de alimentos
const ALIMENTOS = [
    { id: 'carimanola', nombre: 'Carimañola' },
    { id: 'tamal', nombre: 'Tamal' },
    { id: 'arepa_huevo', nombre: "Arepa E'huevo" },
    { id: 'rosquete', nombre: 'Rosquete de queso' },
    { id: 'patacones', nombre: 'Patacones en matrimonio' },
    { id: 'kibbeh', nombre: 'Kibbeh' },
    { id: 'arepa_quesuda', nombre: 'Arepa frita quesuda' },
    { id: 'arepuela_dulce', nombre: 'Arepuela dulce de anís' },
    { id: 'arepuela_huevo', nombre: "Arepuela e'huevo" }
];

// Variables globales
let selecciones = JSON.parse(localStorage.getItem('selecciones')) || {};
let funcionarioActual = '';

// Elementos del DOM
const funcionarioSelect = document.getElementById('funcionarioSelect');
const foodCounters = document.getElementById('foodCounters');
const btnSave = document.getElementById('btnSave');
const btnReset = document.getElementById('btnReset');
const btnExport = document.getElementById('btnExport');
const btnClearAll = document.getElementById('btnClearAll');
const summaryTable = document.getElementById('summaryTable');

// Inicializar aplicación
function init() {
    cargarFuncionarios();
    configurarEventos();
    actualizarResumen();
}

// Cargar funcionarios en el select
function cargarFuncionarios() {
    FUNCIONARIOS.sort().forEach(funcionario => {
        const option = document.createElement('option');
        option.value = funcionario;
        option.textContent = funcionario;
        funcionarioSelect.appendChild(option);
    });
}

// Configurar eventos
function configurarEventos() {
    // Cambio de funcionario
    funcionarioSelect.addEventListener('change', (e) => {
        funcionarioActual = e.target.value;
        if (funcionarioActual) {
            foodCounters.classList.add('active');
            cargarSeleccionFuncionario();
        } else {
            foodCounters.classList.remove('active');
        }
    });

    // Botones de incrementar/decrementar
    document.querySelectorAll('.btn-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const food = e.target.dataset.food;
            cambiarContador(food, 1);
        });
    });

    document.querySelectorAll('.btn-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const food = e.target.dataset.food;
            cambiarContador(food, -1);
        });
    });

    // Botón guardar
    btnSave.addEventListener('click', guardarSeleccion);

    // Botón reset
    btnReset.addEventListener('click', limpiarContadores);

    // Botón exportar
    btnExport.addEventListener('click', exportarAExcel);

    // Botón limpiar todo
    btnClearAll.addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea eliminar todas las selecciones?')) {
            selecciones = {};
            localStorage.removeItem('selecciones');
            actualizarResumen();
            limpiarContadores();
        }
    });
}

// Cambiar contador
function cambiarContador(food, delta) {
    const countElement = document.getElementById(`count-${food}`);
    let currentValue = parseInt(countElement.textContent);
    currentValue = Math.max(0, currentValue + delta);
    countElement.textContent = currentValue;
}

// Cargar selección del funcionario
function cargarSeleccionFuncionario() {
    limpiarContadores();

    if (selecciones[funcionarioActual]) {
        const seleccion = selecciones[funcionarioActual];
        ALIMENTOS.forEach(alimento => {
            const count = seleccion[alimento.id] || 0;
            document.getElementById(`count-${alimento.id}`).textContent = count;
        });
    }
}

// Limpiar contadores
function limpiarContadores() {
    ALIMENTOS.forEach(alimento => {
        document.getElementById(`count-${alimento.id}`).textContent = '0';
    });
}

// Guardar selección
function guardarSeleccion() {
    if (!funcionarioActual) {
        alert('Por favor seleccione un funcionario');
        return;
    }

    const seleccion = {};
    let haySeleccion = false;

    ALIMENTOS.forEach(alimento => {
        const count = parseInt(document.getElementById(`count-${alimento.id}`).textContent);
        if (count > 0) {
            seleccion[alimento.id] = count;
            haySeleccion = true;
        }
    });

    if (!haySeleccion) {
        alert('Por favor seleccione al menos un alimento');
        return;
    }

    selecciones[funcionarioActual] = seleccion;
    localStorage.setItem('selecciones', JSON.stringify(selecciones));

    alert('Selección guardada exitosamente');
    actualizarResumen();

    // Limpiar y resetear
    funcionarioSelect.value = '';
    funcionarioActual = '';
    foodCounters.classList.remove('active');
    limpiarContadores();
}

// Actualizar resumen
function actualizarResumen() {
    if (Object.keys(selecciones).length === 0) {
        summaryTable.innerHTML = '<div class="empty-message">No hay selecciones registradas</div>';
        return;
    }

    let html = '<table><thead><tr>';
    html += '<th>Funcionario</th>';
    ALIMENTOS.forEach(alimento => {
        html += `<th>${alimento.nombre}</th>`;
    });
    html += '<th>Total</th>';
    html += '<th>Acción</th>';
    html += '</tr></thead><tbody>';

    Object.keys(selecciones).sort().forEach(funcionario => {
        const seleccion = selecciones[funcionario];
        let total = 0;

        html += '<tr>';
        html += `<td><strong>${funcionario}</strong></td>`;

        ALIMENTOS.forEach(alimento => {
            const cantidad = seleccion[alimento.id] || 0;
            total += cantidad;
            html += `<td>${cantidad || '-'}</td>`;
        });

        html += `<td><strong>${total}</strong></td>`;
        html += `<td><button class="delete-btn" onclick="eliminarSeleccion('${funcionario}')">Eliminar</button></td>`;
        html += '</tr>';
    });

    // Fila de totales
    html += '<tr style="background: #f0f0f0; font-weight: bold;">';
    html += '<td>TOTALES</td>';

    ALIMENTOS.forEach(alimento => {
        let totalAlimento = 0;
        Object.values(selecciones).forEach(seleccion => {
            totalAlimento += seleccion[alimento.id] || 0;
        });
        html += `<td>${totalAlimento}</td>`;
    });

    let granTotal = 0;
    Object.values(selecciones).forEach(seleccion => {
        Object.values(seleccion).forEach(cantidad => {
            granTotal += cantidad;
        });
    });
    html += `<td>${granTotal}</td>`;
    html += '<td>-</td>';
    html += '</tr>';

    html += '</tbody></table>';
    summaryTable.innerHTML = html;
}

// Eliminar selección
function eliminarSeleccion(funcionario) {
    if (confirm(`¿Está seguro de eliminar la selección de ${funcionario}?`)) {
        delete selecciones[funcionario];
        localStorage.setItem('selecciones', JSON.stringify(selecciones));
        actualizarResumen();
    }
}

// Exportar a Excel (CSV)
function exportarAExcel() {
    if (Object.keys(selecciones).length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    let csv = 'Funcionario,';
    csv += ALIMENTOS.map(a => a.nombre).join(',');
    csv += ',Total\n';

    Object.keys(selecciones).sort().forEach(funcionario => {
        const seleccion = selecciones[funcionario];
        let total = 0;

        csv += `"${funcionario}",`;

        ALIMENTOS.forEach(alimento => {
            const cantidad = seleccion[alimento.id] || 0;
            total += cantidad;
            csv += `${cantidad},`;
        });

        csv += `${total}\n`;
    });

    // Fila de totales
    csv += 'TOTALES,';
    ALIMENTOS.forEach(alimento => {
        let totalAlimento = 0;
        Object.values(selecciones).forEach(seleccion => {
            totalAlimento += seleccion[alimento.id] || 0;
        });
        csv += `${totalAlimento},`;
    });

    let granTotal = 0;
    Object.values(selecciones).forEach(seleccion => {
        Object.values(seleccion).forEach(cantidad => {
            granTotal += cantidad;
        });
    });
    csv += `${granTotal}\n`;

    // Descargar archivo
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `seleccion_comidas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
