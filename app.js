// Lista de funcionarios
const FUNCIONARIOS = [
    "ADRIANA RAMIREZ",
    "ADRIANA MARCELA FORERO",
    "ALEXANDER VILLADIEGO VILLADIEGO",
    "ALFREDO CORCHO PARRA",
    "ALICIA CORDOBA BALSERA",
    "ANA CASTILLO SANCHEZ",
    "ANDREA LOPERA",
    "ANDREA MARCELA VILLA",
    "ANGELA CRISTINA PARRA PAVON",
    "ANGIE DANIELA BARRANTES VARON",
    "ANGIE NATALIA ANTONIO MURCIA",
    "ARELYS DE LA CRUZ LEON ACOSTA",
    "BETTY ALVARADO VASQUEZ",
    "BIBIANA CELY",
    "CARLOS ANDRES MORENO CRESPO",
    "CARLOS ANDRES SANTOS HERNANDEZ",
    "CARLOS ARTURO TAMAYO",
    "CARLOS HORACIO SIERRA HERRERA",
    "CLAUDIA PATRICIA GARCIA QUINTERO",
    "DAISY CECILIA CARDALES SANCHES",
    "DANIELA ALEJANDRA URETA CARDENAS",
    "DARCIS BARRAGAN GALEANO",
    "DAYAN LORENA TORRES CUCAITA",
    "DIANA PENA PARRA",
    "DIANA MILENA MUÑOZ PARRA",
    "DIONISIO RONDON SANCHEZ",
    "EDISON GOMEZ RUNZA",
    "ELSA ZABALA CORDOBA",
    "FABIAN MELO GORDILLO",
    "FABIAN ARLEY TAVERA ZARATE",
    "FERNANDO OVALLE BOLIVAR",
    "FREDY ALEXANDER CASTILLO ALFONSO",
    "GIOVANNY FLOREZ CHAPARRO",
    "GLORIA ESPERANZA PINILLA MURILLO",
    "GUIOMAR BETTINA GRANADOS VERA",
    "HENRY OSWALDO AMAYA PAEZ",
    "IVAN FERNANDO VILLANUEVA AYURE",
    "JAILTON JAVIER MENDEZ ROJAS",
    "JAIME LUIS SOLANO VASQUEZ",
    "JEIMY MOLANO",
    "JOHANA PAOLA PABON MIRANDA",
    "JOHN MAURICIO CARREÑO MORENO",
    "JONATHAN TAMAYO ALVAREZ",
    "JOSE YERSON CAMPO CAMPO",
    "JUAN PABLO RAMIREZ GARCIA",
    "JUAN PABLO ARIZA BARRERA",
    "KAROL VANNESA FORY MORENO",
    "KATERINE BALLESTEROS GUTIERREZ",
    "LEIDYS QUIROZ BEDOLLA",
    "LEZZY BONILLA GONZALEZ",
    "LILIAM ANDREA BARAJA MELO",
    "LILIANA BERNAL CORTES",
    "LOREN STHEFANNY MORENO CONTRERAS",
    "LUIS FERNANDO DITTA SANABRIA",
    "LUIS HERNANDO OTALORA",
    "LUIS MARIO HERNANDEZ",
    "LUIS SANTIAGO RODRIGUEZ",
    "LUZ ADRIANA VELAZQUEZ",
    "MARELIS FUENTES DE LA CRUZ",
    "MARIA FERNADA AGUIAR CARDONA",
    "MARIA FERNANDA ESQUINA PAIPA",
    "MARIBEL ROMERO",
    "MARIO ALEJANDRO HERNANDEZ CRUZ",
    "MARTHA LUCIA QUINTERO GARCIA",
    "MARTHA ISABEL DOMINGUEZ CASTILLO",
    "MAYRA ALEJANDRA GUARIN ARCILA",
    "MAYRA CRISTINA JIMENEZ OLARTE",
    "MIGUEL ANDRES DE HOYOS TOYO",
    "MILENA CONSTANZA MAYOR MONTES",
    "MILQUIADES GARAVITO RODRIGUEZ",
    "MIRYAM YOHANNA CABEZAS GUTIERREZ",
    "MONICA MARIA ROTILLE MARTINEZ",
    "OSCAR JAVIER RODRIGUEZ BERNATE",
    "OSCAR LUIS LEONES ARIAS",
    "PEDRO LUIS RODRIGUEZ RIOS",
    "RICARDO BENITO RODRIGUEZ ROSALES",
    "RUBIELA GARCIA VERA",
    "RUTH YIBETH ALVAREZ BORDA",
    "SANDRA MILENA GARAVITO MELO",
    "SANDRA PATRICIA VANEGAS GARZON",
    "SAUL BETANCUR TORO",
    "SOLMAR EDIR GOMEZ TELLEZ",
    "VALENTINA DORADO MUÑOZ",
    "VANESSA FABIOLA MARTELO GRACIA",
    "VICTOR MANUEL OSTOS LEON",
    "WALDIR ENRIQUE PERTUZ LOBO",
    "WILMER HERRERA BELEÑO",
    "YAHAIRA RANGEL PEÑARANDA",
    "YAMILE DIAZ RUBIO",
    "YEIMMY LORENA GOMEZ MARTIN",
    "YURY KARINE ORTIZ BONILLA",
    "ANA MARIA AGUIRRE",
    "GLORIA ESTELA OVIEDO",
    "MARITZA FERNANDA PATRICIA PIRABAN",
    "MAYRA ALEJANDRA RODRIGUEZ REAL",
    "PAOLA DEL PILAR GASCA",
    "ROSMIRA ROSA ROSANO RUIZ",
    "SANDRA MARCELA RUBIO CUBANO"
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
let selecciones = {};
let funcionarioActual = '';

// Elementos del DOM
const funcionarioSelect = document.getElementById('funcionarioSelect');
const foodCounters = document.getElementById('foodCounters');
const btnSave = document.getElementById('btnSave');
const btnReset = document.getElementById('btnReset');
const btnExport = document.getElementById('btnExport');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnBackup = document.getElementById('btnBackup');
const btnRestore = document.getElementById('btnRestore');
const fileInput = document.getElementById('fileInput');
const summaryTable = document.getElementById('summaryTable');

// Referencia a Firebase
const seleccionesRef = database.ref('selecciones');

// Inicializar aplicación
function init() {
    cargarFuncionarios();
    configurarEventos();
    cargarDatosFirebase();
    escucharCambiosFirebase();
}

// Cargar datos desde Firebase
function cargarDatosFirebase() {
    seleccionesRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            selecciones = data;
            actualizarResumen();
        }
    });
}

