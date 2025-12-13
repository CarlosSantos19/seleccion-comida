// Variables globales
let apuestas = {};
let resultadoSeleccionado = '';

// Elementos del DOM
const apostadorInput = document.getElementById('apostadorInput');
const golesJunior = document.getElementById('golesJunior');
const golesTolima = document.getElementById('golesTolima');
const montoApuesta = document.getElementById('montoApuesta');
const btnSave = document.getElementById('btnSave');
const btnReset = document.getElementById('btnReset');
const btnExport = document.getElementById('btnExport');
const btnExportCSV = document.getElementById('btnExportCSV');
const summaryTable = document.getElementById('summaryTable');
const resultadoBtns = document.querySelectorAll('.resultado-btn');

// Elementos de estadísticas
const totalApuestas = document.getElementById('totalApuestas');
const totalDinero = document.getElementById('totalDinero');
const apuestasJunior = document.getElementById('apuestasJunior');
const apuestasTolima = document.getElementById('apuestasTolima');

// Referencia a Firebase
const apuestasRef = database.ref('apuestas');

// Inicializar aplicación
function init() {
    cargarDatosFirebase();
    escucharCambiosFirebase();
    configurarEventos();
}

// Cargar datos desde Firebase
function cargarDatosFirebase() {
    apuestasRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            apuestas = data;
            actualizarResumen();
        }
    });
}

// Escuchar cambios en tiempo real desde Firebase
function escucharCambiosFirebase() {
    apuestasRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            apuestas = data;
            actualizarResumen();
        } else {
            apuestas = {};
            actualizarResumen();
        }
    });
}

// Configurar eventos
function configurarEventos() {
    // Botones de resultado
    resultadoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            resultadoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            resultadoSeleccionado = btn.dataset.resultado;
        });
    });

    // Botón guardar
    btnSave.addEventListener('click', guardarApuesta);

    // Botón reset
    btnReset.addEventListener('click', limpiarFormulario);

    // Botón exportar CSV
    btnExportCSV.addEventListener('click', exportarAExcel);

    // Botón exportar PDF
    btnExport.addEventListener('click', exportarAPDF);
}

// Guardar apuesta
function guardarApuesta() {
    const apostador = apostadorInput.value.trim();
    const monto = parseInt(montoApuesta.value);
    const golesJ = parseInt(golesJunior.value);
    const golesT = parseInt(golesTolima.value);

    // Validaciones
    if (!apostador) {
        alert('Por favor ingrese el nombre del apostador');
        apostadorInput.focus();
        return;
    }

    if (!resultadoSeleccionado) {
        alert('Por favor seleccione un resultado (¿Quién ganará?)');
        return;
    }

    if (!monto || monto <= 0) {
        alert('Por favor ingrese un monto válido');
        montoApuesta.focus();
        return;
    }

    // Crear objeto de apuesta
    const apuesta = {
        apostador: apostador,
        resultado: resultadoSeleccionado,
        golesJunior: golesJ,
        golesTolima: golesT,
        marcador: `${golesJ} - ${golesT}`,
        monto: monto,
        fecha: new Date().toISOString()
    };

    // Guardar apuesta en Firebase
    apuestasRef.child(apostador).set(apuesta)
        .then(() => {
            alert('¡Apuesta registrada exitosamente!');
            limpiarFormulario();
        })
        .catch((error) => {
            console.error('Error al guardar:', error);
            alert('Error al guardar la apuesta. Por favor intente nuevamente.');
        });
}

// Limpiar formulario
function limpiarFormulario() {
    apostadorInput.value = '';
    golesJunior.value = 0;
    golesTolima.value = 0;
    montoApuesta.value = '';
    resultadoSeleccionado = '';
    resultadoBtns.forEach(btn => btn.classList.remove('active'));
    apostadorInput.focus();
}

// Actualizar resumen
function actualizarResumen() {
    const apuestasArray = Object.values(apuestas);

    if (apuestasArray.length === 0) {
        summaryTable.innerHTML = '<div class="empty-message">No hay apuestas registradas todavía</div>';
        actualizarEstadisticas(0, 0, 0, 0);
        return;
    }

    // Calcular estadísticas
    let totalMonto = 0;
    let countJunior = 0;
    let countTolima = 0;
    let countEmpate = 0;

    apuestasArray.forEach(apuesta => {
        totalMonto += apuesta.monto;
        if (apuesta.resultado === 'junior') countJunior++;
        if (apuesta.resultado === 'tolima') countTolima++;
        if (apuesta.resultado === 'empate') countEmpate++;
    });

    actualizarEstadisticas(apuestasArray.length, totalMonto, countJunior, countTolima);

    // Crear tabla
    let html = '<table>';
    html += '<thead><tr>';
    html += '<th>Apostador</th>';
    html += '<th>Resultado</th>';
    html += '<th>Marcador</th>';
    html += '<th>Monto</th>';
    html += '<th>Acciones</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    Object.keys(apuestas).sort().forEach(apostador => {
        const apuesta = apuestas[apostador];
        const resultadoTexto = apuesta.resultado === 'junior' ? 'Gana Junior' :
                              apuesta.resultado === 'tolima' ? 'Gana Tolima' : 'Empate';

        html += '<tr>';
        html += `<td><strong>${apuesta.apostador}</strong></td>`;
        html += `<td><span class="resultado-badge ${apuesta.resultado}">${resultadoTexto}</span></td>`;
        html += `<td><strong>${apuesta.marcador}</strong></td>`;
        html += `<td><strong>$${apuesta.monto.toLocaleString('es-CO')}</strong></td>`;
        html += `<td>
            <button class="action-btn edit-btn" onclick="editarApuesta('${apostador}')">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="action-btn delete-btn" onclick="eliminarApuesta('${apostador}')">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </td>`;
        html += '</tr>';
    });

    // Fila de totales
    html += '<tr>';
    html += '<td colspan="3"><strong>TOTAL</strong></td>';
    html += `<td><strong>$${totalMonto.toLocaleString('es-CO')}</strong></td>`;
    html += '<td>-</td>';
    html += '</tr>';

    html += '</tbody></table>';
    summaryTable.innerHTML = html;
}

