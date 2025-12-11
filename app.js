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
const btnExportCSV = document.getElementById('btnExportCSV');
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

    // Botón exportar CSV
    btnExportCSV.addEventListener('click', exportarAExcel);

    // Botón exportar PDF
    btnExport.addEventListener('click', exportarAPDF);

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

// Exportar a PDF
function exportarAPDF() {
    if (Object.keys(selecciones).length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores
    const primaryColor = [102, 126, 234]; // #667eea
    const secondaryColor = [118, 75, 162]; // #764ba2

    // Título
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Selección de Comida', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, 105, 30, { align: 'center' });

    // Preparar datos para la tabla
    const headers = [['Funcionario', ...ALIMENTOS.map(a => a.nombre), 'Total']];
    const data = [];

    // Agregar datos de cada funcionario
    Object.keys(selecciones).sort().forEach(funcionario => {
        const seleccion = selecciones[funcionario];
        let total = 0;
        const row = [funcionario];

        ALIMENTOS.forEach(alimento => {
            const cantidad = seleccion[alimento.id] || 0;
            total += cantidad;
            row.push(cantidad || '-');
        });

        row.push(total);
        data.push(row);
    });

    // Fila de totales
    const totalesRow = ['TOTALES'];
    ALIMENTOS.forEach(alimento => {
        let totalAlimento = 0;
        Object.values(selecciones).forEach(seleccion => {
            totalAlimento += seleccion[alimento.id] || 0;
        });
        totalesRow.push(totalAlimento);
    });

    let granTotal = 0;
    Object.values(selecciones).forEach(seleccion => {
        Object.values(seleccion).forEach(cantidad => {
            granTotal += cantidad;
        });
    });
    totalesRow.push(granTotal);
    data.push(totalesRow);

    // Crear tabla con autoTable
    doc.autoTable({
        head: headers,
        body: data,
        startY: 45,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
        },
        bodyStyles: {
            fontSize: 8,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { halign: 'left', fontStyle: 'bold', cellWidth: 45 }
        },
        footStyles: {
            fillColor: secondaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        didDrawPage: function() {
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Página ${doc.internal.getCurrentPageInfo().pageNumber}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        },
        // Destacar la última fila (totales)
        didParseCell: function(data) {
            if (data.row.index === data.table.body.length - 1) {
                data.cell.styles.fillColor = [240, 240, 240];
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.textColor = [0, 0, 0];
            }
        }
    });

    // Agregar estadísticas adicionales
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen:', 14, finalY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`Total de funcionarios: ${Object.keys(selecciones).length}`, 14, finalY + 7);
    doc.text(`Total de alimentos: ${granTotal}`, 14, finalY + 14);
    doc.text(`Promedio por funcionario: ${(granTotal / Object.keys(selecciones).length).toFixed(2)}`, 14, finalY + 21);

    // Guardar PDF
    doc.save(`seleccion_comidas_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