// Escuchar cambios en tiempo real desde Firebase
function escucharCambiosFirebase() {
    seleccionesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            selecciones = data;
            actualizarResumen();

            // Si el funcionario actual tiene datos, recargarlos
            if (funcionarioActual && selecciones[funcionarioActual]) {
                cargarSeleccionFuncionario();
            }
        } else {
            selecciones = {};
            actualizarResumen();
        }
    });
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
            const button = e.target.closest('.btn-increase');
            const food = button.dataset.food;
            cambiarContador(food, 1);
        });
    });

    document.querySelectorAll('.btn-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-decrease');
            const food = button.dataset.food;
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

    // Botón backup
    btnBackup.addEventListener('click', descargarBackup);

    // Botón restaurar
    btnRestore.addEventListener('click', () => {
        fileInput.click();
    });

    // Input de archivo
    fileInput.addEventListener('change', restaurarBackup);
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

    // Guardar en Firebase
    seleccionesRef.child(funcionarioActual).set(seleccion)
        .then(() => {
            alert('Selección guardada exitosamente');

            // Limpiar y resetear
            funcionarioSelect.value = '';
            funcionarioActual = '';
            foodCounters.classList.remove('active');
            limpiarContadores();
        })
        .catch((error) => {
            console.error('Error al guardar:', error);
            alert('Error al guardar la selección. Por favor intente nuevamente.');
        });
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
        html += `<td>
            <button class="action-btn edit-btn" onclick="editarSeleccion('${funcionario}')">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="action-btn delete-btn" onclick="eliminarSeleccion('${funcionario}')">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </td>`;
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