// Actualizar estadísticas
function actualizarEstadisticas(total, dinero, junior, tolima) {
    totalApuestas.textContent = total;
    totalDinero.textContent = `$${dinero.toLocaleString('es-CO')}`;
    apuestasJunior.textContent = junior;
    apuestasTolima.textContent = tolima;
}

// Editar apuesta
function editarApuesta(apostador) {
    const apuesta = apuestas[apostador];

    apostadorInput.value = apuesta.apostador;
    golesJunior.value = apuesta.golesJunior;
    golesTolima.value = apuesta.golesTolima;
    montoApuesta.value = apuesta.monto;

    resultadoSeleccionado = apuesta.resultado;
    resultadoBtns.forEach(btn => {
        if (btn.dataset.resultado === apuesta.resultado) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminar apuesta
function eliminarApuesta(apostador) {
    if (confirm(`¿Está seguro de eliminar la apuesta de ${apostador}?`)) {
        apuestasRef.child(apostador).remove()
            .then(() => {
                console.log('Apuesta eliminada exitosamente');
            })
            .catch((error) => {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar la apuesta. Por favor intente nuevamente.');
            });
    }
}

// Exportar a Excel (XLSX)
function exportarAExcel() {
    if (Object.keys(apuestas).length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const wb = XLSX.utils.book_new();
    const data = [];

    // Headers
    const headers = ['Apostador', 'Resultado', 'Marcador', 'Goles Junior', 'Goles Tolima', 'Monto'];
    data.push(headers);

    // Datos
    let totalMonto = 0;
    Object.keys(apuestas).sort().forEach(apostador => {
        const apuesta = apuestas[apostador];
        const resultadoTexto = apuesta.resultado === 'junior' ? 'Gana Junior' :
                              apuesta.resultado === 'tolima' ? 'Gana Tolima' : 'Empate';

        const row = [
            apuesta.apostador,
            resultadoTexto,
            apuesta.marcador,
            apuesta.golesJunior,
            apuesta.golesTolima,
            apuesta.monto
        ];
        data.push(row);
        totalMonto += apuesta.monto;
    });

    // Fila de totales
    data.push(['TOTAL', '', '', '', '', totalMonto]);

    // Crear hoja
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Configurar anchos
    ws['!cols'] = [
        { wch: 30 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Apuestas Junior vs Tolima');
    XLSX.writeFile(wb, `apuestas_junior_tolima_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Exportar a PDF
function exportarAPDF() {
    if (Object.keys(apuestas).length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Colores
    const primaryColor = [30, 60, 114];
    const secondaryColor = [126, 34, 206];

    // Título
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('Apuestas Final', 105, 20, { align: 'center' });

    doc.setFontSize(20);
    doc.text('JUNIOR vs TOLIMA', 105, 32, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, 105, 42, { align: 'center' });

    // Preparar datos
    const headers = [['Apostador', 'Resultado', 'Marcador', 'Monto']];
    const data = [];
    let totalMonto = 0;

    Object.keys(apuestas).sort().forEach(apostador => {
        const apuesta = apuestas[apostador];
        const resultadoTexto = apuesta.resultado === 'junior' ? 'Gana Junior' :
                              apuesta.resultado === 'tolima' ? 'Gana Tolima' : 'Empate';

        const row = [
            apuesta.apostador,
            resultadoTexto,
            apuesta.marcador,
            `$${apuesta.monto.toLocaleString('es-CO')}`
        ];
        data.push(row);
        totalMonto += apuesta.monto;
    });

    // Fila de totales
    data.push(['TOTAL', '', '', `$${totalMonto.toLocaleString('es-CO')}`]);

    // Crear tabla
    doc.autoTable({
        head: headers,
        body: data,
        startY: 55,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 11
        },
        bodyStyles: {
            fontSize: 10,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { halign: 'left', fontStyle: 'bold', cellWidth: 60 },
            3: { halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: function(data) {
            if (data.row.index === data.table.body.length - 1) {
                data.cell.styles.fillColor = [240, 240, 240];
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.textColor = [0, 0, 0];
            }
        },
        didDrawPage: function() {
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Página ${doc.internal.getCurrentPageInfo().pageNumber}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
    });

    // Estadísticas
    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen Estadístico:', 14, finalY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    const apuestasArray = Object.values(apuestas);
    const countJunior = apuestasArray.filter(a => a.resultado === 'junior').length;
    const countTolima = apuestasArray.filter(a => a.resultado === 'tolima').length;
    const countEmpate = apuestasArray.filter(a => a.resultado === 'empate').length;

    doc.text(`Total de apuestas: ${apuestasArray.length}`, 14, finalY + 8);
    doc.text(`Total apostado: $${totalMonto.toLocaleString('es-CO')}`, 14, finalY + 15);
    doc.text(`Apuestan por Junior: ${countJunior}`, 14, finalY + 22);
    doc.text(`Apuestan por Tolima: ${countTolima}`, 14, finalY + 29);
    doc.text(`Apuestan por Empate: ${countEmpate}`, 14, finalY + 36);

    doc.save(`apuestas_junior_tolima_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Hacer funciones accesibles globalmente
window.editarApuesta = editarApuesta;
window.eliminarApuesta = eliminarApuesta;

// Inicializar
document.addEventListener('DOMContentLoaded', init);
