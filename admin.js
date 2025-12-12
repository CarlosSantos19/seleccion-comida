// Referencia a Firebase
const seleccionesRef = database.ref('selecciones');

// Elementos del DOM
const btnBackup = document.getElementById('btnBackup');
const btnRestore = document.getElementById('btnRestore');
const btnClearAll = document.getElementById('btnClearAll');
const fileInput = document.getElementById('fileInput');
const totalRegistros = document.getElementById('totalRegistros');
const totalAlimentos = document.getElementById('totalAlimentos');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');

// Cargar estadísticas
function cargarEstadisticas() {
    seleccionesRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const numRegistros = Object.keys(data).length;
            let totalAlimentosCount = 0;

            Object.values(data).forEach(seleccion => {
                Object.values(seleccion).forEach(cantidad => {
                    totalAlimentosCount += cantidad;
                });
            });

            totalRegistros.textContent = numRegistros;
            totalAlimentos.textContent = totalAlimentosCount;
        } else {
            totalRegistros.textContent = '0';
            totalAlimentos.textContent = '0';
        }
    });
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje) {
    successText.textContent = mensaje;
    successMessage.style.display = 'flex';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Descargar backup
function descargarBackup() {
    seleccionesRef.once('value', (snapshot) => {
        const data = snapshot.val();

        if (!data || Object.keys(data).length === 0) {
            alert('No hay datos para respaldar');
            return;
        }

        const backup = {
            fecha: new Date().toISOString(),
            version: '1.0',
            totalRegistros: Object.keys(data).length,
            datos: data
        };

        const jsonString = JSON.stringify(backup, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_seleccion_comidas_${new Date().toISOString().split('T')[0]}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mostrarExito(`Backup descargado exitosamente. ${Object.keys(data).length} registros respaldados.`);
        console.log('Backup creado exitosamente');
    }).catch((error) => {
        console.error('Error al crear backup:', error);
        alert('Error al crear el backup. Por favor intente nuevamente.');
    });
}

// Restaurar desde backup
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
            const fechaBackup = content.fecha ? new Date(content.fecha).toLocaleString('es-ES') : 'Desconocida';

            const confirmacion = confirm(
                `Archivo de backup encontrado:\n\n` +
                `Fecha del backup: ${fechaBackup}\n` +
                `Registros a restaurar: ${numRegistros}\n\n` +
                `¿Desea restaurar estos datos?\n\n` +
                `ADVERTENCIA: Esta acción sobrescribirá TODOS los datos actuales en la base de datos.\n` +
                `Se recomienda hacer un backup de los datos actuales antes de continuar.`
            );

            if (confirmacion) {
                // Crear backup automático antes de restaurar
                seleccionesRef.once('value', (snapshot) => {
                    const dataActual = snapshot.val();
                    if (dataActual && Object.keys(dataActual).length > 0) {
                        const backupAutomatico = {
                            fecha: new Date().toISOString(),
                            version: '1.0',
                            totalRegistros: Object.keys(dataActual).length,
                            datos: dataActual,
                            nota: 'Backup automático antes de restauración'
                        };

                        const jsonString = JSON.stringify(backupAutomatico, null, 2);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `backup_automatico_${new Date().toISOString().split('T')[0]}_${new Date().getTime()}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }

                    // Restaurar datos en Firebase
                    seleccionesRef.set(content.datos)
                        .then(() => {
                            mostrarExito(`Backup restaurado exitosamente. ${numRegistros} registros recuperados.`);
                            cargarEstadisticas();
                        })
                        .catch((error) => {
                            console.error('Error al restaurar:', error);
                            alert('Error al restaurar el backup. Por favor intente nuevamente.');
                        });
                });
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            alert('Error: El archivo no es un JSON válido o está corrupto.');
        }

        // Limpiar el input
        fileInput.value = '';
    };

    reader.readAsText(file);
}

// Limpiar toda la base de datos
function limpiarBaseDatos() {
    seleccionesRef.once('value', (snapshot) => {
        const data = snapshot.val();
        const numRegistros = data ? Object.keys(data).length : 0;

        if (numRegistros === 0) {
            alert('La base de datos ya está vacía.');
            return;
        }

        const confirmacion1 = confirm(
            `⚠️ ADVERTENCIA CRÍTICA ⚠️\n\n` +
            `Está a punto de ELIMINAR PERMANENTEMENTE todos los datos:\n\n` +
            `- ${numRegistros} registros serán eliminados\n` +
            `- Esta acción es IRREVERSIBLE\n\n` +
            `¿Está completamente seguro de que desea continuar?`
        );

        if (!confirmacion1) return;

        const confirmacion2 = confirm(
            `ÚLTIMA CONFIRMACIÓN\n\n` +
            `Se creará un backup automático antes de eliminar.\n\n` +
            `¿Confirma que desea ELIMINAR TODOS LOS DATOS?`
        );

        if (!confirmacion2) return;

        // Crear backup automático
        const backup = {
            fecha: new Date().toISOString(),
            version: '1.0',
            totalRegistros: numRegistros,
            datos: data,
            nota: 'Backup automático antes de limpiar base de datos'
        };

        const jsonString = JSON.stringify(backup, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_antes_limpiar_${new Date().toISOString().split('T')[0]}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Eliminar todos los datos
        seleccionesRef.remove()
            .then(() => {
                mostrarExito(`Base de datos limpiada. ${numRegistros} registros eliminados. Backup automático descargado.`);
                cargarEstadisticas();
            })
            .catch((error) => {
                console.error('Error al limpiar:', error);
                alert('Error al limpiar la base de datos. Por favor intente nuevamente.');
            });
    });
}

// Event listeners
btnBackup.addEventListener('click', descargarBackup);
btnRestore.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', restaurarBackup);
btnClearAll.addEventListener('click', limpiarBaseDatos);

// Cargar estadísticas al iniciar
cargarEstadisticas();

// Actualizar estadísticas en tiempo real
seleccionesRef.on('value', () => {
    cargarEstadisticas();
});