// Editar selección
function editarSeleccion(funcionario) {
    // Seleccionar el funcionario en el dropdown
    funcionarioSelect.value = funcionario;
    funcionarioActual = funcionario;

    // Activar el panel de selección
    foodCounters.classList.add('active');

    // Cargar los datos actuales
    cargarSeleccionFuncionario();

    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminar selección
function eliminarSeleccion(funcionario) {
    if (confirm(`¿Está seguro de eliminar la selección de ${funcionario}?`)) {
        seleccionesRef.child(funcionario).remove()
            .then(() => {
                console.log('Selección eliminada exitosamente');
            })
            .catch((error) => {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar la selección. Por favor intente nuevamente.');
            });
    }
}

// Exportar a Excel (XLSX)
function exportarAExcel() {
    if (Object.keys(selecciones).length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();

    // Preparar datos para la hoja
    const data = [];

    // Header principal
    const headers = ['Funcionario', ...ALIMENTOS.map(a => a.nombre), 'Total'];
    data.push(headers);

    // Datos de cada funcionario
    Object.keys(selecciones).sort().forEach(funcionario => {
        const seleccion = selecciones[funcionario];
        let total = 0;
        const row = [funcionario];

        ALIMENTOS.forEach(alimento => {
            const cantidad = seleccion[alimento.id] || 0;
            total += cantidad;
            row.push(cantidad || 0);
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

    // Crear hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Configurar anchos de columna
    const colWidths = [{ wch: 35 }]; // Columna de funcionarios más ancha
    for (let i = 0; i < ALIMENTOS.length + 1; i++) {
        colWidths.push({ wch: 15 });
    }
    ws['!cols'] = colWidths;

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Selección de Comida');

    // Generar archivo y descargar
    XLSX.writeFile(wb, `seleccion_comidas_${new Date().toISOString().split('T')[0]}.xlsx`);
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

// Descargar backup JSON
function descargarBackup() {
    if (Object.keys(selecciones).length === 0) {
        alert('No hay datos para respaldar');
        return;
    }

    const backup = {
        fecha: new Date().toISOString(),
        version: '1.0',
        totalRegistros: Object.keys(selecciones).length,
        datos: selecciones
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_seleccion_comidas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Backup creado exitosamente');
}

// Restaurar desde backup JSON
function restaurarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);

            // Validar estructura del backup
            if (!content.datos) {
                alert('Error: El archivo no tiene el formato correcto');
                return;
            }

            const numRegistros = Object.keys(content.datos).length;

            const confirmacion = confirm(
                `Archivo de backup encontrado:\n\n` +
                `Fecha: ${new Date(content.fecha).toLocaleString('es-ES')}\n` +
                `Registros: ${numRegistros}\n\n` +
                `¿Desea restaurar estos datos?\n\n` +
                `ADVERTENCIA: Esto sobrescribirá los datos actuales.`
            );

            if (confirmacion) {
                // Restaurar datos en Firebase
                seleccionesRef.set(content.datos)
                    .then(() => {
                        alert(`✓ Backup restaurado exitosamente.\n\n${numRegistros} registros recuperados.`);
                        selecciones = content.datos;
                        actualizarResumen();
                    })
                    .catch((error) => {
                        console.error('Error al restaurar:', error);
                        alert('Error al restaurar el backup. Por favor intente nuevamente.');
                    });
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            alert('Error: El archivo no es un JSON válido');
        }

        // Limpiar el input
        fileInput.value = '';
    };

    reader.readAsText(file);
}

// Hacer funciones accesibles globalmente para onclick
window.editarSeleccion = editarSeleccion;
window.eliminarSeleccion = eliminarSeleccion;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
